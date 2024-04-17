export function cleanTitle(title: string): string {
  if (title.length === 0) return title;

  return title.replaceAll(/\W|_/g, "").toLowerCase();
}
