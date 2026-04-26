import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { ResultTabs } from "@/components/ResultTabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel,
} from "@/components/ui/select";
import { Loader2, Sparkles, FileText, Cpu, BookMarked, ScrollText } from "lucide-react";
import { ROLE_OPTIONS, ROLE_KB } from "@/kbs/knowledgeBase";
import { runPipeline } from "@/kbs/agents";
import type { AnalyzeResult } from "@/kbs/types";
import { SAMPLE_CVS } from "@/sample-cv";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({ component: Index });

const AGENT_PIPELINE = [
  "CV Analysis Agent",
  "Skill Matching Agent",
  "Interview Question Agent",
  "Readiness Scoring Agent",
  "Improvement Roadmap Agent",
  "Final Decision Agent",
];

function Index() {
  const [cv, setCv] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState(0);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, typeof ROLE_OPTIONS> = {};
    for (const r of ROLE_OPTIONS) (map[r.category] ??= []).push(r);
    return map;
  }, []);

  async function onAnalyze() {
    if (cv.trim().length < 20) {
      toast.error("Please paste at least 20 characters of CV text.");
      return;
    }
    setLoading(true);
    setResult(null);
    setActiveAgent(0);

    // Animate the 6-agent pipeline so users see real progress.
    for (let i = 0; i < AGENT_PIPELINE.length; i++) {
      setActiveAgent(i);
      // Simulated agent latency for realistic UX (~250ms each).
      await new Promise((r) => setTimeout(r, 250));
    }

    try {
      const data = runPipeline(cv, role);
      setResult(data);
      toast.success(`Analysis complete · ${data.rule_log.length} rules fired`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="mb-6 rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                The brutally honest readiness check LinkedIn won't give you.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Six collaborating agents reason over an explicit role knowledge base and a transparent rule engine.
                Every decision is traceable to an IF–THEN rule — no black boxes.
              </p>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <Stat icon={<Cpu className="h-3.5 w-3.5" />} label="6 Agents" />
              <Stat icon={<ScrollText className="h-3.5 w-3.5" />} label="25+ Rules" />
              <Stat icon={<BookMarked className="h-3.5 w-3.5" />} label={`${ROLE_KB.length} Roles`} />
            </div>
          </div>
        </section>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Submit your CV</CardTitle>
            <CardDescription>Paste plain text — the CV Analysis Agent will extract skills, projects, experience and signals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Target Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(grouped).map(([cat, items]) => (
                      <SelectGroup key={cat}>
                        <SelectLabel>{cat}</SelectLabel>
                        {items.map((r) => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Try a sample CV</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCv(SAMPLE_CVS.strong)}>Strong candidate</Button>
                  <Button variant="outline" size="sm" onClick={() => setCv(SAMPLE_CVS.midlevel)}>Mid-level</Button>
                  <Button variant="outline" size="sm" onClick={() => setCv(SAMPLE_CVS.weak)}>Weak</Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv">CV / Resume Text</Label>
              <Textarea id="cv" rows={12} value={cv} onChange={(e) => setCv(e.target.value)}
                placeholder="Paste your full CV text here…&#10;&#10;Include: skills, experience, projects, education, certifications…" />
            </div>
            <Button onClick={onAnalyze} disabled={loading} size="lg" className="w-full sm:w-auto">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Running multi-agent pipeline…" : "Run Multi-Agent Analysis"}
            </Button>

            {loading && (
              <div className="rounded-md border border-border bg-muted/40 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pipeline progress
                </p>
                <ol className="space-y-1.5 text-sm">
                  {AGENT_PIPELINE.map((name, i) => {
                    const state = i < activeAgent ? "done" : i === activeAgent ? "active" : "pending";
                    return (
                      <li key={name} className="flex items-center gap-2">
                        <span className={
                          "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold " +
                          (state === "done" ? "bg-success text-primary-foreground" :
                            state === "active" ? "bg-primary text-primary-foreground" :
                            "bg-muted text-muted-foreground")
                        }>
                          {i + 1}
                        </span>
                        <span className={state === "pending" ? "text-muted-foreground" : "font-medium"}>
                          {name}
                        </span>
                        {state === "active" && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        {result && <ResultTabs data={result} />}

        <footer className="mt-10 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          RejectedIn · Knowledge-Based Multi-Agent System · Explainable rule-based AI
        </footer>
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1">
      {icon}<span className="font-medium text-foreground">{label}</span>
    </div>
  );
}
