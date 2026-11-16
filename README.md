# ChurnIQ — Explainable Customer Churn Intelligence

ChurnIQ is a customer-retention analytics application that organizes customer health signals, churn-risk analysis, explainability, and retention workflows in one interface.

## Implemented areas in this repository

- Customer 360 view and account-level context
- Data preprocessing and feature exploration UI
- Churn-risk feature engineering and scoring logic
- Model benchmarking and metrics presentation
- SHAP-style explanation exploration
- Retention playbooks and stakeholder dashboards
- API explorer and CRM integration views

The repository includes seeded mock customer data. Treat the displayed customer records and metric values as demonstration data, not verified customer outcomes or model benchmark results.

## Technology

- React and TypeScript
- Vite
- Express and TypeScript
- Google GenAI SDK for optional AI-assisted functionality
- jsPDF for report export
- Tailwind CSS and Lucide icons

## Run locally

1. Install Node.js (use a version compatible with the Vite version in `package.json`).
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and set your own server-side credentials.
4. Start development with `npm run dev`.
5. Run `npm run lint` and `npm run build` to validate the project.

## Security and data notes

- Never commit `.env`, API keys, service-account files, or private customer data.
- API access tokens are not hardcoded in this public copy. Configure `CIQ_API_KEYS` as a comma-separated server-side environment variable.
- Seeded customer records are mock data and should not be presented as real customer information.
- Do not use this application with production customer data until authentication, authorization, audit logging, and privacy controls have been reviewed.

## Project status

This is a portfolio code copy. Model scores and dashboard metrics must be evaluated against a documented dataset and reproducible test split before being described as measured model performance.

## License

No license is provided. Contact the repository owner before reusing this code.
