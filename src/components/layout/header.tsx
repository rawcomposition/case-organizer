import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportCasesToJSON } from "@/lib/export";

export function Header() {
  return (
    <header className="flex items-center justify-between pb-8 pt-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Case Organizer
        </h1>
        <p className="text-muted-foreground mt-1">
          Organize and track your medical cases
        </p>
      </div>
      <Button variant="outline" onClick={exportCasesToJSON}>
        <Download className="mr-2 h-4 w-4" />
        Export JSON
      </Button>
    </header>
  );
}
