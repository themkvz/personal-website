import { and, desc, eq, sql } from "drizzle-orm";
import { useQueryState } from "nuqs";
import { BookmarkCard } from "~/components/bookmarks/bookmark-card";
import { Button } from "~/components/ui/button";
import { userContext } from "~/context/user";
import { db } from "~/db";
import { bookmarks, bookmarkVotes } from "~/db/schema";
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

export async function loader({ request, context }: Route.LoaderArgs) {
  const { sort } = loadSearchParams(request);

  const orderBy =
    sort === SortOption.Popular
      ? desc(bookmarks.upvotes)
      : desc(bookmarks.createdAt);

  const fingerprint = context.get(userContext).fingerprint;

  const [items, votes] = await Promise.all([
    db.select().from(bookmarks).orderBy(orderBy),
    db
      .select({ bookmarkId: bookmarkVotes.bookmarkId })
      .from(bookmarkVotes)
      .where(eq(bookmarkVotes.fingerprint, fingerprint)),
  ]);

  return { bookmarks: items, votes };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = Number(formData.get("id"));

  if (!id) return { error: "Invalid bookmark ID" };

  const fingerprint = context.get(userContext).fingerprint;

  const existing = await db
    .select({ id: bookmarkVotes.id })
    .from(bookmarkVotes)
    .where(
      and(
        eq(bookmarkVotes.bookmarkId, id),
        eq(bookmarkVotes.fingerprint, fingerprint),
      ),
    );

  if (existing && existing.length > 0) {
    return { alreadyVoted: true };
  }

  try {
    await db.insert(bookmarkVotes).values({ bookmarkId: id, fingerprint });
    await db
      .update(bookmarks)
      .set({ upvotes: sql`${bookmarks.upvotes} + 1` })
      .where(eq(bookmarks.id, id));

    return { success: true };
  } catch (_) {
    return { error: "An error occurred while processing your vote." };
  }
}

export default function Bookmarks({ loaderData }: Route.ComponentProps) {
  const { bookmarks: items, votes } = loaderData;
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
            <Button
              key={option}
              onClick={() => setSort(option)}
              variant={sort === option ? "default" : "outline"}
            >
              {option}
            </Button>
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
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                hasVoted={
                  votes.find((v) => v.bookmarkId === bookmark.id) !== undefined
                }
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
