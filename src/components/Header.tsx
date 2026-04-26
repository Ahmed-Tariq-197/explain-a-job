import logo from "@/assets/rejectedin-logo.png";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="RejectedIn logo" className="h-9 w-9 rounded-md" />
          <div>
            <h1 className="text-base font-bold leading-tight text-foreground">
              Rejected<span className="text-primary">In</span>
            </h1>
            <p className="text-[11px] leading-tight text-muted-foreground">
              Multi-Agent Knowledge-Based System
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onOpenSettings} className="gap-1.5">
          <Settings className="h-4 w-4" />
          API Settings
        </Button>
      </div>
    </header>
  );
}
