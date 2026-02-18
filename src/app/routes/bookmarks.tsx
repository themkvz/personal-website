import { desc, eq, sql } from "drizzle-orm";
import { useQueryState } from "nuqs";
import { BookmarkCard } from "~/components/bookmarks/bookmark-card";
import { db } from "~/db";
import { bookmarks } from "~/db/schema";
import { loadSearchParams, SortOption, sortParser } from "~/schemas/bookmarks";
import type { Route } from "./+types/bookmarks";

export function meta() {
  return [
    { title: "Bookmarks — Ihor Mukovoz" },
    {
      name: "description",
      content:
        "A curated collection of interesting links, tools, and resources.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { sort } = loadSearchParams(request);

  const orderBy =
    sort === SortOption.Popular
      ? desc(bookmarks.upvotes)
      : desc(bookmarks.createdAt);

  const items = db.select().from(bookmarks).orderBy(orderBy).all();

  return { bookmarks: items };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = Number(formData.get("id"));

  if (!id) return { error: "Invalid bookmark ID" };

  db.update(bookmarks)
    .set({ upvotes: sql`${bookmarks.upvotes} + 1` })
    .where(eq(bookmarks.id, id))
    .run();

  return { success: true };
}

export default function Bookmarks({ loaderData }: Route.ComponentProps) {
  const { bookmarks: items } = loaderData;
  const [sort, setSort] = useQueryState("sort", sortParser);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Bookmarks
            </h1>
            <p className="mt-4 text-muted-foreground">
              A curated collection of interesting links, tools, and resources I
              find valuable.
            </p>
          </div>
        </div>

        {/* Sort controls */}
        <div className="mt-8 flex items-center gap-2">
          {Object.values(SortOption).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSort(option)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                sort === option
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Bookmark list */}
        <div className="mt-6 space-y-3">
          {items.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No bookmarks yet.
            </p>
          ) : (
            items.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
