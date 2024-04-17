"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { movies } from "../db/schema";
import { revalidatePath } from "next/cache";

export const markToDelete = async (id: number) => {
  await db
    .update(movies)
    .set({ toDelete: true })
    .where(eq(movies.katalognr, id));

  revalidatePath("/matcher");
};
