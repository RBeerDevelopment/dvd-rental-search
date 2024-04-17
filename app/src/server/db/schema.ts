import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const movies = sqliteTable(
  "movies",
  {
    katalognr: int("katalognr").primaryKey({ autoIncrement: true }),
    regie: text("regie", { length: 256 }),
    title: text("title", { length: 256 }),
    originalTitle: text("original_title", { length: 256 }),
    releaseYear: int("release_year"),
    tmdbId: int("tmdb_id"),
    noMatch: int("no_match", { mode: "boolean" }),
    toDelete: int("to_delete", { mode: "boolean" }),
  },
  (table) => ({
    yearIndex: index("year_idx").on(table.releaseYear),
    titleIndex: index("title_index").on(table.title),
    originalTitleIndex: index("original_title_index").on(table.originalTitle),
  }),
);
