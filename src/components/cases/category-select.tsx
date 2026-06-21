import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Option {
  /** undefined = the "None" (clear) option */
  num: number | undefined;
  label: string;
}

/**
 * Searchable, keyboard-navigable list of categories. Used both inside the form
 * combobox and the review-mode edit modal. Calls onSelect with the 1-based
 * category number (or undefined for "None").
 */
export function CategoryList({
  categories,
  value,
  onSelect,
  autoFocus,
}: {
  categories: string[];
  value?: number;
  onSelect: (num: number | undefined) => void;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  // Start highlighted on the current selection so it's visible (and scrolled
  // into view) when the list opens. None is index 0; category N is index N.
  const [highlight, setHighlight] = useState(value ?? 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const options = useMemo<Option[]>(
    () => [
      { num: undefined, label: "None" },
      ...categories.map((label, i) => ({ num: i + 1, label })),
    ],
    [categories]
  );

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      q === ""
        ? options
        : options.filter(
            (o) =>
              o.num !== undefined &&
              (o.label.toLowerCase().includes(q) || String(o.num) === q)
          ),
    [options, q]
  );

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Keep the highlighted row in view as the user arrows through
  useEffect(() => {
    itemRefs.current[highlight]?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  const commit = (idx: number) => {
    const opt = filtered[idx];
    if (opt) onSelect(opt.num);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(highlight);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b px-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0); // restart at the top of the newly filtered list
          }}
          onKeyDown={onKeyDown}
          placeholder="Search categories…"
          className="h-10 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="max-h-72 overflow-y-auto p-1">
        {filtered.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            No matches
          </div>
        ) : (
          filtered.map((opt, idx) => {
            const selected =
              opt.num === value || (opt.num === undefined && value == null);
            const active = idx === highlight;
            return (
              <button
                key={opt.num ?? "none"}
                type="button"
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                onClick={() => commit(idx)}
                onMouseMove={() => setHighlight(idx)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none",
                  active && "bg-primary/10 text-accent-foreground",
                  opt.num === undefined && "text-muted-foreground"
                )}
              >
                <span className="flex-1">
                  {opt.num !== undefined ? `${opt.num}. ${opt.label}` : opt.label}
                </span>
                {selected && <Check className="size-4 shrink-0" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

/** Form combobox: a trigger button that opens the searchable list in a popover. */
export function CategorySelect({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value?: number;
  onChange: (num: number | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const currentLabel = value != null ? categories[value - 1] : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            value == null && "text-muted-foreground"
          )}
        >
          <span className="truncate text-left">
            {value != null ? `${value}. ${currentLabel}` : "Select a category"}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <CategoryList
          categories={categories}
          value={value}
          autoFocus
          onSelect={(num) => {
            onChange(num);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
