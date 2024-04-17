import { and, asc, eq, gte, isNull, not } from "drizzle-orm";
import { db } from "../server/db";
import { movies } from "../server/db/schema";
import { searchMovieForExactMatch } from "../server/tmdb-api/search-movie-for-exact-match";

const STEP_SIZE = 100;

const backfillTmdbId = async (offsetKatalogNr = 0, hits = 0) => {
  const movieBatch = await db.query.movies.findMany({
    limit: STEP_SIZE,
    columns: {
      katalognr: true,
      regie: true,
      title: true,
      originalTitle: true,
      releaseYear: true,
    },
    where: (m) =>
      and(
        gte(m.katalognr, offsetKatalogNr),
        isNull(m.tmdbId),
        not(m.noMatch),
        not(m.toDelete),
      ),
    orderBy: [asc(movies.katalognr)],
  });

  if (movieBatch.length === 0) {
    return;
  }

  const moviesWithAllValues = movieBatch.filter(
    (movie) => movie.releaseYear !== -1,
  );

  const promises = moviesWithAllValues.map(
    async (movie) =>
      new Promise((resolve) => {
        if (!movie.releaseYear || !movie.title) {
          return;
        }
        searchMovieForExactMatch(
          movie.originalTitle ?? "",
          movie.title.replace("DVD", ""),
          movie.regie ?? "",
          movie.releaseYear,
        )
          .then((exactMatch) => {
            if (!exactMatch) {
              console.error("No exact match found for", movie.title);
              resolve(false);
              return;
            }

            console.log("updating", movie.katalognr, exactMatch.id);

            db.update(movies)
              .set({ tmdbId: exactMatch.id })
              .where(eq(movies.katalognr, movie.katalognr))
              .then(() => {
                console.log(
                  `Updated movie ${movie.title} with tmdbId ${exactMatch.id}`,
                );
                hits++;
                resolve(true);
              })
              .catch((e) => {
                console.error(e);
                resolve(false);
              });
          })
          .catch((e) => {
            console.error(e);
            resolve(false);
          });
      }),
  );

  await Promise.all(promises);

  console.log("Offset", movieBatch.at(-1)?.katalognr);
  if (movieBatch.length < STEP_SIZE) {
    return;
  }
  await backfillTmdbId(movieBatch.at(-1)?.katalognr, hits);

  console.log("Hits", hits);
};

await backfillTmdbId(0);
