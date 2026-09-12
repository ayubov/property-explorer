export const descriptionParagraphs = (
  description: string | null | undefined
): string[] => description?.split(/\n+/).filter(Boolean) ?? []
