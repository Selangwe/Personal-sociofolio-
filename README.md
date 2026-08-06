# Personal Sociofolio

A personal portfolio built with [Next.js](https://nextjs.org/), Tailwind CSS, and
Radix UI components.

## Getting started

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

Useful scripts:

- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run start` – serve the production build
- `npm run lint` – run ESLint
- `npm run typecheck` – type-check with `tsc`

## Hostinger MCP servers

This repo ships a project-scoped MCP configuration (`.mcp.json`) that wires up the
official [Hostinger API MCP servers](https://www.npmjs.com/package/hostinger-api-mcp).
An MCP-aware client (e.g. Claude Code) running from the project root will pick these
up automatically. The following servers are configured:

| Server | Purpose |
| --- | --- |
| `hostinger-hosting` | Manage web hosting plans, websites, and files |
| `hostinger-domains` | Register and manage domains |
| `hostinger-dns` | Manage DNS zones and records |
| `hostinger-reach` | Hostinger Reach (email marketing) |
| `hostinger-vps` | Manage VPS instances |
| `hostinger-ecommerce` | Manage e-commerce stores |

### Setup

1. Create a Hostinger API token in **hPanel → Account → API → Manage API tokens**.
2. Copy the example env file and add your token:

   ```bash
   cp .env.example .env
   # then edit .env and set HOSTINGER_API_TOKEN
   ```

3. Make sure `HOSTINGER_API_TOKEN` is available in the environment where your MCP
   client runs. `.mcp.json` reads it via `${HOSTINGER_API_TOKEN}`, so the token is
   never committed to the repo.

> The servers are launched on demand with `npx --package=hostinger-api-mcp@latest`,
> so no global install is required.
