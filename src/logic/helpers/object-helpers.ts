export function deepDupe<T>(toDupe: T): T {
  // This is a really inefficient but effective way to completely duplicate an object to ensure the original properties won't be changed.
  return JSON.parse(JSON.stringify(toDupe));
}

export function arrayOf<T>(
  length: number,
  creator: (() => T) | ((index: number) => T)
): Array<T> {
  return [...new Array(length)].map((unused, i) => creator(i));
}
