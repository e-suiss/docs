"use client";

import { cn } from "cn";
import * as React from "react";

import { components, stories } from "@/demos/registry";

type Kind = "ui" | "pattern" | "interaction" | "chart" | "block";
type Args = Record<string, unknown>;
type Layout = "centered" | "padded" | "fullscreen";
type Context = { args: Args; parameters: Record<string, unknown>; globals: Record<string, unknown> };
type Decorator = (Story: React.ComponentType, context: Context) => React.ReactNode;
type Story = {
  name?: string;
  args?: Args;
  render?: (args: Args, context: Context) => React.ReactNode;
  decorators?: Decorator[];
  parameters?: { layout?: Layout };
};
type Meta = {
  component?: React.ComponentType<Args>;
  args?: Args;
  decorators?: Decorator[];
  parameters?: { layout?: Layout };
};

/** "WithIcon" → "With icon". */
function labelOf(key: string, story: Story) {
  if (story.name) return story.name;
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Keeps one failing example from taking the page down. */
class Boundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <p className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">Preview unavailable</p>
      );
    }
    return this.props.children;
  }
}

/** Renders a story the way Storybook does: its own decorators inside the file's. */
function StoryView({ meta, story }: { meta: Meta; story: Story }) {
  const args = { ...meta.args, ...story.args };
  const context: Context = {
    args,
    parameters: { ...meta.parameters, ...story.parameters },
    globals: {},
  };

  let Rendered: React.ComponentType = function Base() {
    if (story.render) return <>{story.render(args, context)}</>;
    const Component = meta.component;
    return Component ? <Component {...args} /> : null;
  };
  for (const decorate of [...(story.decorators ?? []), ...(meta.decorators ?? [])]) {
    const Inner: React.ComponentType = Rendered;
    Rendered = function Decorated(): React.ReactNode {
      return <>{decorate(Inner, context)}</>;
    };
  }
  return <Rendered />;
}

function Frame({
  wide,
  layout = "centered",
  label,
  children,
}: {
  wide?: boolean;
  layout?: Layout;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-not-prose className="mt-[1.2em] flex flex-col gap-3">
      {label && <p className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">{label}</p>}
      <div
        data-slot="preview"
        className={cn(
          "overflow-hidden rounded-[24px]",
          "bg-surface ring-1 ring-label/10",
          // Mirrors Storybook's layouts: centered by default, padded, or edge to edge.
          !wide && layout === "centered" && "flex min-h-56 flex-wrap items-center justify-center gap-3 p-10",
          !wide && layout === "padded" && "min-h-56 p-6",
        )}
      >
        <Boundary>{children}</Boundary>
      </div>
    </div>
  );
}

function Loading({ wide }: { wide?: boolean }) {
  return <div data-not-prose className={cn("mt-[1.2em] animate-pulse rounded-[24px] bg-surface-secondary", wide ? "h-96" : "h-56")} />;
}

/** Charts and blocks: the registry item itself. */
function ComponentPreviewOf({ name, wide }: { name: string; wide: boolean }) {
  const [Component, setComponent] = React.useState<React.ComponentType>();
  React.useEffect(() => {
    components[name]?.().then((loaded) => setComponent(() => loaded));
  }, [name]);
  if (!Component) return <Loading wide={wide} />;
  return (
    <Frame wide={wide}>
      {wide ? (
        <Component />
      ) : (
        <div className="w-full max-w-xl">
          <Component />
        </div>
      )}
    </Frame>
  );
}

/** Components, patterns and interactions: every story, the first one as the hero. */
function StoryPreviewOf({ name }: { name: string }) {
  const [module, setModule] = React.useState<Record<string, unknown>>();
  React.useEffect(() => {
    stories[name]?.().then(setModule);
  }, [name]);
  if (!module) return <Loading />;

  const meta = (module.default ?? {}) as Meta;
  const entries = Object.entries(module)
    .filter(([key, value]) => key !== "default" && value && typeof value === "object")
    .map(([key, value]) => [key, value as Story] as const);

  return (
    <>
      {entries.map(([key, story], index) => (
        <Frame
          key={key}
          label={index === 0 ? undefined : labelOf(key, story)}
          layout={story.parameters?.layout ?? meta.parameters?.layout}
        >
          <StoryView meta={meta} story={story} />
        </Frame>
      ))}
    </>
  );
}

/** A live preview of a suiss UI registry item. */
export function ComponentPreview({ kind, name }: { kind: Kind; name: string }) {
  if (kind === "chart" || kind === "block") return <ComponentPreviewOf name={name} wide={kind === "block"} />;
  return <StoryPreviewOf name={name} />;
}
