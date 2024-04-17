export const isLikelySeries = (title: string): boolean =>
  (title.match(/[0-9]\.[0-9]|Staffel|staffel|season|Season|[0-9]\,[0-9]/g)
    ?.length ?? 0) > 0;
