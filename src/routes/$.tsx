import { data } from "react-router";
import { NotFound } from "~/components/layout/not-found";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/$";

export function loader() {
  return data(null, { status: 404 });
}

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Not found — Ihor Mukovoz",
    description: "This page could not be found.",
    noIndex: true,
  });

export default function CatchAllRoute() {
  return <NotFound />;
}
