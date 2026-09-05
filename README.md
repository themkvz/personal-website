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

```bash
docker build -t themkvz .
docker run -p 3000:3000 --env-file .env themkvz
```

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
