import type { NewBookmark } from "~/types";
import { db } from "../src/db";
import * as schema from "../src/db/schema";

const initialBookmarks: NewBookmark[] = [
  {
    id: 1,
    title: "How To Review Code",
    url: "https://endler.dev/2025/how-to-review-code",
    description:
      "A guide on how to effectively review code and provide constructive feedback.",
  },
  {
    id: 2,
    title: "Repeat Yourself",
    url: "https://endler.dev/2025/repeat-yourself",
    description:
      "An article discussing the importance of avoiding code duplication and promoting reusability.",
  },
  {
    id: 3,
    title: "React Bits",
    url: "https://www.reactbits.dev",
    description: "A collection of useful React patterns and techniques.",
  },
  {
    id: 4,
    title: "nuqs",
    url: "https://nuqs.dev",
    description:
      "A platform for sharing and discovering quality software development resources.",
  },
  {
    id: 5,
    title: "Use Action Routes in React Router",
    url: "https://sergiodxa.com/tutorials/use-action-routes-in-react-router",
    description:
      "Learn how to use action routes in React Router to handle form submissions and other actions.",
  },
  {
    id: 6,
    url: "https://www.magicpattern.design",
    title: "Magic Pattern",
    description:
      "A tool for generating beautiful SVG patterns for your web projects.",
  },
  {
    id: 7,
    url: "https://github.com/blackboardsh/electrobun",
    title: "Electrobun",
    description:
      "A fast and efficient JavaScript bundler for modern web development.",
  },
  {
    id: 8,
    url: "https://github.com/knadh/oat",
    title: "Oat",
    description: "A simple and efficient static site generator built with Go.",
  },
  {
    id: 9,
    url: "https://fulghum.io/self-hosting",
    title: "Self-Hosting Guide",
    description:
      "A comprehensive guide to self-hosting your own applications and services.",
  },
  {
    id: 10,
    url: "https://mlsysbook.ai/book/",
    title: "Machine Learning Systems Book",
    description:
      "An open-source book covering the design and implementation of machine learning systems.",
  },
];

console.log("Seeding bookmarks...");

for (const bookmark of initialBookmarks) {
  db.insert(schema.bookmarks).values(bookmark).onConflictDoNothing().run();
}

console.log(`Seeded ${initialBookmarks.length} bookmarks.`);
