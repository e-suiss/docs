"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { LiquidBackground } from "@/components/site/liquid-background";
import { getProduct, type ProductSlug } from "@/lib/products";
import { strings } from "@/lib/strings";

type Slide = { slug: ProductSlug; image: string };

const slides: Slide[] = [
  { slug: "access", image: "/images/platform-access-v4.jpg" },
  { slug: "relay", image: "/images/platform-relay.jpg" },
  { slug: "work", image: "/images/platform-work.jpg" },
  { slug: "one", image: "/images/platform-one.jpg" },
];

const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";

function Card({ slide, index }: { slide: Slide; index: number }) {
  const [active, setActive] = React.useState(false);
  const product = getProduct(slide.slug);
  if (!product) return null;

  return (
    <Anchor
      href={`/docs/${slide.slug}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group relative flex h-full w-[min(86vw,68rem)] shrink-0 snap-start flex-col overflow-hidden rounded-[32px] bg-black text-white outline-none focus-visible:focus-ring"
    >
      <LiquidBackground image={slide.image} active={active} />
      <div
        aria-hidden
        style={{ backgroundImage: grain }}
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.35),rgba(0,0,0,0)_55%)]" />

      <div className="relative flex items-start justify-between gap-4 p-6 md:p-10">
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs tracking-[0.02em] uppercase">
            ({String(index + 1).padStart(2, "0")}) {product.tagline.replace(/\.$/, "")}
          </p>
          {product.status && (
            <span className="rounded-full bg-white/18 px-2.5 py-0.5 font-mono text-[11px] tracking-[0.02em] uppercase backdrop-blur-xl">
              {strings.preAlpha}
            </span>
          )}
        </div>
        <span
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-full bg-white/18 backdrop-blur-xl transition-[rotate,background-color,color] duration-700 group-hover:rotate-45 group-hover:bg-white group-hover:text-black",
            ease,
          )}
        >
          <ArrowUpRightIcon className="size-5" />
        </span>
      </div>

      <div className="relative mt-auto flex flex-col justify-between gap-4 p-6 md:flex-row md:items-end md:p-10">
        <h3
          className={cn(
            "text-[clamp(5rem,13vw,13rem)] leading-[0.78] font-semibold tracking-[-0.07em] transition-transform duration-1000 group-hover:translate-x-3",
            ease,
          )}
        >
          {product.name}
        </h3>
        <p className="max-w-xs text-[17px] leading-[1.35] tracking-[-0.02em] text-white/85 md:pb-3">
          {product.summary}
        </p>
      </div>
    </Anchor>
  );
}

export function PlatformScroller({ header }: { header: React.ReactNode }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [distance, setDistance] = React.useState(0);

  React.useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const desktop = window.matchMedia("(min-width: 48rem)");

    const measure = () => {
      setDistance(desktop.matches ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
    };
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0);
      });
    };

    measure();
    update();
    const observer = new ResizeObserver(() => {
      measure();
      update();
    });
    observer.observe(track);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ height: distance > 0 ? `calc(100svh + ${distance}px)` : undefined }}
      className="relative"
    >
      <div className="flex flex-col gap-10 py-20 md:sticky md:top-0 md:h-svh md:justify-center md:gap-12 md:overflow-hidden md:py-12">
        {header}
        <div
          ref={trackRef}
          style={{ transform: `translate3d(${-progress * distance}px, 0, 0)` }}
          className="flex h-[70svh] min-h-[520px] gap-3 px-5 will-change-transform max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto md:h-[62svh] md:w-max md:px-10"
        >
          {slides.map((slide, index) => (
            <Card key={slide.slug} slide={slide} index={index} />
          ))}
        </div>
        <div className="mx-5 hidden h-px bg-label/15 md:mx-10 md:block">
          <div className="h-full origin-left bg-label" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  );
}
