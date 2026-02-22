import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { bookmarks } from "./db/schema";

export type Bookmark = InferSelectModel<typeof bookmarks>;
export type NewBookmark = InferInsertModel<typeof bookmarks>;
