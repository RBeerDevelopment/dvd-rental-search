"ï¿½";

import { count, like, or } from "drizzle-orm";
import { TitleFixForm } from "~/components/title-fix/title-fix-form";
import { db } from "~/server/db";
import { movies } from "~/server/db/schema";

export default async function MatcherPage() {
  const movieWithErrorChar = await db.query.movies.findFirst({
    columns: {
      katalognr: true,
      title: true,
      originalTitle: true,
    },
    where: (m) => or(like(m.title, "%ï¿½%"), like(m.originalTitle, "%ï¿½%")),
  });

  console.log(movieWithErrorChar);

  const countOfMoviesWithErrorChar = await db
    .select({ count: count() })
    .from(movies)
    .where(
      or(like(movies.title, "%ï¿½%"), like(movies.originalTitle, "%ï¿½%")),
    );

  if (countOfMoviesWithErrorChar.at(0)?.count === 0)
    return <p>All movies matched!</p>;

  return (
    <div className="flex flex-col items-center gap-3 p-8">
      <h1 className="text-3xl font-bold">Title Fix</h1>
      <p>
        There are {countOfMoviesWithErrorChar.at(0)?.count} movies with error
        character
      </p>
      {movieWithErrorChar ? (
        <TitleFixForm
          id={movieWithErrorChar.katalognr}
          title={movieWithErrorChar.title ?? ""}
          originalTitle={movieWithErrorChar.originalTitle ?? ""}
        />
      ) : null}
    </div>
  );
}
