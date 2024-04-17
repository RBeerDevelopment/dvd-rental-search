import { and, count, isNull, not } from "drizzle-orm";
import {
  type FoundMedia,
  FoundMediaCard,
} from "~/components/matcher/found-media-card";
import { NoMatchButton } from "~/components/matcher/no-match-button";
import { ToDeleteButton } from "~/components/matcher/to-delete-button";
import { UnmatchedCard } from "~/components/matcher/unmatched-card";
import { db } from "~/server/db";
import { movies } from "~/server/db/schema";
import { getMovieDirectorNames } from "~/server/tmdb-api/get-movie-director-names";
import { searchMovie } from "~/server/tmdb-api/search-movie";
import { serachSeries } from "~/server/tmdb-api/search-series";

export default async function MatcherPage() {
  const unmatchedMovie = await db.query.movies.findFirst({
    columns: {
      katalognr: true,
      title: true,
      regie: true,
      originalTitle: true,
      releaseYear: true,
    },
    where: (m) =>
      and(
        isNull(m.tmdbId),
        not(isNull(m.originalTitle)),
        not(m.noMatch),
        not(m.toDelete),
      ),
  });

  const countOfUnmatchedMovies = await db
    .select({ count: count() })
    .from(movies)
    .where(
      and(
        isNull(movies.tmdbId),
        not(isNull(movies.originalTitle)),
        not(movies.noMatch),
        not(movies.toDelete),
      ),
    );

  if (countOfUnmatchedMovies.at(0)?.count === 0)
    return <p>All movies matched!</p>;

  const [foundMovies, foundSeries] = await Promise.all([
    unmatchedMovie?.originalTitle
      ? searchMovie(unmatchedMovie.originalTitle)
      : [],
    unmatchedMovie?.originalTitle
      ? serachSeries(unmatchedMovie.originalTitle)
      : [],
  ]);

  const foundMedia: FoundMedia[] = [
    ...foundMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      releaseDate: movie.release_date,
      type: "movie" as const,
    })),
    ...foundSeries.map((series) => ({
      id: series.id,
      title: series.name,
      originalTitle: series.original_name,
      releaseDate: series.first_air_date,
      type: "series" as const,
    })),
  ];

  const directorNames: Record<number, string[]> = {};

  for (const media of foundMedia) {
    if (media.type === "series") continue; // filter out series
    const directorNamesForMedia = await getMovieDirectorNames(media.id);
    directorNames[media.id] = directorNamesForMedia;
  }

  return (
    <div className="flex flex-col items-center gap-3 p-8">
      <h1 className="text-3xl font-bold">Matcher</h1>
      <div className="flex flex-row gap-8">
        <NoMatchButton movieId={unmatchedMovie.katalognr} />
        <ToDeleteButton movieId={unmatchedMovie.katalognr} />
      </div>
      <h2 className="text-xl font-semibold">
        {countOfUnmatchedMovies[0]?.count} to go
      </h2>
      <div className="grid grid-cols-2 gap-4 p-4">
        <UnmatchedCard {...unmatchedMovie} />
        <div className="flex flex-col gap-4 p-4">
          <h2>Found media</h2>
          {foundMedia.map((media) => (
            <FoundMediaCard
              mediaId={unmatchedMovie.katalognr}
              directorNames={directorNames[media.id] ?? []}
              media={media}
              key={media.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
