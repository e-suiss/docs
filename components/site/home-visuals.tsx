import {
  ArrowsClockwiseIcon,
  BellIcon,
  ChatCircleIcon,
  CheckIcon,
  FingerprintIcon,
  HourglassIcon,
  LockSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import type * as React from "react";

/*
 * Product "shots" drawn in HTML and CSS. Each one is cropped by the bottom of
 * its tile, the way apple.com lets hardware bleed off the edge.
 */

/** A passkey sign-in sheet for Access. */
export function PasskeyVisual() {
  return (
    <div className="mx-auto flex w-[300px] translate-y-10 flex-col items-center gap-4 rounded-[28px] bg-surface-raised px-7 pt-9 pb-16 shadow-[0_24px_60px_rgba(0,0,0,0.16)] ring-1 ring-black/6 dark:ring-white/10">
      <span className="flex size-20 items-center justify-center rounded-[22px] bg-accent text-white">
        <FingerprintIcon weight="light" className="size-12" />
      </span>
      <p className="text-center text-[19px] font-semibold">Sign in with a passkey</p>
      <p className="text-center text-[13px] text-label-secondary">
        Use Touch ID to sign in to <span className="font-semibold text-label">acme.com</span>.
      </p>
      <span className="mt-2 w-full rounded-full bg-accent py-2.5 text-center text-[15px] font-semibold text-white">
        Continue
      </span>
      <span className="flex items-center gap-1.5 text-[12px] text-label-secondary">
        <LockSimpleIcon className="size-3" /> Approved for agent “Booking Assistant”
      </span>
    </div>
  );
}

/** A stack of notification banners for Relay. */
export function NotificationsVisual() {
  const items = [
    { icon: BellIcon, tint: "bg-[#ff3b30]", title: "Order shipped", body: "Your package is on the way.", time: "now" },
    { icon: ChatCircleIcon, tint: "bg-[#34c759]", title: "Approval needed", body: "Agent wants to send an invoice.", time: "2m ago" },
    { icon: ArrowsClockwiseIcon, tint: "bg-[#007aff]", title: "Retrying via SMS", body: "Push was not delivered.", time: "5m ago" },
  ];
  return (
    <div className="mx-auto flex w-[min(380px,90%)] translate-y-10 flex-col gap-2.5">
      {items.map((item, index) => (
        <div
          key={item.title}
          style={{ opacity: 1 - index * 0.18, scale: `${1 - index * 0.03}` }}
          className="flex items-start gap-3 rounded-[22px] bg-white/72 p-3.5 text-start text-black shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl"
        >
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-[10px] text-white", item.tint)}>
            <item.icon weight="fill" className="size-5.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-[15px] font-semibold">{item.title}</p>
              <p className="shrink-0 text-[12px] text-black/45">{item.time}</p>
            </div>
            <p className="truncate text-[14px] text-black/70">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** A list of commitments and waits for Work. */
export function CommitmentsVisual() {
  const items = [
    { title: "Ship onboarding redesign", who: "Promised by Maya", state: "done" },
    { title: "Review contract terms", who: "Waiting on Legal", state: "waiting" },
    { title: "Draft release notes", who: "Agent · in progress", state: "agent" },
  ];
  return (
    <div className="mx-auto w-[min(400px,90%)] translate-y-10 overflow-hidden rounded-[22px] bg-surface-raised text-start shadow-[0_24px_60px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
      <p className="px-5 pt-5 pb-3 text-[13px] font-semibold text-label-secondary">Needs attention</p>
      <ul className="divide-y divide-separator pb-10">
        {items.map((item) => (
          <li key={item.title} className="flex items-center gap-3 px-5 py-3.5">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full",
                item.state === "done" && "bg-[#34c759] text-white",
                item.state === "waiting" && "bg-[#ff9f0a]/18 text-[#ff9f0a]",
                item.state === "agent" && "bg-accent/18 text-link",
              )}
            >
              {item.state === "done" && <CheckIcon weight="bold" className="size-3.5" />}
              {item.state === "waiting" && <HourglassIcon weight="fill" className="size-3.5" />}
              {item.state === "agent" && <ArrowsClockwiseIcon weight="bold" className="size-3.5" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold">{item.title}</p>
              <p className="truncate text-[13px] text-label-secondary">{item.who}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A soft, glowing orb for One. */
export function OrbVisual() {
  return (
    <div className="relative mx-auto size-[300px] translate-y-6">
      <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#5e5ce6,#bf5af2,#ff375f,#ff9f0a,#64d2ff,#5e5ce6)] opacity-80 blur-3xl motion-reduce:animate-none" />
      <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.95),rgba(255,255,255,0.35)_40%,rgba(255,255,255,0)_70%)]" />
    </div>
  );
}
