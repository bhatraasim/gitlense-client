# GitLense Client

> The frontend application for GitLense — AI Codebase Intelligence. Ask questions about any GitHub repository in plain English.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00c7b7)

---

## What It Does

The GitLense Client is a React-based web application that provides:

1. **Authentication** — User registration and login with JWT-based sessions
2. **Repository Management** — Connect GitHub repositories for AI-powered analysis
3. **Real-time Ingestion** — Track repository processing status (cloning, parsing, embedding)
4. **AI Chat Interface** — Ask questions about your codebase with cited sources

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitLense Client                         │
│                                                             │
│  ┌─────────┐    ┌────────────┐    ┌──────────────────┐   │
│  │ Landing │───▶│  AuthPage  │───▶│    Dashboard     │   │
│  │  Page   │    │ Login/Reg  │    │ Repo Management  │   │
│  └─────────┘    └────────────┘    └────────┬─────────┘   │
│                                              │              │
│                                              ▼              │
│                                    ┌──────────────────┐    │
│                                    │  ChatInterface   │    │
│                                    │  RAG Q&A Chat    │    │
│                                    └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │      GitLense API (Backend)    │
              │  FastAPI → Redis → Celery      │
              │  Qdrant → MongoDB → GPT-4o    │
              └───────────────────────────────┘
```

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 3 |
| State | React Context API |
| Markdown | React Markdown + remark-gfm |
| Syntax Highlighting | React Syntax Highlighter |
| Deployment | Netlify |

---

## Tech Stack

- **React 19** — UI framework with hooks
- **Vite 7** — Build tool and dev server
- **React Router DOM** — Client-side routing
- **Tailwind CSS** — Utility-first CSS framework
- **React Markdown** — Markdown rendering in React
- **React Syntax Highlighter** — Code block syntax highlighting
- **ESLint** — Code linting with React Hooks rules

---

## Project Structure

```
gitlense-client/
├── src/
│   ├── main.jsx                # Entry point
│   ├── App.jsx                 # Root component with routing
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── components/
│   │   └── CodeBlock.jsx       # Syntax-highlighted code blocks
│   ├── pages/
│   │   ├── LandingPage.jsx     # Marketing landing page
│   │   ├── AuthPage.jsx        # Login / Register
│   │   ├── Dashboard.jsx       # Repository management
│   │   └── ChatInterface.jsx   # RAG-powered Q&A chat
│   └── services/
│       └── api.js              # API calls and auth functions
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── package.json
```

---

## Prerequisites

- Node.js 18+
- npm or yarn
- GitLense API backend running (see [gitlense-api](https://github.com/bhatraasim/gitlense-api))

---

## Local Development

### Setup

```bash
# clone
git clone https://github.com/bhatraasim/gitlense-client
cd gitlense-client

# install dependencies
npm install

# copy env file
cp .env.example .env
```

### Environment Variables

```env
VITE_BSE_API_URL=http://localhost:8000
```

### Running Locally

```bash
# start development server with HMR
npm run dev

# build for production
npm run build

# preview production build locally
npm run preview
```

API docs available at the backend: `http://localhost:8000/docs`

---

## Linting

```bash
# run ESLint on all files
npm run lint
```

The project uses ESLint with:
- `no-unused-vars` — Error except variables starting with uppercase or underscore
- React Hooks rules from `eslint-plugin-react-hooks`
- React Refresh rules for HMR compatibility

---

## Features

### Landing Page
- Marketing homepage with product features
- Authentication flow (login/register)
- Responsive design with dark theme

### Authentication
- User registration with name, email, password
- Login with email/password
- JWT token stored in localStorage
- Session persistence with auto-login

### Dashboard
- List all connected repositories
- Real-time ingestion status (queued, cloning, parsing, embedding, ready, failed)
- Repository card UI with stats (file count, chunk count)
- Add new repository modal
- Search and filter repositories

### Chat Interface
- AI-powered Q&A about your codebase
- Markdown rendering for responses
- Syntax-highlighted code blocks
- Citation sources with file references
- Copy code functionality
- Chat history within session

---

## API Integration

The client communicates with the GitLense API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/repos/` | GET | List all repositories |
| `/repos/ingest` | POST | Ingest a new repository |
| `/repos/status/{repo_id}` | GET | Check ingestion status |
| `/chat/query` | POST | Ask a question (RAG) |

See [API_DOCS.md](./API_DOCS.md) for complete endpoint documentation.

---

## Deployment

Deployed on Netlify with automatic builds from the `main` branch.

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables (Netlify)

Add in Netlify dashboard:
- `VITE_BSE_API_URL` — Backend API URL (e.g., `https://gitlense-api.railway.app`)

---

## Code Style

- **JavaScript** — Not TypeScript
- **JSX** — For React components
- **ESM** — `import`/`export` syntax
- **Functional Components** — With hooks, not class components
- **Tailwind CSS** — Utility classes, avoid custom CSS
- **Naming** — PascalCase for components, camelCase for utilities/hooks

See [AGENTS.md](./AGENTS.md) for detailed coding guidelines.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Related Projects

- [gitlense-api](https://github.com/bhatraasim/gitlense-api) — Backend API
- [API Documentation](./API_DOCS.md) — Complete API reference
