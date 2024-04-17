import { TMDB_API_BASE_URL } from "../constants";

export async function makeTmdbRequest<T>(path: string): Promise<T> {
  const result = await fetch(`${TMDB_API_BASE_URL}/${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  });

  const data = (await result.json()) as T;

  return data;
}
