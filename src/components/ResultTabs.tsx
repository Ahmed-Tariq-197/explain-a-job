import type { AnalyzeResult as AnalyzeResponse, SkillGap } from "@/kbs/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, XCircle, BookOpen, Brain, MessageSquare, Gauge, Map, ScrollText, ListChecks } from "lucide-react";

function statusVariant(status: string) {
  if (status === "strong") return { cls: "bg-success/15 text-success border-success/30", Icon: CheckCircle2 };
  if (status === "partial") return { cls: "bg-warning/20 text-foreground border-warning/40", Icon: AlertTriangle };
  return { cls: "bg-destructive/10 text-destructive border-destructive/30", Icon: XCircle };
}

function ruleIds(item: SkillGap): string[] {
  if (item.rule_ids?.length) return item.rule_ids;
  if (item.rule_id) return [item.rule_id];
  return [];
}

export function ResultTabs({ data }: { data: AnalyzeResponse }) {
  const p = data.profile.candidate_profile;
  const role = data.profile.role_profile;
  const r = data.readiness_score;
  const score = Math.round(r.score ?? 0);
  const breakdown = r.breakdown ?? {};
  const rec = data.recommendation;
  const recText = rec.recommendation ?? "";
  const recCls = recText.includes("NOT")
    ? "bg-destructive text-destructive-foreground"
    : recText.includes("PARTIAL")
      ? "bg-warning text-foreground"
      : "bg-success text-primary-foreground";

  const tq = data.interview_questions.technical_questions ?? [];
  const hq = data.interview_questions.hr_questions ?? [];
  const roadmap = data.roadmap;
  const ruleLog = data.rule_log ?? [];

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-7 h-auto">
        <TabsTrigger value="profile" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" />Profile</TabsTrigger>
        <TabsTrigger value="gaps" className="gap-1.5"><Brain className="h-3.5 w-3.5" />Skill Gaps</TabsTrigger>
        <TabsTrigger value="questions" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Questions</TabsTrigger>
        <TabsTrigger value="score" className="gap-1.5"><Gauge className="h-3.5 w-3.5" />Score</TabsTrigger>
        <TabsTrigger value="roadmap" className="gap-1.5"><Map className="h-3.5 w-3.5" />Roadmap</TabsTrigger>
        <TabsTrigger value="decision" className="gap-1.5"><ListChecks className="h-3.5 w-3.5" />Decision</TabsTrigger>
        <TabsTrigger value="trace" className="gap-1.5"><ScrollText className="h-3.5 w-3.5" />Rule Trace</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Candidate Profile</CardTitle>
            <CardDescription>Extracted by the CV Analysis Agent · Target role: {role.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-semibold">Detected Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {(p.skills ?? []).slice(0, 30).map((s) => (
                  <Badge key={s} variant="secondary" className="bg-accent text-accent-foreground">{s}</Badge>
                ))}
                {!p.skills?.length && <p className="text-sm text-muted-foreground">No skills detected.</p>}
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div><dt className="text-muted-foreground">Experience</dt><dd className="font-semibold">{p.experience_years ?? 0} yrs</dd></div>
              <div><dt className="text-muted-foreground">Projects</dt><dd className="font-semibold">{(p.projects ?? []).length}</dd></div>
              <div><dt className="text-muted-foreground">Certifications</dt><dd className="font-semibold">{(p.certifications ?? []).length}</dd></div>
              <div><dt className="text-muted-foreground">Comm. signals</dt><dd className="font-semibold">{(p.communication_indicators ?? []).length}</dd></div>
            </dl>
            {!!p.education?.length && (
              <p className="text-sm"><span className="text-muted-foreground">Education: </span>{p.education.join(" · ")}</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="gaps" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Skill Matching Agent · Each classification cites its IF–THEN rule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.skill_gap_analysis.map((item, i) => {
              const { cls, Icon } = statusVariant(item.status);
              return (
                <div key={i} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                  <div className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium capitalize">{item.skill}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.category && <>Category: {item.category} · </>}
                        {item.severity && <>Severity: {item.severity}</>}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={cls} variant="outline">{item.status.toUpperCase()}</Badge>
                    <div className="flex flex-wrap justify-end gap-1">
                      {ruleIds(item).map((id) => (
                        <Badge key={id} variant="outline" className="font-mono text-[10px]">{id}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="questions" className="mt-4 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Technical Questions</CardTitle><CardDescription>Generated from role patterns + detected gaps</CardDescription></CardHeader>
          <CardContent><ol className="list-decimal space-y-2 pl-5 text-sm">{tq.map((q, i) => <li key={i}>{q}</li>)}</ol></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>HR Questions</CardTitle><CardDescription>Behavioural and motivational</CardDescription></CardHeader>
          <CardContent><ol className="list-decimal space-y-2 pl-5 text-sm">{hq.map((q, i) => <li key={i}>{q}</li>)}</ol></CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="score" className="mt-4 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Readiness Score</CardTitle><CardDescription>Readiness Scoring Agent</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
            <Progress value={score} />
            <ul className="space-y-1 text-xs text-muted-foreground">
              {(r.explanation ?? []).map((x, i) => <li key={i}>• {x}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { k: "technical_skills", label: "Technical Skills", max: 40 },
              { k: "projects", label: "Projects", max: 20 },
              { k: "experience", label: "Experience", max: 20 },
              { k: "communication", label: "Communication", max: 20 },
            ].map(({ k, label, max }) => {
              const v = breakdown[k] ?? 0;
              return (
                <div key={k}>
                  <div className="mb-1 flex justify-between"><span>{label}</span><span className="font-semibold">{v}/{max}</span></div>
                  <Progress value={(v / max) * 100} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="roadmap" className="mt-4 grid gap-4 md:grid-cols-2">
        {[
          { title: "Short-Term Improvements", items: roadmap.short_term },
          { title: "Medium-Term Plan", items: roadmap.medium_term },
          { title: "Recommended Projects", items: roadmap.recommended_projects },
          { title: "Interview Strategy", items: roadmap.interview_strategy },
        ].map(({ title, items }) => (
          <Card key={title}>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm">{(items ?? []).map((x, i) => <li key={i}>{x}</li>)}</ul>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="decision" className="mt-4">
        <Card>
          <CardHeader><CardTitle>Final Recommendation</CardTitle><CardDescription>Final Decision Agent</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold ${recCls}`}>
              {recText}
            </div>
            <p className="text-sm">{rec.justification}</p>
            <div className="rounded-md border border-border bg-muted/40 p-3 text-xs">
              <p><span className="font-semibold">Rule engine decision:</span> {rec.rule_engine_decision}</p>
              <p className="mt-1"><span className="font-semibold">Critical gaps:</span> {rec.critical_gaps?.join(", ") || "None"}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Agent Traces</h4>
              <div className="space-y-2">
                {data.traces.map((t, i) => (
                  <div key={i} className="rounded-md border border-border p-2.5 text-xs">
                    <p className="font-semibold">{t.agent}</p>
                    {!!t.rules_triggered?.length && (
                      <p className="mt-1 flex flex-wrap gap-1">
                        {t.rules_triggered.map((id) => <Badge key={id} variant="outline" className="font-mono text-[10px]">{id}</Badge>)}
                      </p>
                    )}
                    {!!t.explanation?.length && <ul className="mt-1 list-disc pl-4 text-muted-foreground">{t.explanation.map((e, j) => <li key={j}>{e}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trace" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Rule Trace</CardTitle>
            <CardDescription>Every IF–THEN rule fired by the inference engine — full explainability</CardDescription>
          </CardHeader>
          <CardContent>
            {ruleLog.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No rule_log returned by the API. (Aggregated rule IDs are still visible per-agent in the Decision tab.)
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <tr><th className="py-2 pr-3">Rule</th><th className="py-2 pr-3">Condition</th><th className="py-2">Outcome</th></tr>
                  </thead>
                  <tbody>
                    {ruleLog.map((e, i) => (
                      <tr key={i} className="border-b border-border/60 align-top">
                        <td className="py-2 pr-3"><Badge variant="outline" className="font-mono text-[10px]">{e.rule_id ?? e.id}</Badge></td>
                        <td className="py-2 pr-3 text-muted-foreground">{e.condition}</td>
                        <td className="py-2 font-medium">{e.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
