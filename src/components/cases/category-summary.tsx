import { useMemo, useState } from "react";
import { ChartColumn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCaseStore } from "@/store/case-store";
import { getCategories, type CaseTab } from "@/lib/case-tabs";

/**
 * Toolbar button that opens a dialog summarizing how many cases fall into each
 * category for the active tab. Office has no categories, so it renders nothing.
 */
export function CategorySummary({ activeTab }: { activeTab: CaseTab }) {
  const [open, setOpen] = useState(false);
  const cases = useCaseStore((s) => s.cases);
  const categories = getCategories(activeTab);

  // Count cases per 1-based category number, plus an "uncategorized" tally.
  const { counts, uncategorized, total } = useMemo(() => {
    const counts: Record<number, number> = {};
    let uncategorized = 0;
    let total = 0;
    for (const c of cases) {
      if ((c.caseType ?? "ob") !== activeTab) continue;
      total++;
      if (c.category == null) uncategorized++;
      else counts[c.category] = (counts[c.category] ?? 0) + 1;
    }
    return { counts, uncategorized, total };
  }, [cases, activeTab]);

  if (!categories) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Category summary">
          <ChartColumn className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Category Summary</DialogTitle>
          <DialogDescription>
            Total cases per category for {activeTab.toUpperCase()} ({total} total).
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto -mx-2 px-2">
          <ul className="divide-y">
            {categories.map((label, i) => {
              const num = i + 1;
              const count = counts[num] ?? 0;
              return (
                <li
                  key={num}
                  className="flex items-start justify-between gap-4 py-2"
                >
                  <span className="text-sm">
                    <span className="text-muted-foreground">{num}.</span> {label}
                  </span>
                  <Badge
                    variant={count ? "default" : "secondary"}
                    className="mt-0.5 tabular-nums"
                  >
                    {count}
                  </Badge>
                </li>
              );
            })}
            {uncategorized > 0 && (
              <li className="flex items-start justify-between gap-4 py-2">
                <span className="text-sm text-muted-foreground">
                  Uncategorized
                </span>
                <Badge variant="secondary" className="mt-0.5 tabular-nums">
                  {uncategorized}
                </Badge>
              </li>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
