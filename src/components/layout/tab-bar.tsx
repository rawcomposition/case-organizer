import { useRef, useEffect, useState } from "react";
import { TAB_CONFIG, type CaseTab } from "@/lib/case-tabs";

interface TabBarProps {
  activeTab: CaseTab;
  onTabChange: (tab: CaseTab) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeButton = container.querySelector<HTMLButtonElement>(
      `[data-tab="${activeTab}"]`
    );
    if (!activeButton) return;

    setPillStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
    });
  }, [activeTab]);

  return (
    <div className="flex justify-center pb-4">
      <div
        ref={containerRef}
        className="relative inline-flex items-center gap-1 bg-secondary/60 p-1 rounded-full"
      >
        {/* Sliding active pill */}
        <div
          className="absolute top-1 h-[calc(100%-8px)] rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ left: pillStyle.left, width: pillStyle.width }}
        />

        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.id}
            data-tab={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative z-10 px-5 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
