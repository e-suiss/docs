import { cn } from "cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-[24px] leading-none tracking-[-0.03em]", className)}>
      <span className="font-semibold">suiss</span>
      <span className="font-semibold">Developer</span>
    </span>
  );
}
