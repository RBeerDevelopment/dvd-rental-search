"use client";

import { useState, type FC } from "react";
import { Input } from "../ui/input";
import { searchDbMovieTitles } from "~/server/db/search/search-db-movie-titles";
import { type InferSelectModel } from "drizzle-orm";
import { type movies } from "~/server/db/schema";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type SearchResultDb = Pick<
  InferSelectModel<typeof movies>,
  "title" | "originalTitle" | "katalognr"
>;

export const SearchInput: FC = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResultDb[]>([]);

  const [parent] = useAutoAnimate();

  const handleSearch = async (searchInput: string) => {
    if (searchInput === "") {
      setSearchResults([]);
      return;
    }
    const queryResponse = await searchDbMovieTitles(searchInput);
    console.log(queryResponse);
    setSearchResults(queryResponse);
  };

  return (
    <div className="flex w-96 max-w-[3/4] flex-col gap-2">
      <Input
        className="h-12 w-full"
        type="search"
        placeholder="The dark knight"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          void handleSearch(e.target.value);
        }}
      />
      <div
        className="flex w-full transform cursor-pointer flex-col divide-y-2 overflow-hidden rounded-lg border-gray-600 shadow-md"
        ref={parent}
      >
        {searchResults.map((result) => (
          <div
            key={result.katalognr}
            className="flex flex-col p-3 hover:bg-gray-100"
          >
            <p className="text-sm font-semibold">{result.title}</p>
            <p className="text-xs text-gray-500">{result.originalTitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
