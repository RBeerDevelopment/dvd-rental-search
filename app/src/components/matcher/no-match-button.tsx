"use client";

import { type FC } from "react";
import { Button } from "../ui/button";
import { markNoMatch } from "~/server/matcher/mark-no-match";

export const NoMatchButton: FC<{ movieId: number }> = ({ movieId }) => {
  return <Button onClick={() => markNoMatch(movieId)}>No Match</Button>;
};
