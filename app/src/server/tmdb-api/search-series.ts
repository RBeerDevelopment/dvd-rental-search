import {
  type SeriesResult,
  type TmdbSeriesSearchResponse,
} from "./types/series-search-response";
import { makeTmdbRequest } from "./utils/make-tmdb-request";

export const serachSeries = async (
  query: string,
  year?: number,
): Promise<SeriesResult[]> => {
  const searchResponse = await makeTmdbRequest<TmdbSeriesSearchResponse>(
    `search/tv?query=${encodeURIComponent(query)}&language=en-US${year ? "&year=" + year : ""}`,
  );

  const foundSeries = searchResponse.results;

  return foundSeries;
};
