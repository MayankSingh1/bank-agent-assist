# Original Command Examples

Extracted from Turn 8. These are reference commands, not a complete deployment procedure. Replace project placeholders and resolve authentication, permissions, runtime configuration, and hosting integration before use.

## Google Cloud and Firebase setup

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud auth application-default login

gcloud services enable aiplatform.googleapis.com run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com

npm install -g firebase-tools
firebase login
```

## Backend dependencies

```bash
cd backend
npm install express cors dotenv @google/genai
```

## Cloud Run deployment

```bash
gcloud run deploy bank-agent-assist-api --source . --region us-central1 --no-allow-unauthenticated
```

## Frontend build and Firebase deployment

```bash
npm run build
firebase init hosting
firebase deploy --only hosting
```
