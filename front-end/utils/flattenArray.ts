export function* flatten(arr: any[], depth?: number): any {
  if (depth === undefined) {
    depth = 1;
  }

  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      yield* flatten(item, depth - 1);
    } else {
      yield item;
    }
  }
}
