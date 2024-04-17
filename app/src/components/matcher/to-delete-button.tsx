"use client";

import { type FC } from "react";
import { Button } from "../ui/button";
import { markToDelete } from "~/server/matcher/mark-to-delete";

export const ToDeleteButton: FC<{ movieId: number }> = ({ movieId }) => {
  return (
    <Button className="bg-red-700" onClick={() => markToDelete(movieId)}>
      Mark to delete
    </Button>
  );
};
