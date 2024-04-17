"use server";
import { like, or } from "drizzle-orm";
import { db } from "..";

export const searchDbMovieTitles = async (query: string) => {
  console.log("searchDbMovieTitles", query);
  return await db.query.movies.findMany({
    limit: 8,
    columns: {
      katalognr: true,
      title: true,
      originalTitle: true,
    },
    where: (m) =>
      or(like(m.title, `%${query}%`), like(m.originalTitle, `%${query}%`)),
  });
};
