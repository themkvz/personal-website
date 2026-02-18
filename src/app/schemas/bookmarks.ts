import { parseAsStringEnum } from "nuqs";
import { createLoader } from "nuqs/server";

export enum SortOption {
  Newest = "newest",
  Popular = "popular",
}

export const sortParser = parseAsStringEnum<SortOption>(
  Object.values(SortOption),
)
  .withDefault(SortOption.Newest)
  .withOptions({
    clearOnDefault: true,
    shallow: false,
  });

export const searchParams = { sort: sortParser };
export const loadSearchParams = createLoader(searchParams);
