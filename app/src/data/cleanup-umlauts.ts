import { and, asc, eq, gte, like, or } from "drizzle-orm";
import { db } from "../server/db";
import { movies } from "../server/db/schema";

// @ts-expect-error Missing type file
import isWord from "is-word";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const isGermanWord = isWord("ngerman");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const isFrenchWord = isWord("french");

const UMLAUT_SET = ["ä", "ö", "ü", "ß"];
const FRENCH_SPECIAL_LETTERS = [
  "à",
  "â",
  "ç",
  "é",
  "è",
  "ê",
  "ë",
  "î",
  "ï",
  "ô",
  "û",
  "ù",
  "ü",
];
const ERROR_SEQUENZ = "ï¿½";

const fixUmlaut = (title: string): string | false => {
  const wordsWithUmlaut = extractWordsWithUmlaut(title);

  if (wordsWithUmlaut.length === 0) return false;

  let fixedTitle = title;

  const fixedWords: string[] = [];
  wordsWithUmlaut.forEach((word, index) => {
    fixedWords.push(word);
    FRENCH_SPECIAL_LETTERS.forEach((umlaut1) => {
      FRENCH_SPECIAL_LETTERS.forEach((umlaut2) => {
        const potentiallyFixedWord = word
          .replace(ERROR_SEQUENZ, umlaut1)
          .replace(ERROR_SEQUENZ, umlaut2);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        if (isFrenchWord.check(potentiallyFixedWord)) {
          console.log("Fixed Word: ", potentiallyFixedWord);
          fixedWords[index] = potentiallyFixedWord;
        }
      });
    });

    fixedTitle = fixedTitle.replace(word, fixedWords[index] ?? word);
  });

  if (fixedTitle === title) return false;
  console.log("Fixed Title: ", fixedTitle);
  return fixedTitle;
};

const extractWordsWithUmlaut = (title: string): string[] => {
  const words = title.split(" ");
  const wordWithUmlaut = words.filter((word) => word.includes(ERROR_SEQUENZ));

  return wordWithUmlaut;
};

const STEP_SIZE = 500;

const cleanupUmlauts = async (offsetKatalogNr = 0) => {
  const moviesWithUmlaut = await db.query.movies.findMany({
    limit: STEP_SIZE,
    columns: {
      katalognr: true,
      originalTitle: true,
    },
    where: (m) =>
      and(
        gte(m.katalognr, offsetKatalogNr),
        or(
          like(m.originalTitle, `%${ERROR_SEQUENZ}%${ERROR_SEQUENZ}%`),
          like(m.originalTitle, `%${ERROR_SEQUENZ}%`),
        ),
      ),
    orderBy: [asc(movies.katalognr)],
  });

  if (moviesWithUmlaut.length === 0) {
    return;
  }

  const moviesWithFixedTitles = moviesWithUmlaut
    .map((m) => ({
      id: m.katalognr,
      originalTitle:
        m.originalTitle !== null ? fixUmlaut(m.originalTitle) : undefined,
    }))
    .filter((each) => Boolean(each.originalTitle)) as {
    id: number;
    originalTitle: string;
  }[];

  for (const fixedTitle of moviesWithFixedTitles) {
    await db
      .update(movies)
      .set({ originalTitle: fixedTitle.originalTitle })
      .where(eq(movies.katalognr, fixedTitle.id));
  }

  console.log(moviesWithUmlaut.at(-1)?.katalognr ?? 10000000);
  await cleanupUmlauts(moviesWithUmlaut.at(-1)?.katalognr ?? 10000000);
};

await cleanupUmlauts();
