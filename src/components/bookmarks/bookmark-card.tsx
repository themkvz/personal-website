import { ExternalLink, ThumbsUp } from "lucide-react";
import { useFetcher } from "react-router";
import type { Bookmark } from "~/types";
import { Button } from "../ui/button";

export function BookmarkCard({
  bookmark,
  hasVoted,
}: {
  bookmark: Bookmark;
  hasVoted: boolean;
}) {
  const fetcher = useFetcher();
  const isUpvoting = !hasVoted && fetcher.state !== "idle";
  const optimisticUpvotes = isUpvoting
    ? bookmark.upvotes + 1
    : bookmark.upvotes;

  const url = new URL(bookmark.url);
  url.searchParams.set("ref", "themkvz.com");

  return (
    <div className="group flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <fetcher.Form method="post" className="shrink-0">
        <input type="hidden" name="id" value={bookmark.id} />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={hasVoted || isUpvoting}
          className="flex h-auto flex-col items-center gap-1 px-2 py-2"
        >
          <ThumbsUp
            className={`h-4 w-4 ${hasVoted || isUpvoting ? "text-primary" : "text-muted-foreground"}`}
          />
          <span className="font-mono text-xs">{optimisticUpvotes}</span>
        </Button>
      </fetcher.Form>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <a
            href={url.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:text-primary hover:underline"
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
            {url.hostname}
          </span>
        </div>
      </div>
    </div>
  );
}
