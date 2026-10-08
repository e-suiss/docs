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

/**
 * Overlays start closed in the docs: their stories open them on mount for
 * Storybook, which here would cover the page before anyone asks for them.
 */
const overlays = new Set([
  "action-menu",
  "alert-dialog",
  "alert-sheet",
  "combobox",
  "command-palette",
  "confirm",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "flyout",
  "fullscreen-menu",
  "hover-card",
  "menubar",
  "modal",
  "popover",
  "preview",
  "select",
  "sheet",
  "tooltip",
]);

/** A story's identity once it is forced closed: its render and its other args. */
function closedKey(story: Story) {
  const { defaultOpen: _defaultOpen, open: _open, ...rest } = story.args ?? {};
  return { render: story.render, args: JSON.stringify(rest) };
}

/**
 * Drops stories that, closed, are the same as an earlier one, like
 * "OpenByDefault" next to "Default". Variants that were only opened for
 * Storybook's screenshots stay.
 */
function withoutClosedDuplicates(entries: (readonly [string, Story])[]) {
  const seen: ReturnType<typeof closedKey>[] = [];
  return entries.filter(([, story]) => {
    const key = closedKey(story);
    if (seen.some((other) => other.render === key.render && other.args === key.args)) return false;
    seen.push(key);
    return true;
  });
}

/** "WithIcon" → "With icon". */
function labelOf(key: string, story: Story, closed: boolean) {
  const name = story.name ?? key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  // "Open left" reads wrong for a preview that now starts closed.
  const label = closed ? name.replace(/^open\s+/i, "") : name;
  return label.charAt(0).toUpperCase() + label.slice(1);
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
function StoryView({ meta, story, closed }: { meta: Meta; story: Story; closed?: boolean }) {
  const args: Args = { ...meta.args, ...story.args };
  if (closed) {
    args.defaultOpen = false;
    delete args.open;
  }
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
function StoryPreviewOf({ name, story: only }: { name: string; story?: string }) {
  const [module, setModule] = React.useState<Record<string, unknown>>();
  React.useEffect(() => {
    stories[name]?.().then(setModule);
  }, [name]);
  if (!module) return <Loading />;

  const meta = (module.default ?? {}) as Meta;
  const closed = overlays.has(name);
  const all = Object.entries(module)
    .filter(([key, value]) => key !== "default" && value && typeof value === "object")
    .map(([key, value]) => [key, value as Story] as const);
  const deduped = closed ? withoutClosedDuplicates(all) : all;
  // A single named story renders alone and unlabeled, inside an Example.
  const entries = only ? all.filter(([key]) => key === only) : deduped;

  return (
    <>
      {entries.map(([key, story], index) => (
        <Frame
          key={key}
          label={index === 0 || only ? undefined : labelOf(key, story, closed)}
          layout={story.parameters?.layout ?? meta.parameters?.layout}
        >
          <StoryView meta={meta} story={story} closed={closed} />
        </Frame>
      ))}
    </>
  );
}

/** A live preview of a suiss UI registry item. */
export function ComponentPreview({ kind, name, story }: { kind: Kind; name: string; story?: string }) {
  if (kind === "chart" || kind === "block") return <ComponentPreviewOf name={name} wide={kind === "block"} />;
  return <StoryPreviewOf name={name} story={story} />;
}
