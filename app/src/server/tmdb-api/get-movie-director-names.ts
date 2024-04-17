import { type MovieCrewResponse } from "./types/movie-crew-response";

import { makeTmdbRequest } from "./utils/make-tmdb-request";

export const getMovieDirectorNames = async (id: number): Promise<string[]> => {
  const response = await makeTmdbRequest<MovieCrewResponse>(
    `movie/${id}/credits`,
  );

  if (!response.crew) return [];

  const directorNames = response.crew
    .filter((crewMember) => crewMember.job === "Director")
    .map((director) => director.name);

  return directorNames;
};
