export const areValuesEqual = (a: string[], b: string[]): boolean => {
  return a.length === b.length && a.every((value) => b.includes(value));
};
