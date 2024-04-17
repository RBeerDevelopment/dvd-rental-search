import {
  type TmdbMovieSearchResponse,
  type MovieResult,
} from "./types/movie-search-response";
import { makeTmdbRequest } from "./utils/make-tmdb-request";

export const searchMovie = async (query: string): Promise<MovieResult[]> => {
  const searchResponse = await makeTmdbRequest<TmdbMovieSearchResponse>(
    `search/movie?query=${encodeURIComponent(query)}&language=en-US`,
  );

  const foundMovies = searchResponse.results;

  return foundMovies;
};
