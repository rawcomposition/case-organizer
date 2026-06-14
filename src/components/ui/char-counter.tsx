import { cn } from "@/lib/utils";

/** Fraction of the limit at which the counter turns yellow */
const WARN_THRESHOLD = 0.9;

interface CharCounterProps {
  count: number;
  limit: number | null;
  className?: string;
}

/**
 * Subtle character counter pill. Position it via `className` (e.g. inline in a
 * label row, or absolutely in a textarea corner). Turns yellow when approaching
 * the limit and red once it's reached. Renders nothing when no limit is set.
 */
export function CharCounter({ count, limit, className }: CharCounterProps) {
  if (!limit) return null;

  const atLimit = count >= limit;
  const approaching = count >= limit * WARN_THRESHOLD;

  return (
    <span
      className={cn(
        "pointer-events-none inline-flex select-none items-center rounded-full border bg-background px-1.5 py-0.5 text-[11px] leading-none tabular-nums shadow-sm",
        atLimit
          ? "border-red-500/40 text-red-500"
          : approaching
            ? "border-yellow-500/40 text-yellow-600"
            : "border-border text-muted-foreground/70",
        className
      )}
    >
      {count}/{limit}
    </span>
  );
}
