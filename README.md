# 🎨 Prompt Art Clash

Prompt Art Clash is a full-stack web app where users participate in AI-powered art competitions. Users can submit prompts tied to specific competitions, view real-time galleries of generated submissions, and vote on their favourites.

## 🌟 Features

- 🔐 User authentication (via Supabase)
- 🖼️ Competition-wise gallery views for submissions
- 🗳️ Live voting system (one vote per user per submission)
- 🏆 Leaderboard based on community voting
- ⚙️ Admin/user logic managed through SQL roles
- 🎨 Beautiful UI built with Tailwind CSS and shadcn/ui

## 🛠️ Tech Stack

- Frontend: Vite + React + TypeScript
- Styling: Tailwind CSS + shadcn-ui
- Icons: lucide-react
- Backend: Supabase (Database + Auth + RLS)

## 📁 Getting Started (Local Development)

To run this project locally, follow these steps:

### Prerequisites

- Node.js & npm installed (recommend using `nvm`)

### Steps

1. Clone the repository:

```bash
git clone <YOUR_GIT_URL>
2.	Navigate to the project directory:
cd <YOUR_PROJECT_NAME>
3.	Install dependencies:
npm install
4.	Start the development server:
npm run dev
Environment Variables
Create a .env file in the root directory:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
✏️ Editing the Code
You can edit the project using any modern code editor like VS Code.
If working locally, just clone the repo, install dependencies, and start the dev server as described above.
🌐 Deployment
This is a standard Vite + React project and can be deployed to any static hosting provider like Vercel or Netlify.
Build the project:
npm run build
Preview the production build locally:
npm run preview
Then follow your preferred platform’s instructions to deploy.
🧾 Database Tables (Supabase)
•	profiles: User profile metadata
•	submissions: Prompt-based image entries tied to competitions (event_id)
•	image_votes: Stores user-submission votes (1 per user per submission)
•	events: Competition metadata (title, description, status)
•	generated_images: AI-generated image output (optional)
🧠 Supabase Security Notes
•	Row-Level Security (RLS) is enforced on votes and submissions
•	Triggers keep votes_count updated in submissions table
•	User roles are restricted via SQL policies


