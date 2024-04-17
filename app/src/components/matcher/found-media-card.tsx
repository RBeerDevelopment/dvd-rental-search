import { type FC } from "react";

import { PickMovieButton } from "./pick-movie-button";

export type FoundMedia = {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  type: "movie" | "series";
};

export const FoundMediaCard: FC<{
  media: FoundMedia;
  mediaId: number;
  directorNames: string[];
}> = ({ media, mediaId, directorNames }) => {
  return (
    <div className="relative flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.themoviedb.org/${media.type === "movie" ? "movie" : "tv"}/${media.id}`}
        className="cursor-pointer hover:underline"
      >
        <h3 className="text-lg font-semibold">{media.title}</h3>
      </a>
      <p>{media.originalTitle}</p>
      <p>{media.releaseDate}</p>
      <p>Directors: {directorNames.join(", ")}</p>
      <PickMovieButton movieId={mediaId} tmdbId={media.id} />
      <p className="absolute right-3 top-3 rounded-xl bg-gray-700 p-2 text-white">
        {media.type === "movie" ? "Movie" : "TV"}
      </p>
    </div>
  );
};
