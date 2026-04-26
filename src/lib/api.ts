export type AnalyzeRequest = {
  cv_text: string;
  target_role: string;
  job_description?: string;
};

export type SkillGap = {
  skill: string;
  status: "strong" | "partial" | "missing" | string;
  category?: string;
  severity?: string;
  rule_id?: string;
  rule_ids?: string[];
  evidence?: string[];
};

export type AgentTrace = {
  agent: string;
  actions?: string[];
  rules_triggered?: string[];
  explanation?: string[];
};

export type RuleLogEntry = {
  rule_id?: string;
  id?: string;
  condition?: string;
  outcome?: string;
  evidence?: string | string[];
};

export type AnalyzeResponse = {
  profile: {
    candidate_profile: {
      skills?: string[];
      projects?: string[];
      experience_years?: number;
      certifications?: string[];
      education?: string[];
      communication_indicators?: string[];
      leadership_indicators?: string[];
      notes?: string[];
    };
    role_profile: {
      title: string;
      required_skills?: string[];
      advanced_skills?: string[];
      critical_skills?: string[];
    };
  };
  skill_gap_analysis: SkillGap[];
  interview_questions: {
    technical_questions?: string[];
    hr_questions?: string[];
  };
  readiness_score: {
    score?: number;
    breakdown?: Record<string, number>;
    explanation?: string[];
  };
  roadmap: {
    short_term?: string[];
    medium_term?: string[];
    recommended_projects?: string[];
    interview_strategy?: string[];
  };
  recommendation: {
    recommendation?: string;
    justification?: string;
    rule_engine_decision?: string;
    critical_gaps?: string[];
  };
  traces: AgentTrace[];
  rule_log?: RuleLogEntry[];
};

const API_KEY = "rejectedin.apiBaseUrl";

export function getApiBase(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(API_KEY) ?? "";
}

export function setApiBase(url: string) {
  window.localStorage.setItem(API_KEY, url.replace(/\/+$/, ""));
}

export async function analyze(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const base = getApiBase();
  if (!base) {
    throw new Error(
      "API URL not configured. Open Settings and paste your FastAPI base URL (e.g. https://your-app.onrender.com).",
    );
  }
  const res = await fetch(`${base}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Server returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const detail = (data as { detail?: string })?.detail ?? `HTTP ${res.status}`;
    throw new Error(detail);
  }
  return data as AnalyzeResponse;
}

export const ROLE_OPTIONS = [
  { value: "backend_developer", label: "Backend Developer" },
  { value: "frontend_developer", label: "Frontend Developer" },
  { value: "data_scientist", label: "Data Scientist" },
  { value: "cyber_security", label: "Cyber Security Analyst" },
];
