# DevAssist AI - AI Developer Assistant UI

A modern dark-themed React dashboard for managing AI-powered development assistance agents. Built with React, Vite, and Tailwind CSS.

## Features

✨ **7 Specialized AI Agents:**

- **DOCS** - Generate feature documentation
- **PRIORITIZE** - Triage and rank issues
- **BUG** - Analyze and suggest bug fixes
- **PR REVIEW** - Review pull requests
- **COMMIT** - Generate commit messages
- **SPRINT** - Plan sprint tasks
- **STANDUP** - Generate daily standup reports

### Core Features

- 🎯 **Dynamic Forms** - Context-aware input forms based on selected agent
- 📊 **Structured Output Rendering** - Displays API responses with:
  - Markdown-style headings and sections
  - Bullet points and lists
  - Code blocks
  - Key-value pairs
- 📜 **History Panel** - Track and restore previous agent runs
- 💾 **Persistent History** - History survives page reloads via localStorage
- 🗑️ **Clear History** - Option to clear all saved runs
- ⌨️ **Keyboard Shortcuts** - Ctrl+Enter to submit forms quickly
- ⚡ **Real-time Validation** - Form validation before API submission
- 🛡️ **Enhanced Error Handling** - Detailed error messages and network timeout handling
- 🎨 **Dark Dashboard Layout** - Modern dark theme with agent-specific color coding
- 📋 **Export Formats** - Copy output as JSON or Markdown

## Tech Stack

- **React** 19.2.5 - UI framework
- **Vite** 8.0.10 - Build tool
- **Tailwind CSS** 3.4.19 - Styling
- **Axios** 1.16.0 - HTTP client
- **Lucide React** 1.14.0 - Icons

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd dev-assist-ui
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your n8n webhook URL:

```
VITE_API_WEBHOOK_URL=https://your-webhook-url.app.n8n.cloud/webhook/...
```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## API Integration

The app sends POST requests to your n8n webhook with the following structure:

```json
{
  "message": "agent_type",
  "...": "formData"
}
```

**Example - Docs Agent:**

```json
{
  "message": "docs",
  "feature": "User Authentication",
  "description": "Implement JWT-based authentication..."
}
```

**Example - Bug Agent:**

```json
{
  "message": "bug",
  "bug": "Login fails when email contains special characters..."
}
```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Agent selection sidebar
│   ├── AgentForm.jsx        # Dynamic input form
│   ├── OutputRenderer.jsx   # Formatted output display
│   └── HistoryPanel.jsx     # Previous runs history
├── utils/
│   ├── config.js            # Environment configuration
│   ├── validation.js        # Form validation rules
│   └── outputFormatter.js   # Markdown/text formatting
├── App.jsx                  # Main application
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## Agent Configuration

### Docs Agent

- **Feature Name** - Name of the feature to document
- **Description** - Detailed feature description

### Prioritize Agent

- **Issues** - Comma-separated list of issues to prioritize

### Bug Agent

- **Bug Report** - Detailed bug description and reproduction steps

### PR Review Agent

- **PR Title** - Title of the pull request
- **PR Description** - What changes were made and why

### Commit Agent

- **Changes Summary** - Summary of changes in the commit

### Sprint Agent

- **Backlog Items** - List of items to plan
- **Team Capacity** - Story points the team can handle

### Standup Agent

- **Yesterday** - What was completed
- **Today** - What will be worked on
- **Blockers** - Any blocking issues

## Environment Variables

```
VITE_API_WEBHOOK_URL    # n8n webhook URL (required)
```

## Error Handling

The app provides detailed error messages for:

- Network connectivity issues
- API timeouts (30-second default)
- Invalid webhook URLs
- Malformed API responses
- Missing form fields

## Features in Detail

### Structured Output Rendering

The OutputRenderer intelligently formats API responses:

```markdown
# Heading

- Bullet point 1
- Bullet point 2

## Sub-heading

Code block support:
\`\`\`
const code = "example";
\`\`\`
```

### Form Validation

Each agent has specific required fields:

- Missing fields show validation errors
- Forms prevent empty submissions
- Clear error messages guide users

### History Management

- Stores up to 50 previous runs
- Click any history item to restore output
- Shows timestamp and agent type
- Preview of output keys

### Copy Functionality

- **⎘ COPY** - Copy output as formatted JSON
- **⎘ MD** - Copy output as Markdown

## Development

### Linting

```bash
npm run lint
```

### Project Setup

The project uses:

- ESLint for code quality
- PostCSS with Autoprefixer
- Tailwind CSS for styling
- Vite with React plugin for fast builds

## Troubleshooting

### "API webhook URL is not configured"

- Check `.env.local` exists
- Verify `VITE_API_WEBHOOK_URL` is set
- Restart dev server after changing env vars

### "Network error — unable to reach API"

- Check webhook URL is correct
- Verify API is running and accessible
- Check firewall/network settings

### "Request timeout"

- API took longer than 30 seconds
- Check API performance
- Consider increasing timeout in `src/utils/config.js`

## License

MIT
