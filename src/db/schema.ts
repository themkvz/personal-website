import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const bookmarks = sqliteTable("bookmarks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  upvotes: integer("upvotes").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const bookmarkVotes = sqliteTable(
  "bookmark_votes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    bookmarkId: integer("bookmark_id").notNull(),
    fingerprint: text("fingerprint").notNull(),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex("bookmark_votes_bookmark_fingerprint_idx").on(
      table.bookmarkId,
      table.fingerprint,
    ),
  ],
);

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
