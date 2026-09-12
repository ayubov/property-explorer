// Funda paging is not a stable snapshot, so the same listing can arrive on two
// pages. Keep the first position but the newest data.
export const dedupeById = <T extends { id: string }>(items: T[]): T[] => [
  ...new Map(items.map((item) => [item.id, item])).values()
]
