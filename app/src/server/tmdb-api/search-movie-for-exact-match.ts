import { fuzzy } from "fast-fuzzy";
import {
  type MovieResult,
  type TmdbMovieSearchResponse,
} from "./types/movie-search-response";
import { makeTmdbRequest } from "./utils/make-tmdb-request";
import { isLikelySeries } from "~/data/is-likely-series";
import { getMovieDirectorNames } from "./get-movie-director-names";

type ResultWithDirectorNames = MovieResult & { directorNames: string[] };

export const searchMovieForExactMatch = async (
  query: string,
  fallbackQuery: string,
  directorsString: string,
  releaseYear: number,
) => {
  // filter out season
  if (isLikelySeries(query)) {
    return false;
  }
  const searchResponse = await makeTmdbRequest<TmdbMovieSearchResponse>(
    `search/movie?query=${encodeURIComponent(query)}&language=en-US`,
  );

  const foundMovies = searchResponse.results;

  if (foundMovies.length === 0) return 0;

  const foundMoviesWithDirectorNames: ResultWithDirectorNames[] = [];

  for (const movie of foundMovies) {
    const directors = await getMovieDirectorNames(movie.id);
    foundMoviesWithDirectorNames.push({
      ...movie,
      directorNames: directors,
    });
  }

  const exactMatch = foundMoviesWithDirectorNames.find((movie) => {
    const movieReleaseYear = new Date(movie.release_date).getFullYear();

    const [
      isQueryTitleMatch,
      isQueryOriginalTitleMatch,
      isFallbackTitleMatch,
      isFallbackOriginalTitleMatch,
    ] = [
      fuzzy(query, movie.title, { useSellers: false }) > 0.9,
      fuzzy(query, movie.original_title, { useSellers: false }) > 0.9,
      fuzzy(fallbackQuery, movie.title, { useSellers: false }) > 0.9,
      fuzzy(fallbackQuery, movie.original_title, { useSellers: false }) > 0.9,
    ];

    const isDirectorMatch =
      directorsString.length > 0 &&
      fuzzy(movie.directorNames.join(", "), directorsString) > 0.8;

    if (isQueryTitleMatch) console.log("MATCH: ", query, movie.title);
    if (isQueryOriginalTitleMatch)
      console.log("MATCH: ", query, movie.original_title);
    if (isFallbackTitleMatch)
      console.log("MATCH: ", fallbackQuery, movie.title);
    if (isFallbackOriginalTitleMatch)
      console.log("MATCH: ", fallbackQuery, movie.original_title);

    return (
      (movieReleaseYear >= releaseYear - 1 &&
        movieReleaseYear <= releaseYear + 1 &&
        isQueryTitleMatch) ||
      isQueryOriginalTitleMatch ||
      isFallbackTitleMatch ||
      isFallbackOriginalTitleMatch ||
      isDirectorMatch
    );
  });
  return exactMatch;
};
