export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove symbols
    .replace(/\s+/g, "-") // spaces → dashes
    .replace(/--+/g, "-"); // avoid double dashes
};
