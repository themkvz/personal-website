# themkvz.com

A personal workbench — a durable, editorial record of notes, decisions, investigations, references, and small tools. Built with **React Router 7** in framework mode (SSR), **React 19**, and **TypeScript**.

## Features

- 🚀 Server-side rendering
- 📝 MDX content layer — no database, no CMS
- 🎨 A token-driven design system (`DESIGN.md`)
- 🔒 TypeScript by default
- 🎉 Tailwind CSS 4

## Getting Started

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

### Adding content

Site content — workbench artifacts, the experience timeline, and tool cards — lives as MDX files under `content/`. Add, edit, or delete a file there and rebuild; no other step is required. See `src/content/schema.ts` for the required frontmatter per collection.

## Building for Production

```bash
bun run build
```

## Deployment

### Docker Deployment

The canonical list of required variables is `.env.example` — copy it to `.env` and fill in the values.

Three client-side variables are inlined into the browser bundle at **build time** and must be passed as `--build-arg`s. Four variables are read by the server at **container start** and must be passed as `-e`/`--env-file` — the process refuses to start if they're missing.

| Variable | Phase | Required |
| --- | --- | --- |
| `VITE_OP_CLIENT_ID` | build-time (`--build-arg`) | yes |
| `VITE_OP_API_URL` | build-time (`--build-arg`) | yes |
| `VITE_GLITCHTIP_DSN` | build-time (`--build-arg`) | yes |
| `OP_CLIENT_SECRET` | run-time (`-e`) | yes |
| `VITE_OP_CLIENT_ID` | run-time (`-e`) | yes (server also validates it) |
| `VITE_OP_API_URL` | run-time (`-e`) | yes (server also validates it) |
| `VITE_GLITCHTIP_DSN` | run-time (`-e`) | yes (server also validates it) |
| `PORT` | run-time (`-e`) | no — defaults to `3000` |

```bash
docker build \
  --build-arg VITE_OP_CLIENT_ID=<client-id> \
  --build-arg VITE_OP_API_URL=<api-url> \
  --build-arg VITE_GLITCHTIP_DSN=<dsn> \
  -t themkvz .

docker run -p 3000:3000 --env-file .env themkvz
```

No `.env` file is needed (or read) at build time — `.dockerignore` excludes it from the build context. It's only used above as a convenient way to supply the run-time variables; any equivalent `-e` flags work too.

### DIY Deployment

The built-in app server is production-ready. Deploy the output of `bun run build`:

```
├── package.json
├── bun.lock
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

Tailwind CSS 4, configured from the token set documented in `DESIGN.md`.

---

Built with ❤️ using React Router.
