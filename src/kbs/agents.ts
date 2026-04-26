/**
 * RejectedIn — 6-Agent KBS Pipeline (pure TypeScript, runs in-browser).
 *
 *  1. CV Analysis Agent           → extracts CandidateProfile
 *  2. Skill Matching Agent        → classifies strong/partial/missing per role skill
 *  3. Interview Question Agent    → produces tailored technical + HR questions
 *  4. Readiness Scoring Agent     → 0–100 with weighted breakdown
 *  5. Improvement Roadmap Agent   → short / medium / projects / strategy
 *  6. Final Decision Agent        → READY / PARTIALLY READY / NOT READY (rule-based)
 *
 *  Every meaningful inference is logged with an explicit rule ID so the
 *  Rule Trace tab gives full explainability.
 */

import { getRole, type RoleProfile } from "./knowledgeBase";
import type {
  AgentTrace,
  AnalyzeResult,
  CandidateProfile,
  RuleLogEntry,
  ScoreBreakdown,
  SkillGap,
} from "./types";

// ---------- shared rule log helper ---------------------------------------

class RuleLog {
  entries: RuleLogEntry[] = [];
  push(e: RuleLogEntry) {
    this.entries.push(e);
  }
}

// ---------- AGENT 1 · CV Analysis ----------------------------------------

const SKILL_LEXICON: { skill: string; aliases: string[] }[] = [
  { skill: "python", aliases: ["python", "py"] },
  { skill: "javascript", aliases: ["javascript", "js", "es6"] },
  { skill: "typescript", aliases: ["typescript", "ts"] },
  { skill: "react", aliases: ["react", "react.js", "reactjs"] },
  { skill: "next.js", aliases: ["next.js", "nextjs", "next"] },
  { skill: "node.js", aliases: ["node.js", "nodejs", "node"] },
  { skill: "html", aliases: ["html", "html5"] },
  { skill: "css", aliases: ["css", "css3", "scss", "sass"] },
  { skill: "tailwind", aliases: ["tailwind", "tailwindcss"] },
  { skill: "sql", aliases: ["sql", "postgresql", "postgres", "mysql", "sqlite", "mssql"] },
  { skill: "rest api", aliases: ["rest", "rest api", "restful", "api"] },
  { skill: "graphql", aliases: ["graphql"] },
  { skill: "git", aliases: ["git", "github", "gitlab"] },
  { skill: "docker", aliases: ["docker"] },
  { skill: "kubernetes", aliases: ["kubernetes", "k8s"] },
  { skill: "redis", aliases: ["redis"] },
  { skill: "kafka", aliases: ["kafka"] },
  { skill: "microservices", aliases: ["microservice", "microservices"] },
  { skill: "ci/cd", aliases: ["ci/cd", "cicd", "github actions", "gitlab ci", "jenkins"] },
  { skill: "testing", aliases: ["testing", "unit test", "integration test", "pytest", "jest", "vitest"] },
  { skill: "machine learning", aliases: ["machine learning", "ml", "scikit-learn", "sklearn"] },
  { skill: "deep learning", aliases: ["deep learning", "tensorflow", "pytorch", "keras"] },
  { skill: "pandas", aliases: ["pandas", "numpy"] },
  { skill: "statistics", aliases: ["statistics", "statistical", "probability"] },
  { skill: "spark", aliases: ["spark", "pyspark"] },
  { skill: "mlops", aliases: ["mlops", "mlflow", "weights & biases", "wandb"] },
  { skill: "linux", aliases: ["linux", "ubuntu", "debian", "centos", "bash"] },
  { skill: "bash", aliases: ["bash", "shell scripting"] },
  { skill: "networking", aliases: ["networking", "tcp/ip", "tcp", "udp", "dns"] },
  { skill: "tcp/ip", aliases: ["tcp/ip", "tcp ip"] },
  { skill: "routing", aliases: ["routing", "ospf", "bgp", "eigrp"] },
  { skill: "security fundamentals", aliases: ["security", "cybersecurity", "infosec", "owasp"] },
  { skill: "siem", aliases: ["siem", "splunk", "wazuh", "elk"] },
  { skill: "pentesting", aliases: ["pentesting", "penetration testing", "ctf", "tryhackme", "hackthebox"] },
  { skill: "incident response", aliases: ["incident response", "ir", "soc"] },
  { skill: "cloud security", aliases: ["cloud security"] },
  { skill: "scripting", aliases: ["scripting", "automation script"] },
  { skill: "aws", aliases: ["aws", "amazon web services", "ec2", "s3", "lambda"] },
  { skill: "terraform", aliases: ["terraform", "iac", "infrastructure as code"] },
  { skill: "ansible", aliases: ["ansible"] },
  { skill: "monitoring", aliases: ["monitoring", "prometheus", "grafana", "datadog"] },
  { skill: "mobile", aliases: ["mobile", "android", "ios"] },
  { skill: "react native", aliases: ["react native"] },
  { skill: "flutter", aliases: ["flutter", "dart"] },
  { skill: "swift", aliases: ["swift", "swiftui"] },
  { skill: "kotlin", aliases: ["kotlin"] },
  { skill: "figma", aliases: ["figma"] },
  { skill: "ui design", aliases: ["ui design", "ui/ux", "user interface"] },
  { skill: "ux research", aliases: ["ux research", "user research", "usability"] },
  { skill: "prototyping", aliases: ["prototyping", "wireframe", "wireframing"] },
  { skill: "design systems", aliases: ["design system", "design systems"] },
  { skill: "accessibility", aliases: ["accessibility", "a11y", "wcag"] },
  { skill: "test cases", aliases: ["test case", "test cases", "test plan"] },
  { skill: "bug tracking", aliases: ["bug tracking", "jira", "bugzilla"] },
  { skill: "automation", aliases: ["automation", "selenium", "cypress", "playwright"] },
  { skill: "selenium", aliases: ["selenium"] },
  { skill: "cypress", aliases: ["cypress"] },
  { skill: "api testing", aliases: ["api testing", "postman", "newman"] },
  { skill: "performance testing", aliases: ["performance testing", "jmeter", "k6"] },
  { skill: "excel", aliases: ["excel", "spreadsheets"] },
  { skill: "power bi", aliases: ["power bi", "powerbi"] },
  { skill: "tableau", aliases: ["tableau"] },
  { skill: "requirements gathering", aliases: ["requirements", "requirements gathering", "elicitation"] },
  { skill: "stakeholder management", aliases: ["stakeholder", "stakeholders"] },
  { skill: "agile", aliases: ["agile", "scrum", "kanban"] },
  { skill: "communication", aliases: ["communication", "presentation", "presented", "presenting"] },
  { skill: "backup", aliases: ["backup", "disaster recovery", "dr"] },
  { skill: "performance tuning", aliases: ["performance tuning", "query tuning", "optimization", "optimisation"] },
  { skill: "replication", aliases: ["replication", "failover", "high availability", "ha"] },
  { skill: "mongodb", aliases: ["mongodb", "mongo"] },
  { skill: "postgresql", aliases: ["postgresql", "postgres"] },
  { skill: "firewalls", aliases: ["firewall", "firewalls", "iptables"] },
  { skill: "vpn", aliases: ["vpn", "ipsec"] },
  { skill: "bgp", aliases: ["bgp"] },
  { skill: "sdn", aliases: ["sdn"] },
];

const COMM_INDICATORS = [
  "presented", "presentation", "communicated", "documented", "wrote", "blog",
  "talk", "speaker", "demo", "demonstrated", "stakeholder", "mentored",
];
const LEADERSHIP_INDICATORS = [
  "led", "leading", "leader", "leadership", "managed", "mentored", "owned",
  "spearheaded", "coordinated", "directed",
];

function cvAnalysisAgent(cv: string, log: RuleLog): { profile: CandidateProfile; trace: AgentTrace } {
  const lower = cv.toLowerCase();
  const triggered: string[] = [];
  const explanation: string[] = [];

  // R1 · skill detection via lexicon
  const skills = new Set<string>();
  const evidenceMap: Record<string, string[]> = {};
  for (const { skill, aliases } of SKILL_LEXICON) {
    for (const a of aliases) {
      const re = new RegExp(`(^|[^a-z0-9+])${a.replace(/[.+*?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9+]|$)`, "i");
      if (re.test(lower)) {
        skills.add(skill);
        (evidenceMap[skill] ??= []).push(a);
        break;
      }
    }
  }
  if (skills.size) {
    triggered.push("R1");
    log.push({
      rule_id: "R1",
      agent: "CV Analysis Agent",
      condition: "IF cv text contains known skill keywords",
      outcome: `THEN extract ${skills.size} skill(s) into candidate profile`,
      evidence: [...skills].slice(0, 8).join(", "),
    });
    explanation.push(`Detected ${skills.size} skills via lexicon match.`);
  }

  // R2 · experience years
  let years = 0;
  const yMatch = lower.match(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/);
  if (yMatch) {
    years = Math.min(parseFloat(yMatch[1]), 40);
    triggered.push("R2");
    log.push({
      rule_id: "R2",
      agent: "CV Analysis Agent",
      condition: "IF cv mentions explicit 'X years'",
      outcome: `THEN experience_years = ${years}`,
      evidence: yMatch[0],
    });
    explanation.push(`Parsed ${years} years of experience from text.`);
  }

  // R3 · projects extraction (lines starting with - or • near 'project')
  const projects: string[] = [];
  const lines = cv.split(/\r?\n/);
  let inProjects = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (/^projects?\b/i.test(line)) { inProjects = true; continue; }
    if (inProjects && /^(education|certifications?|skills?|experience|achievements?)\b/i.test(line)) {
      inProjects = false;
    }
    if (inProjects && /^[-•*]/.test(line)) {
      projects.push(line.replace(/^[-•*]\s*/, ""));
    } else if (/built|developed|created|implemented|designed/i.test(line) && line.length < 200 && line.length > 15) {
      projects.push(line);
    }
  }
  const uniqueProjects = [...new Set(projects)].slice(0, 8);
  if (uniqueProjects.length) {
    triggered.push("R3");
    log.push({
      rule_id: "R3",
      agent: "CV Analysis Agent",
      condition: "IF lines describe projects (built/developed/created)",
      outcome: `THEN capture ${uniqueProjects.length} project(s)`,
    });
  }

  // R4 · certifications
  const certs: string[] = [];
  const certIdx = lower.indexOf("certification");
  if (certIdx >= 0) {
    const slice = cv.slice(certIdx, certIdx + 500);
    const found = slice.split(/\r?\n/).map((l) => l.trim()).filter((l) => /^[-•*]/.test(l));
    for (const f of found) certs.push(f.replace(/^[-•*]\s*/, ""));
    if (certs.length) {
      triggered.push("R4");
      log.push({
        rule_id: "R4",
        agent: "CV Analysis Agent",
        condition: "IF cv contains a certifications block",
        outcome: `THEN capture ${certs.length} certification(s)`,
      });
    }
  }

  // R5 · education
  const education: string[] = [];
  if (/bachelor|master|phd|b\.sc|m\.sc|bsc|msc|university|college/i.test(cv)) {
    const eduMatches = cv.match(/(bachelor|master|phd|b\.sc|m\.sc|bsc|msc)[^.\n]{0,100}/gi);
    if (eduMatches) education.push(...eduMatches.map((s) => s.trim()).slice(0, 3));
    if (education.length) {
      triggered.push("R5");
      log.push({
        rule_id: "R5",
        agent: "CV Analysis Agent",
        condition: "IF cv mentions a degree keyword",
        outcome: `THEN capture education entry`,
      });
    }
  }

  // R6 · communication & leadership signals
  const comm = COMM_INDICATORS.filter((k) => lower.includes(k));
  const lead = LEADERSHIP_INDICATORS.filter((k) => lower.includes(k));
  if (comm.length) {
    triggered.push("R6");
    log.push({
      rule_id: "R6",
      agent: "CV Analysis Agent",
      condition: "IF cv contains communication signals (presented/documented/etc.)",
      outcome: `THEN flag ${comm.length} communication indicator(s)`,
      evidence: comm.join(", "),
    });
  }
  if (lead.length) {
    triggered.push("R7");
    log.push({
      rule_id: "R7",
      agent: "CV Analysis Agent",
      condition: "IF cv contains leadership verbs (led/managed/mentored)",
      outcome: `THEN flag ${lead.length} leadership indicator(s)`,
      evidence: lead.join(", "),
    });
  }

  const notes: string[] = [];
  if (skills.size === 0) notes.push("No recognised technical skills found — consider adding a Skills section.");
  if (years === 0) notes.push("Experience duration not explicit — add 'X years' phrasing.");

  return {
    profile: {
      skills: [...skills],
      projects: uniqueProjects,
      experience_years: years,
      certifications: certs,
      education,
      communication_indicators: comm,
      leadership_indicators: lead,
      notes,
    },
    trace: {
      agent: "CV Analysis Agent",
      rules_triggered: triggered,
      explanation,
    },
  };
}

// ---------- AGENT 2 · Skill Matching -------------------------------------

function skillMatchingAgent(
  profile: CandidateProfile,
  role: RoleProfile,
  log: RuleLog,
): { gaps: SkillGap[]; trace: AgentTrace } {
  const have = new Set(profile.skills.map((s) => s.toLowerCase()));
  const triggered = new Set<string>();
  const gaps: SkillGap[] = [];

  function classify(skill: string, kind: "required" | "advanced" | "critical") {
    const present = have.has(skill.toLowerCase());
    let status: SkillGap["status"];
    let severity: SkillGap["severity"];
    const ruleIds: string[] = [];

    if (present) {
      status = "strong";
      severity = "low";
      ruleIds.push(kind === "critical" ? "R10" : "R8");
      triggered.add(ruleIds[0]);
      log.push({
        rule_id: ruleIds[0],
        agent: "Skill Matching Agent",
        condition: `IF candidate has ${kind} skill '${skill}'`,
        outcome: `THEN classify as STRONG`,
      });
    } else if (kind === "critical") {
      status = "missing";
      severity = "high";
      ruleIds.push("R11");
      triggered.add("R11");
      log.push({
        rule_id: "R11",
        agent: "Skill Matching Agent",
        condition: `IF critical skill '${skill}' is missing`,
        outcome: `THEN flag MISSING with HIGH severity (blocker)`,
      });
    } else if (kind === "required") {
      status = "missing";
      severity = "medium";
      ruleIds.push("R9");
      triggered.add("R9");
      log.push({
        rule_id: "R9",
        agent: "Skill Matching Agent",
        condition: `IF required skill '${skill}' is missing`,
        outcome: `THEN flag MISSING with MEDIUM severity`,
      });
    } else {
      status = "partial";
      severity = "low";
      ruleIds.push("R12");
      triggered.add("R12");
      log.push({
        rule_id: "R12",
        agent: "Skill Matching Agent",
        condition: `IF advanced skill '${skill}' is missing`,
        outcome: `THEN classify as PARTIAL (nice-to-have gap)`,
      });
    }

    gaps.push({
      skill,
      status,
      category: kind,
      severity,
      rule_ids: ruleIds,
      evidence: present ? [`Detected in CV: ${skill}`] : [],
    });
  }

  for (const s of role.critical_skills) classify(s, "critical");
  for (const s of role.required_skills) {
    if (!role.critical_skills.includes(s)) classify(s, "required");
  }
  for (const s of role.advanced_skills) classify(s, "advanced");

  return {
    gaps,
    trace: {
      agent: "Skill Matching Agent",
      rules_triggered: [...triggered],
      explanation: [
        `Compared candidate skills against ${role.title} knowledge-base profile.`,
        `${gaps.filter((g) => g.status === "strong").length} strong, ` +
          `${gaps.filter((g) => g.status === "partial").length} partial, ` +
          `${gaps.filter((g) => g.status === "missing").length} missing.`,
      ],
    },
  };
}

// ---------- AGENT 3 · Interview Question Generator -----------------------

function interviewQuestionAgent(
  role: RoleProfile,
  gaps: SkillGap[],
  log: RuleLog,
): { qs: { technical_questions: string[]; hr_questions: string[] }; trace: AgentTrace } {
  const triggered: string[] = [];
  const tech = [...role.technical_question_bank];
  // R13 — add gap-targeted questions
  const missing = gaps.filter((g) => g.status === "missing").slice(0, 3);
  if (missing.length) {
    triggered.push("R13");
    for (const m of missing) {
      tech.push(`We didn't see ${m.skill} on your CV — how would you approach learning it in 30 days?`);
    }
    log.push({
      rule_id: "R13",
      agent: "Interview Question Agent",
      condition: "IF candidate has missing skills",
      outcome: `THEN inject ${missing.length} targeted gap question(s)`,
    });
  }
  // R14 — strong signal → deep-dive question
  const strong = gaps.filter((g) => g.status === "strong" && g.category !== "advanced").slice(0, 2);
  if (strong.length) {
    triggered.push("R14");
    for (const s of strong) {
      tech.push(`Tell me about the most complex problem you solved using ${s.skill}.`);
    }
    log.push({
      rule_id: "R14",
      agent: "Interview Question Agent",
      condition: "IF candidate is strong in core skills",
      outcome: `THEN inject deep-dive question(s)`,
    });
  }

  return {
    qs: {
      technical_questions: tech.slice(0, 10),
      hr_questions: role.hr_question_bank.slice(0, 6),
    },
    trace: {
      agent: "Interview Question Agent",
      rules_triggered: triggered,
      explanation: [
        `Mixed role question bank with gap-aware and strength-aware questions.`,
      ],
    },
  };
}

// ---------- AGENT 4 · Readiness Scoring ----------------------------------

function readinessAgent(
  profile: CandidateProfile,
  gaps: SkillGap[],
  log: RuleLog,
): { score: number; breakdown: ScoreBreakdown; explanation: string[]; trace: AgentTrace } {
  const triggered: string[] = [];
  const totalCore = gaps.filter((g) => g.category !== "advanced").length || 1;
  const strongCore = gaps.filter((g) => g.category !== "advanced" && g.status === "strong").length;
  const techRatio = strongCore / totalCore;

  // R15 · technical skills (weight 40)
  const technical_skills = Math.round(techRatio * 40);
  triggered.push("R15");
  log.push({
    rule_id: "R15",
    agent: "Readiness Scoring Agent",
    condition: "IF technical coverage = strong_core / total_core",
    outcome: `THEN technical_skills = ${technical_skills}/40 (coverage ${(techRatio * 100).toFixed(0)}%)`,
  });

  // R16 · projects (weight 20)
  const projects = Math.min(profile.projects.length * 5, 20);
  triggered.push("R16");
  log.push({
    rule_id: "R16",
    agent: "Readiness Scoring Agent",
    condition: "IF candidate has documented projects",
    outcome: `THEN projects = ${projects}/20 (${profile.projects.length} project(s))`,
  });

  // R17 · experience (weight 20) — 5 pts per year up to 20
  const experience = Math.min(Math.round(profile.experience_years * 5), 20);
  triggered.push("R17");
  log.push({
    rule_id: "R17",
    agent: "Readiness Scoring Agent",
    condition: "IF candidate has explicit years of experience",
    outcome: `THEN experience = ${experience}/20`,
  });

  // R18 · communication (weight 20)
  const commPts = Math.min(profile.communication_indicators.length * 4, 12);
  const leadPts = Math.min(profile.leadership_indicators.length * 4, 8);
  const communication = commPts + leadPts;
  triggered.push("R18");
  log.push({
    rule_id: "R18",
    agent: "Readiness Scoring Agent",
    condition: "IF cv shows communication + leadership signals",
    outcome: `THEN communication = ${communication}/20`,
  });

  const breakdown: ScoreBreakdown = { technical_skills, projects, experience, communication };
  const score = technical_skills + projects + experience + communication;

  return {
    score,
    breakdown,
    explanation: [
      `Technical coverage: ${strongCore}/${totalCore} core skills strong.`,
      `Projects detected: ${profile.projects.length}.`,
      `Experience parsed: ${profile.experience_years} year(s).`,
      `Communication/leadership signals: ${profile.communication_indicators.length}/${profile.leadership_indicators.length}.`,
    ],
    trace: {
      agent: "Readiness Scoring Agent",
      rules_triggered: triggered,
      explanation: [`Final readiness score = ${score}/100.`],
    },
  };
}

// ---------- AGENT 5 · Improvement Roadmap --------------------------------

function roadmapAgent(role: RoleProfile, gaps: SkillGap[], score: number, log: RuleLog) {
  const triggered: string[] = [];
  const missing = gaps.filter((g) => g.status === "missing").map((g) => g.skill);
  const partial = gaps.filter((g) => g.status === "partial").map((g) => g.skill);

  const short_term = [...role.short_term_recommendations];
  if (missing.length) {
    triggered.push("R19");
    short_term.unshift(`Close hard gaps first: ${missing.slice(0, 4).join(", ")}.`);
    log.push({
      rule_id: "R19",
      agent: "Improvement Roadmap Agent",
      condition: "IF missing skills exist",
      outcome: "THEN prioritise closing hard gaps in short-term plan",
    });
  }
  const medium_term = [...role.medium_term_recommendations];
  if (partial.length) {
    triggered.push("R20");
    medium_term.unshift(`Strengthen advanced skills: ${partial.slice(0, 4).join(", ")}.`);
    log.push({
      rule_id: "R20",
      agent: "Improvement Roadmap Agent",
      condition: "IF advanced/partial gaps exist",
      outcome: "THEN add to medium-term plan",
    });
  }
  if (score < 50) {
    triggered.push("R21");
    short_term.unshift("Focus on fundamentals before applying — rebuild core projects.");
    log.push({
      rule_id: "R21",
      agent: "Improvement Roadmap Agent",
      condition: "IF readiness score < 50",
      outcome: "THEN recommend foundation rebuild before applying",
    });
  }

  return {
    roadmap: {
      short_term,
      medium_term,
      recommended_projects: role.recommended_projects,
      interview_strategy: role.interview_strategy,
    },
    trace: {
      agent: "Improvement Roadmap Agent",
      rules_triggered: triggered,
      explanation: [`Roadmap derived from ${gaps.length} gap classifications and score ${score}.`],
    } satisfies AgentTrace,
  };
}

// ---------- AGENT 6 · Final Decision -------------------------------------

function decisionAgent(score: number, gaps: SkillGap[], log: RuleLog) {
  const triggered: string[] = [];
  const criticalGaps = gaps
    .filter((g) => g.category === "critical" && g.status === "missing")
    .map((g) => g.skill);

  let recommendation: string;
  let justification: string;
  let ruleEngineDecision: string;

  if (criticalGaps.length > 0) {
    recommendation = "NOT READY";
    triggered.push("R22");
    ruleEngineDecision = "R22 fired: at least one critical skill is missing.";
    justification = `Critical blockers prevent readiness: ${criticalGaps.join(", ")}. ` +
      `Address these before applying.`;
    log.push({
      rule_id: "R22",
      agent: "Final Decision Agent",
      condition: "IF any critical_skill is MISSING",
      outcome: "THEN recommendation = NOT READY",
    });
  } else if (score >= 75) {
    recommendation = "READY";
    triggered.push("R23");
    ruleEngineDecision = "R23 fired: score ≥ 75 with no critical blockers.";
    justification = `Strong overall profile (${score}/100) with no critical gaps. Apply with confidence.`;
    log.push({
      rule_id: "R23",
      agent: "Final Decision Agent",
      condition: "IF score ≥ 75 AND no critical gaps",
      outcome: "THEN recommendation = READY",
    });
  } else if (score >= 50) {
    recommendation = "PARTIALLY READY";
    triggered.push("R24");
    ruleEngineDecision = "R24 fired: 50 ≤ score < 75.";
    justification = `Mid-range profile (${score}/100). Apply selectively while closing gaps.`;
    log.push({
      rule_id: "R24",
      agent: "Final Decision Agent",
      condition: "IF 50 ≤ score < 75",
      outcome: "THEN recommendation = PARTIALLY READY",
    });
  } else {
    recommendation = "NOT READY";
    triggered.push("R25");
    ruleEngineDecision = "R25 fired: score < 50.";
    justification = `Low overall readiness (${score}/100). Follow the roadmap before interviewing.`;
    log.push({
      rule_id: "R25",
      agent: "Final Decision Agent",
      condition: "IF score < 50",
      outcome: "THEN recommendation = NOT READY",
    });
  }

  return {
    recommendation: {
      recommendation,
      justification,
      rule_engine_decision: ruleEngineDecision,
      critical_gaps: criticalGaps,
    },
    trace: {
      agent: "Final Decision Agent",
      rules_triggered: triggered,
      explanation: [ruleEngineDecision],
    } satisfies AgentTrace,
  };
}

// ---------- Pipeline orchestrator ----------------------------------------

export function runPipeline(cvText: string, roleId: string): AnalyzeResult {
  const log = new RuleLog();
  const role = getRole(roleId);

  const a1 = cvAnalysisAgent(cvText, log);
  const a2 = skillMatchingAgent(a1.profile, role, log);
  const a3 = interviewQuestionAgent(role, a2.gaps, log);
  const a4 = readinessAgent(a1.profile, a2.gaps, log);
  const a5 = roadmapAgent(role, a2.gaps, a4.score, log);
  const a6 = decisionAgent(a4.score, a2.gaps, log);

  return {
    profile: {
      candidate_profile: a1.profile,
      role_profile: {
        title: role.title,
        required_skills: role.required_skills,
        advanced_skills: role.advanced_skills,
        critical_skills: role.critical_skills,
      },
    },
    skill_gap_analysis: a2.gaps,
    interview_questions: a3.qs,
    readiness_score: {
      score: a4.score,
      breakdown: a4.breakdown,
      explanation: a4.explanation,
    },
    roadmap: a5.roadmap,
    recommendation: a6.recommendation,
    traces: [a1.trace, a2.trace, a3.trace, a4.trace, a5.trace, a6.trace],
    rule_log: log.entries,
  };
}
