# Open Items

These are export annotations based on gaps in the supplied conversation, not additional competition requirements.

## Missing source material

- Original problem-statement attachment: needed to check the stated pain points and handling-time target against the brief.
- Earlier PDF: referenced by filename and a prior-session path, but not supplied.
- Current FigJam contents: linked but not inspected or exported here.
- Official organizer portal: no explicit link was supplied. Verify the deadline and submission requirements there; October 18, 2026 is an earlier assistant claim, not a verified date in this export.
- Six functional milestone checklist, full seven-day schedule, and submission checklist: headings appear in the source, but their items are missing. The export does not reconstruct them as if they were original text.

## Decisions before implementation

- Choose a currently available Gemini model and deployment location; the original example uses `GEMINI_MODEL` rather than a fixed model ID.
- Specify the complete authenticated request path from frontend to Cloud Run. The original command creates an IAM-protected service; Firebase agent authentication and Cloud Run invocation need a concrete compatible design.
- Define actual synthetic records, fictional policy conditions, and server-side eligibility rules.
- Define and implement the response-validation schema; the included JSON is an example response, not a schema.
- Resolve the demo branch scope. The UX proposal names success, duplicate dispute, and AI uncertainty. The implementation proposal names eligible dispute, duplicate dispute, and potential compromise. Keep the distinction when selecting the final demo scenarios.
- Supply project IDs, runtime service account, permissions, environment configuration, and deployment files before executing the examples.

## Claims requiring measurement

The under-two-minute handling-time goal and reductions in manual effort are targets to validate using comparable synthetic tasks. No measured study results or production banking performance were supplied.
