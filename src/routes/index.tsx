import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ResultTabs } from "@/components/ResultTabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { analyze, ROLE_OPTIONS, getApiBase, type AnalyzeResponse } from "@/lib/api";
import { SAMPLE_CV } from "@/sample-cv";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [cv, setCv] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[0].value);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  async function onAnalyze() {
    if (cv.trim().length < 20) {
      toast.error("Please paste at least 20 characters of CV text.");
      return;
    }
    if (!getApiBase()) {
      setSettingsOpen(true);
      toast.error("Configure your FastAPI backend URL first.");
      return;
    }
    setLoading(true);
    try {
      const data = await analyze({ cv_text: cv, target_role: role, job_description: jd });
      setResult(data);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="mb-6 rounded-xl border border-border bg-gradient-to-br from-primary/5 via-card to-card p-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Get the brutally honest readiness check LinkedIn won't give you.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Six specialised agents analyse your CV, match it against an explicit role knowledge base, and explain every
            decision through traceable IF–THEN rules. No black boxes — just classic expert-system reasoning.
          </p>
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
                    {ROLE_OPTIONS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jd">Job Description (optional)</Label>
                <Input id="jd" placeholder="Paste a JD snippet to bias matching" value={jd} onChange={(e) => setJd(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cv">CV Text</Label>
                <Button variant="ghost" size="sm" onClick={() => setCv(SAMPLE_CV)} className="h-7 text-xs">Load sample CV</Button>
              </div>
              <Textarea id="cv" rows={10} value={cv} onChange={(e) => setCv(e.target.value)} placeholder="Paste your full CV text here…" />
            </div>
            <Button onClick={onAnalyze} disabled={loading} size="lg" className="w-full sm:w-auto">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Running 6 agents…" : "Analyze CV"}
            </Button>
          </CardContent>
        </Card>

        {result && <ResultTabs data={result} />}

        <footer className="mt-10 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          RejectedIn · Knowledge-Based Multi-Agent System · Explainable rule-based AI
        </footer>
      </main>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
