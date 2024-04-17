import { type FC } from "react";

type Props = {
  title: string | null;
  originalTitle: string | null;
  regie: string | null;
  releaseYear: number | null;
};

export const UnmatchedCard: FC<Props> = ({
  title,
  originalTitle,
  releaseYear,
  regie,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
      <h2 className="text-xl font-bold">Unmatched movie</h2>
      <h3 className="text-lg font-semibold">Title</h3>
      <p className="mb-4">{title}</p>
      <h3 className="text-lg font-semibold">Regie</h3>
      <p className="mb-4">{regie}</p>
      <h3 className="text-lg font-semibold">Original Title</h3>
      <p className="mb-4">{originalTitle}</p>
      <h3 className="text-lg font-semibold">Release Year</h3>
      <p className="mb-4">{releaseYear}</p>
    </div>
  );
};
