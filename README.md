# DataSculpt: LUX Industries AI Analytics Dashboard

A modern analytics dashboard for LUX Industries, powered by real PostgreSQL data, AWS Bedrock AI (Claude), and Clerk authentication. Built with React, TypeScript, Tailwind CSS, and Node.js backend for secure database access.

## Features
- Natural language analytics chat (Claude 3.5 Sonnet v2 via Bedrock)
- Real-time charts and business KPIs from your PostgreSQL database
- Secure user authentication (Clerk)
- Downloadable reports (CSV, PDF)
- Clean, minimal UI

## Quick Start

### 1. Clone the repository
```
git clone https://github.com/Sidopolis/Datasculpt.git
cd datasculpt
```

### 2. Install dependencies
```
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# AWS Bedrock (Claude 3.5 Sonnet v2)
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=...
VITE_AWS_SECRET_ACCESS_KEY=...
VITE_MODEL_ID=arn:aws:bedrock:us-east-1:565741009456:inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2:0

# API
VITE_API_BASE_URL=http://localhost:3001/api

# (Optional) Google Gemini for floating chat
VITE_GEMINI_API_KEY=...
```

### 4. Configure PostgreSQL connection (backend)
Edit `server.js`:
```
const dbConfig = {
  host: 'your-db-host',
  port: 5432,
  database: 'your-db-name',
  user: 'your-db-user',
  password: 'your-db-password',
};
```

### 5. Start the backend server
```
node server.js
```

### 6. Start the frontend
```
npm run dev
```

Open http://localhost:5173 in your browser.

## Deployment (Vercel)
- Deploy the frontend (`src/`) to Vercel as a static site.
- Set all required environment variables in Vercel dashboard.
- The backend (`server.js`) must be deployed separately (e.g. AWS EC2, Render, Railway, or your own server). Update `VITE_API_BASE_URL` to point to your backend's public URL.

## Environment Variables
- `VITE_CLERK_PUBLISHABLE_KEY` (Clerk dashboard)
- `VITE_AWS_REGION`, `VITE_AWS_ACCESS_KEY_ID`, `VITE_AWS_SECRET_ACCESS_KEY`, `VITE_MODEL_ID` (AWS Bedrock)
- `VITE_API_BASE_URL` (your backend URL)
- `VITE_GEMINI_API_KEY` (optional, for floating chat)

## Troubleshooting
- **Port conflicts**: Make sure nothing else is running on 3001 (backend) or 5173 (frontend)
- **Database errors**: Check your PostgreSQL credentials and network access
- **Bedrock errors**: Ensure your AWS credentials and model ARN are correct, and your account has Bedrock access
- **Clerk errors**: Double-check your publishable key and Clerk dashboard settings
- **CORS issues**: The backend enables CORS for local development
- **Push to GitHub fails**: Run `git pull origin main`, resolve any conflicts, then push again

## Project Structure
- `src/` - Frontend React app
- `server.js` - Node.js backend for database access
- `.env` - Environment variables (not committed)

## License
MIT 