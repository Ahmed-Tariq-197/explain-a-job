/**
 * RejectedIn — Knowledge Base
 *
 * Explicit, declarative role profiles. New roles can be added here without
 * touching any reasoning logic. Every agent reads from this KB.
 */

export type RoleProfile = {
  id: string;
  title: string;
  category: "Engineering" | "Data" | "Security" | "Design" | "Operations" | "Business";
  required_skills: string[];      // baseline expected
  advanced_skills: string[];      // nice-to-have
  critical_skills: string[];      // hard blockers if missing
  recommended_projects: string[];
  technical_question_bank: string[];
  hr_question_bank: string[];
  short_term_recommendations: string[];
  medium_term_recommendations: string[];
  interview_strategy: string[];
};

const HR_BANK_BASE = [
  "Tell me about yourself in two minutes.",
  "Describe a time you disagreed with a teammate and how you resolved it.",
  "Why this role and why now?",
  "Walk me through your most impactful project.",
  "Where do you see yourself in three years?",
  "Tell me about a failure and what you learned.",
];

export const ROLE_KB: RoleProfile[] = [
  {
    id: "backend_developer",
    title: "Backend Developer",
    category: "Engineering",
    required_skills: ["python", "sql", "rest api", "git", "testing"],
    advanced_skills: ["docker", "kubernetes", "redis", "kafka", "microservices", "ci/cd"],
    critical_skills: ["sql", "rest api"],
    recommended_projects: [
      "Build a multi-tenant REST API with auth, rate limiting and observability",
      "Design a job queue system using Redis + workers",
      "Containerise a service with Docker and deploy via CI/CD",
    ],
    technical_question_bank: [
      "Explain the difference between SQL transactions isolation levels.",
      "How would you design a rate limiter for a public API?",
      "Walk me through how you would scale a REST service from 100 to 100k req/min.",
      "What is the N+1 query problem and how do you fix it?",
      "Compare REST vs gRPC — when would you pick each?",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Practise SQL joins, indexing and query plans",
      "Write unit + integration tests for one of your APIs",
      "Add structured logging and error handling to a side project",
    ],
    medium_term_recommendations: [
      "Ship a Dockerised microservice with CI/CD",
      "Learn message queues (Kafka or RabbitMQ) hands-on",
      "Contribute to an open-source backend project",
    ],
    interview_strategy: [
      "Lead with a concrete API you built end-to-end",
      "Quantify scale: requests, latency, data size",
      "Be ready to whiteboard a database schema",
    ],
  },
  {
    id: "frontend_developer",
    title: "Frontend Developer",
    category: "Engineering",
    required_skills: ["html", "css", "javascript", "react", "git"],
    advanced_skills: ["typescript", "next.js", "tailwind", "testing", "accessibility", "performance"],
    critical_skills: ["javascript", "react"],
    recommended_projects: [
      "Build a responsive dashboard with charts and dark mode",
      "Ship a TypeScript component library with Storybook",
      "Optimise a slow page to a perfect Lighthouse score",
    ],
    technical_question_bank: [
      "Explain the React rendering lifecycle and reconciliation.",
      "How do you prevent unnecessary re-renders?",
      "What is CLS and how do you eliminate it?",
      "Compare CSS-in-JS vs utility-first CSS.",
      "How would you make a complex form accessible?",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Convert a JS project to TypeScript",
      "Add automated tests with Vitest or Jest",
      "Audit one project with Lighthouse and fix the top 3 issues",
    ],
    medium_term_recommendations: [
      "Build a production app with Next.js or TanStack Start",
      "Master one state library (Zustand, Redux Toolkit, or TanStack Query)",
      "Learn WCAG and ship accessible components",
    ],
    interview_strategy: [
      "Show a live deployed project, not just GitHub",
      "Talk about UX trade-offs you made",
      "Discuss performance numbers, not just features",
    ],
  },
  {
    id: "data_scientist",
    title: "Data Scientist",
    category: "Data",
    required_skills: ["python", "sql", "statistics", "pandas", "machine learning"],
    advanced_skills: ["deep learning", "mlops", "spark", "experimentation", "feature engineering"],
    critical_skills: ["statistics", "machine learning"],
    recommended_projects: [
      "End-to-end ML pipeline with feature store and model registry",
      "A/B test analysis with proper power calculation",
      "Forecasting model deployed as an API",
    ],
    technical_question_bank: [
      "Explain bias vs variance with a concrete example.",
      "How would you design an A/B test for a checkout change?",
      "What is regularisation and when is L1 better than L2?",
      "Walk me through cross-validation strategies for time series.",
      "How do you detect and handle data leakage?",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Re-derive logistic regression and gradient descent on paper",
      "Publish a Kaggle notebook with clean EDA",
      "Practise SQL window functions on real datasets",
    ],
    medium_term_recommendations: [
      "Deploy one model behind an API with monitoring",
      "Run a real experiment and write up the analysis",
      "Learn one MLOps tool (MLflow, Weights & Biases)",
    ],
    interview_strategy: [
      "Lead with business impact, not model accuracy",
      "Have one project where you handled messy real data",
      "Be ready to defend your statistical choices",
    ],
  },
  {
    id: "cyber_security",
    title: "Cyber Security Analyst",
    category: "Security",
    required_skills: ["networking", "linux", "security fundamentals", "scripting"],
    advanced_skills: ["siem", "threat intelligence", "pentesting", "incident response", "cloud security"],
    critical_skills: ["networking", "security fundamentals"],
    recommended_projects: [
      "Build and document a home SOC lab with Wazuh or Splunk",
      "Run a CTF write-up series on your blog",
      "Automate a phishing-email triage workflow",
    ],
    technical_question_bank: [
      "Walk me through how TLS works.",
      "How would you investigate a suspicious outbound connection?",
      "Explain the difference between IDS, IPS and EDR.",
      "What are the OWASP Top 10 — pick three and explain mitigations.",
      "Describe the kill chain for a phishing-driven breach.",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Complete TryHackMe or HackTheBox beginner paths",
      "Set up Wireshark and capture/analyse real traffic",
      "Read one recent breach post-mortem per week",
    ],
    medium_term_recommendations: [
      "Pursue Security+, BTL1, or eJPT certification",
      "Run a SIEM at home and write detection rules",
      "Contribute a Sigma or YARA rule",
    ],
    interview_strategy: [
      "Show how you think under uncertainty",
      "Have specific incidents or labs to walk through",
      "Demonstrate awareness of recent threats",
    ],
  },
  {
    id: "fullstack_developer",
    title: "Full Stack Developer",
    category: "Engineering",
    required_skills: ["javascript", "react", "node.js", "sql", "rest api", "git"],
    advanced_skills: ["typescript", "docker", "next.js", "testing", "ci/cd"],
    critical_skills: ["react", "rest api"],
    recommended_projects: [
      "Ship a SaaS-style app with auth, billing and a dashboard",
      "Build a real-time collaborative tool (websockets)",
      "Deploy a full-stack app with CI/CD and monitoring",
    ],
    technical_question_bank: [
      "Walk through how a request travels from your React UI to the database.",
      "Where would you put business logic — frontend, API, or DB?",
      "How do you handle auth across frontend and backend?",
      "Explain optimistic UI updates with conflict handling.",
      "How do you keep types consistent across the stack?",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Standardise types across frontend/backend (e.g. shared schema)",
      "Add end-to-end tests with Playwright",
      "Document one project with a clear architecture diagram",
    ],
    medium_term_recommendations: [
      "Ship one product end-to-end and get real users",
      "Learn one infra tool (Terraform or Pulumi)",
      "Practise system design weekly",
    ],
    interview_strategy: [
      "Tell stories that span the full stack",
      "Be honest about which side is your stronger suit",
      "Show production deploys, not just code",
    ],
  },
  {
    id: "devops_engineer",
    title: "DevOps Engineer",
    category: "Operations",
    required_skills: ["linux", "bash", "docker", "ci/cd", "git"],
    advanced_skills: ["kubernetes", "terraform", "aws", "monitoring", "ansible"],
    critical_skills: ["docker", "ci/cd"],
    recommended_projects: [
      "Provision infra with Terraform on AWS or GCP",
      "Build a multi-stage CI/CD pipeline with rollbacks",
      "Set up Prometheus + Grafana for a real service",
    ],
    technical_question_bank: [
      "Walk through your deployment pipeline end-to-end.",
      "How do you do zero-downtime deploys?",
      "Explain blue/green vs canary deployments.",
      "How would you debug a pod stuck in CrashLoopBackOff?",
      "What does your incident response runbook look like?",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Containerise an existing app with multi-stage Dockerfiles",
      "Build a pipeline in GitHub Actions or GitLab CI",
      "Practise writing Bash + Python automation scripts",
    ],
    medium_term_recommendations: [
      "Run a personal Kubernetes cluster (k3s, kind)",
      "Get an AWS or CKAD certification",
      "Master one IaC tool deeply",
    ],
    interview_strategy: [
      "Lead with reliability metrics (uptime, MTTR)",
      "Show a real pipeline you own",
      "Be ready for Linux + networking troubleshooting questions",
    ],
  },
  {
    id: "mobile_developer",
    title: "Mobile Developer",
    category: "Engineering",
    required_skills: ["mobile", "git", "rest api"],
    advanced_skills: ["react native", "flutter", "swift", "kotlin", "testing", "ci/cd"],
    critical_skills: ["mobile"],
    recommended_projects: [
      "Ship a published app to App Store or Play Store",
      "Build an offline-first app with sync",
      "Add push notifications and deep linking",
    ],
    technical_question_bank: [
      "Compare React Native vs Flutter vs native.",
      "How do you handle offline mode and sync conflicts?",
      "Explain the mobile app lifecycle.",
      "How do you reduce app bundle size and cold-start time?",
      "How do you secure local storage on a mobile device?",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Publish at least one app to a real store",
      "Learn the platform design guidelines (HIG / Material)",
      "Profile and fix performance on a real device",
    ],
    medium_term_recommendations: [
      "Master one cross-platform stack deeply",
      "Add automated UI tests (Detox, XCUITest)",
      "Set up over-the-air updates",
    ],
    interview_strategy: [
      "Bring a phone with your app installed",
      "Discuss store rejections and how you fixed them",
      "Show metrics: crash-free users, performance",
    ],
  },
  {
    id: "ui_ux_designer",
    title: "UI/UX Designer",
    category: "Design",
    required_skills: ["figma", "ui design", "ux research", "prototyping"],
    advanced_skills: ["design systems", "accessibility", "user testing", "motion design"],
    critical_skills: ["figma", "ui design"],
    recommended_projects: [
      "Redesign a real product flow with before/after metrics",
      "Build a small design system in Figma with tokens",
      "Run a moderated usability test and document findings",
    ],
    technical_question_bank: [
      "Walk me through your design process from brief to handoff.",
      "How do you balance aesthetics with usability?",
      "Show a project where research changed your design.",
      "How do you design for accessibility?",
      "How do you collaborate with engineers on edge cases?",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Tighten your portfolio to 3 strong case studies",
      "Add measurable outcomes to each case study",
      "Practise critique by reviewing public products",
    ],
    medium_term_recommendations: [
      "Lead one project end-to-end, including research",
      "Learn enough HTML/CSS to prototype in code",
      "Build or contribute to a design system",
    ],
    interview_strategy: [
      "Story-tell each case study, don't just narrate screens",
      "Show your messy middle, not just polished finals",
      "Be ready to whiteboard a UX problem live",
    ],
  },
  {
    id: "qa_engineer",
    title: "QA / Software Tester",
    category: "Engineering",
    required_skills: ["testing", "test cases", "bug tracking", "git"],
    advanced_skills: ["automation", "selenium", "cypress", "api testing", "performance testing"],
    critical_skills: ["testing"],
    recommended_projects: [
      "Build an automated regression suite with Cypress or Playwright",
      "Write API tests with Postman/Newman in CI",
      "Run and report a load test with k6 or JMeter",
    ],
    technical_question_bank: [
      "How do you decide what to automate vs test manually?",
      "Walk through how you would test a login flow.",
      "Explain the test pyramid.",
      "How do you handle flaky tests?",
      "What metrics do you track for QA quality?",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Automate one manual flow you currently run",
      "Learn one test framework deeply",
      "Practise writing clear bug reports",
    ],
    medium_term_recommendations: [
      "Add CI integration for your test suite",
      "Learn API + performance testing tools",
      "Get ISTQB Foundation certification",
    ],
    interview_strategy: [
      "Bring real bug reports you wrote",
      "Show a test plan you authored",
      "Talk about preventing bugs, not just finding them",
    ],
  },
  {
    id: "cloud_engineer",
    title: "Cloud Engineer",
    category: "Operations",
    required_skills: ["aws", "linux", "networking", "terraform"],
    advanced_skills: ["kubernetes", "serverless", "security", "cost optimisation", "multi-cloud"],
    critical_skills: ["aws", "terraform"],
    recommended_projects: [
      "Provision a 3-tier app on AWS with Terraform",
      "Build a serverless API with Lambda + API Gateway",
      "Set up centralised logging and alerting",
    ],
    technical_question_bank: [
      "Compare VPC peering vs Transit Gateway.",
      "How do you secure an S3 bucket properly?",
      "Walk through a serverless cold start and how to mitigate it.",
      "How do you control cloud costs?",
      "Explain IAM roles vs users vs policies.",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Get AWS Cloud Practitioner or Solutions Architect Associate",
      "Provision your portfolio infra with Terraform",
      "Practise drawing cloud architecture diagrams",
    ],
    medium_term_recommendations: [
      "Master one cloud deeply before going multi-cloud",
      "Learn a managed Kubernetes service (EKS/GKE)",
      "Contribute to an IaC module library",
    ],
    interview_strategy: [
      "Bring an architecture diagram of something you built",
      "Talk in terms of cost, security, reliability trade-offs",
      "Be precise with cloud service names and limits",
    ],
  },
  {
    id: "ml_engineer",
    title: "Machine Learning Engineer",
    category: "Data",
    required_skills: ["python", "machine learning", "sql", "git"],
    advanced_skills: ["mlops", "deep learning", "docker", "kubernetes", "model serving"],
    critical_skills: ["machine learning", "python"],
    recommended_projects: [
      "Train, package and deploy a model behind an API",
      "Build a feature store for an ML pipeline",
      "Set up model monitoring and drift detection",
    ],
    technical_question_bank: [
      "Walk through how you'd take a notebook model to production.",
      "How do you detect and respond to model drift?",
      "Compare batch vs online inference architectures.",
      "How do you version data, code and models together?",
      "Explain trade-offs between accuracy and latency.",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Containerise one model and serve it with FastAPI",
      "Learn one experiment tracker (MLflow, W&B)",
      "Practise writing production-quality Python",
    ],
    medium_term_recommendations: [
      "Ship a model monitored in production for 30+ days",
      "Master one orchestrator (Airflow, Prefect, Dagster)",
      "Contribute to an ML open-source project",
    ],
    interview_strategy: [
      "Lead with deployment, not just modelling",
      "Quantify business impact of your models",
      "Show you understand the engineering, not just the math",
    ],
  },
  {
    id: "business_analyst",
    title: "Business Analyst",
    category: "Business",
    required_skills: ["sql", "excel", "requirements gathering", "communication"],
    advanced_skills: ["power bi", "tableau", "process modelling", "stakeholder management", "agile"],
    critical_skills: ["sql", "communication"],
    recommended_projects: [
      "Document a real business process with BPMN",
      "Build a dashboard answering one business question",
      "Write a requirements document for a feature you used",
    ],
    technical_question_bank: [
      "Walk me through how you'd elicit requirements from a difficult stakeholder.",
      "Show a SQL query you'd run to investigate a drop in revenue.",
      "How do you prioritise conflicting requirements?",
      "What's the difference between functional and non-functional requirements?",
      "Describe a time your analysis changed a decision.",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Sharpen SQL with window functions and CTEs",
      "Build one polished dashboard in Power BI or Tableau",
      "Practise writing crisp requirement docs",
    ],
    medium_term_recommendations: [
      "Get CBAP or PMI-PBA certification",
      "Lead a small project end-to-end",
      "Learn basic Python for analysis",
    ],
    interview_strategy: [
      "Tell stories of impact, not just tasks",
      "Have one dashboard you can demo live",
      "Show clear, structured thinking on the spot",
    ],
  },
  {
    id: "database_admin",
    title: "Database Administrator",
    category: "Operations",
    required_skills: ["sql", "linux", "backup", "performance tuning"],
    advanced_skills: ["replication", "sharding", "postgresql", "mongodb", "high availability"],
    critical_skills: ["sql", "backup"],
    recommended_projects: [
      "Set up streaming replication with failover",
      "Tune a slow query with EXPLAIN ANALYZE",
      "Document and test a disaster-recovery runbook",
    ],
    technical_question_bank: [
      "How do you design a backup strategy with RPO/RTO targets?",
      "Walk through diagnosing a slow query.",
      "Explain MVCC and how it affects locking.",
      "Compare logical vs physical replication.",
      "How would you migrate a large table without downtime?",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Practise EXPLAIN plans on real datasets",
      "Set up a personal Postgres lab with replication",
      "Read the docs of one DB end-to-end",
    ],
    medium_term_recommendations: [
      "Run a real failover drill",
      "Learn one NoSQL store deeply",
      "Get a vendor certification (Oracle, Postgres, MongoDB)",
    ],
    interview_strategy: [
      "Speak in concrete numbers (rows, GB, IOPS)",
      "Have one DR story to tell",
      "Show calm under simulated incident questions",
    ],
  },
  {
    id: "network_engineer",
    title: "Network Engineer",
    category: "Operations",
    required_skills: ["networking", "tcp/ip", "linux", "routing"],
    advanced_skills: ["bgp", "sdn", "firewalls", "vpn", "automation"],
    critical_skills: ["networking", "tcp/ip"],
    recommended_projects: [
      "Design and document a multi-site network in GNS3 or EVE-NG",
      "Automate switch config with Ansible",
      "Set up a site-to-site VPN with monitoring",
    ],
    technical_question_bank: [
      "Walk me through what happens when you type a URL in a browser.",
      "Explain BGP and a real failure mode.",
      "Compare OSPF vs EIGRP.",
      "How do you troubleshoot intermittent packet loss?",
      "Explain VLANs, trunks and STP.",
    ],
    hr_question_bank: HR_BANK_BASE,
    short_term_recommendations: [
      "Refresh CCNA-level fundamentals",
      "Practise in a lab (Packet Tracer, GNS3)",
      "Learn one automation tool (Ansible, Netmiko)",
    ],
    medium_term_recommendations: [
      "Pursue CCNP or equivalent",
      "Learn cloud networking (AWS VPC, Azure VNet)",
      "Master one observability tool",
    ],
    interview_strategy: [
      "Draw topologies on the whiteboard confidently",
      "Have a real outage story with root cause",
      "Speak protocols precisely",
    ],
  },
];

export function getRole(id: string): RoleProfile {
  return ROLE_KB.find((r) => r.id === id) ?? ROLE_KB[0];
}

export const ROLE_OPTIONS = ROLE_KB.map((r) => ({
  value: r.id,
  label: r.title,
  category: r.category,
}));
