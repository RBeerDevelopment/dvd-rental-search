"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { movies } from "../db/schema";
import { revalidatePath } from "next/cache";

export const updateMovieTitles = async (
  id: number,
  title: string,
  originalTitle: string,
) => {
  await db
    .update(movies)
    .set({ title: title.trim(), originalTitle: originalTitle.trim() })
    .where(eq(movies.katalognr, id));

  revalidatePath("/title-fix", "page");
  console.log("Updated movie titles!");
};
