import type { InferSelectModel } from "drizzle-orm";
import { ExternalLink, ThumbsUp } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import type { bookmarks } from "~/db/schema";

type Bookmark = InferSelectModel<typeof bookmarks>;

export function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
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
