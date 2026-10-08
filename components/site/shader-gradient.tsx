"use client";

import { type GradientT, presetsArray, ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export type GradientPreset = "Halo" | "Pensive" | "Universe" | "Mint" | "Interstella" | "Nighty night";

/**
 * Per-preset adjustments for wide, short containers: the camera moves closer
 * so the edges of the gradient plane never come into frame.
 */
const overrides: Partial<Record<GradientPreset, Partial<GradientT>>> = {
  Halo: { cDistance: 2.6 },
};

/** A shadergradient.co preset rendered full-bleed behind its parent. */
export default function ShaderGradientBackground({ preset }: { preset: GradientPreset }) {
  const props = presetsArray.find((item) => item.title === preset)?.props as GradientT | undefined;

  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      pixelDensity={1.5}
      fov={45}
    >
      <ShaderGradient control="props" {...props} {...overrides[preset]} />
    </ShaderGradientCanvas>
  );
}
