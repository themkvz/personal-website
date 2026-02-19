import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/db/schema";

const client = createClient({
  url: "file:data/sqlite.db",
});
const db = drizzle(client, { schema });

const sampleBookmarks = [
  {
    title: "React Router v7 Documentation",
    url: "https://reactrouter.com/",
    description:
      "Official docs for React Router v7 — the modern React framework.",
  },
  {
    title: "Tailwind CSS v4",
    url: "https://tailwindcss.com/",
    description: "A utility-first CSS framework for rapid UI development.",
  },
  {
    title: "shadcn/ui",
    url: "https://ui.shadcn.com/",
    description:
      "Beautifully designed components built with Radix UI and Tailwind CSS.",
  },
  {
    title: "Drizzle ORM",
    url: "https://orm.drizzle.team/",
    description: "TypeScript ORM that is lightweight and performant.",
  },
  {
    title: "Zustand",
    url: "https://zustand.docs.pmnd.rs/",
    description:
      "A small, fast, and scalable state management solution for React.",
  },
  {
    title: "Bun — JavaScript Runtime",
    url: "https://bun.sh/",
    description:
      "Incredibly fast JavaScript runtime, bundler, and package manager.",
  },
];

console.log("Seeding bookmarks...");

for (const bookmark of sampleBookmarks) {
  db.insert(schema.bookmarks).values(bookmark).onConflictDoNothing().run();
}

console.log(`Seeded ${sampleBookmarks.length} bookmarks.`);
