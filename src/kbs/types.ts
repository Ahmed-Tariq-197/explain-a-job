/** Shared types for the RejectedIn KBS pipeline. */

export type SkillStatus = "strong" | "partial" | "missing";

export type CandidateProfile = {
  skills: string[];
  projects: string[];
  experience_years: number;
  certifications: string[];
  education: string[];
  communication_indicators: string[];
  leadership_indicators: string[];
  notes: string[];
};

export type SkillGap = {
  skill: string;
  status: SkillStatus;
  category: "required" | "advanced" | "critical";
  severity: "low" | "medium" | "high";
  rule_ids: string[];
  evidence: string[];
};

export type ScoreBreakdown = {
  technical_skills: number; // /40
  projects: number;         // /20
  experience: number;       // /20
  communication: number;    // /20
};

export type RuleLogEntry = {
  rule_id: string;
  agent: string;
  condition: string;
  outcome: string;
  evidence?: string;
};

export type AgentTrace = {
  agent: string;
  rules_triggered: string[];
  explanation: string[];
};

export type AnalyzeResult = {
  profile: {
    candidate_profile: CandidateProfile;
    role_profile: {
      title: string;
      required_skills: string[];
      advanced_skills: string[];
      critical_skills: string[];
    };
  };
  skill_gap_analysis: SkillGap[];
  interview_questions: {
    technical_questions: string[];
    hr_questions: string[];
  };
  readiness_score: {
    score: number;
    breakdown: ScoreBreakdown;
    explanation: string[];
  };
  roadmap: {
    short_term: string[];
    medium_term: string[];
    recommended_projects: string[];
    interview_strategy: string[];
  };
  recommendation: {
    recommendation: string;
    justification: string;
    rule_engine_decision: string;
    critical_gaps: string[];
  };
  traces: AgentTrace[];
  rule_log: RuleLogEntry[];
};
