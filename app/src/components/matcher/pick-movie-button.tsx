"use client";

import { type FC } from "react";
import { Button } from "../ui/button";
import { pickMovie } from "~/server/matcher/pick-movie";

export const PickMovieButton: FC<{ tmdbId: number; movieId: number }> = ({
  tmdbId,
  movieId,
}) => {
  return <Button onClick={() => pickMovie(movieId, tmdbId)}>Pick</Button>;
};
