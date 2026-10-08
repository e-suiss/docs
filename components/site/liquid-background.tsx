"use client";

import * as React from "react";

/**
 * The card image, warped by slowly shifting noise while the card is hovered so
 * its shapes flow like the hero's shader. The warp eases in and out; at rest
 * the filter is removed entirely so scrolling stays cheap.
 */
export function LiquidBackground({ image, active }: { image: string; active: boolean }) {
  const id = `liquid-${React.useId().replace(/:/g, "")}`;
  const layer = React.useRef<HTMLDivElement>(null);
  const turbulence = React.useRef<SVGFETurbulenceElement>(null);
  const displacement = React.useRef<SVGFEDisplacementMapElement>(null);
  const strength = React.useRef(0);
  const time = React.useRef(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      time.current += delta;
      strength.current += ((active ? 1 : 0) - strength.current) * Math.min(1, delta / 400);
      const t = time.current;
      turbulence.current?.setAttribute(
        "baseFrequency",
        `${0.0022 + Math.sin(t / 3600) * 0.0008} ${0.0034 + Math.cos(t / 4400) * 0.001}`,
      );
      displacement.current?.setAttribute("scale", String(strength.current * 70));
      if (layer.current) layer.current.style.filter = strength.current > 0.005 ? `url(#${id})` : "";
      if (active || strength.current > 0.005) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, id]);

  return (
    <>
      <svg aria-hidden className="absolute size-0">
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence ref={turbulence} type="fractalNoise" baseFrequency="0.0022 0.0034" numOctaves={2} seed={4} />
          <feDisplacementMap ref={displacement} in="SourceGraphic" scale={0} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        ref={layer}
        aria-hidden
        style={{ backgroundImage: `url(${image})` }}
        className="absolute -inset-[6%] bg-cover bg-center"
      />
    </>
  );
}
