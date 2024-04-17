"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { movies } from "../db/schema";
import { revalidatePath } from "next/cache";

export const pickMovie = async (id: number, tmdbId: number) => {
  await db
    .update(movies)
    .set({ tmdbId: tmdbId })
    .where(eq(movies.katalognr, id));

  revalidatePath("/matcher");
};
