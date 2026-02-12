import { useFetcher } from "react-router";
import { ThumbsUp, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";
import { db } from "~/db";
import { bookmarks } from "~/db/schema";
import { eq, sql, desc } from "drizzle-orm";
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
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort") || "newest";

  const orderBy =
    sort === "popular"
      ? desc(bookmarks.upvotes)
      : desc(bookmarks.createdAt);

  const items = db.select().from(bookmarks).orderBy(orderBy).all();
  return { bookmarks: items, sort };
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

function BookmarkCard({
  bookmark,
}: {
  bookmark: {
    id: number;
    title: string;
    url: string;
    description: string | null;
    upvotes: number;
    createdAt: string;
  };
}) {
  const fetcher = useFetcher();
  const isUpvoting = fetcher.state !== "idle";
  const optimisticUpvotes =
    fetcher.state !== "idle" ? bookmark.upvotes + 1 : bookmark.upvotes;

  return (
    <div className="group flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <fetcher.Form method="post" className="shrink-0">
        <input type="hidden" name="id" value={bookmark.id} />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={isUpvoting}
          className="flex h-auto flex-col items-center gap-1 px-2 py-2"
        >
          <ThumbsUp
            className={`h-4 w-4 ${isUpvoting ? "text-primary" : "text-muted-foreground"}`}
          />
          <span className="font-mono text-xs">{optimisticUpvotes}</span>
        </Button>
      </fetcher.Form>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:text-primary"
          >
            {bookmark.title}
          </a>
          <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
        </div>
        {bookmark.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {bookmark.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {new Date(bookmark.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {new URL(bookmark.url).hostname}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Bookmarks({
  loaderData,
}: Route.ComponentProps) {
  const { bookmarks: items, sort } = loaderData;

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
          <a
            href="?sort=newest"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              sort === "newest"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            Newest
          </a>
          <a
            href="?sort=popular"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              sort === "popular"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            Popular
          </a>
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
