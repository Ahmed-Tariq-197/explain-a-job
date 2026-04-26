import logo from "@/assets/rejectedin-logo.png";

export function Header() {
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
              Multi-Agent Knowledge-Based System · Explainable rule-based AI
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
          <span>6 Agents</span>
          <span>·</span>
          <span>25+ Inference Rules</span>
          <span>·</span>
          <span>{15} Role Profiles</span>
        </nav>
      </div>
    </header>
  );
}
