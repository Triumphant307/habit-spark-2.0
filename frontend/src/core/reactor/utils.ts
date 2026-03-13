import type { WCPaths, PathValue } from "./types/types";

// ------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------

// Check if value is a plain object
export function isObj(obj: any): boolean {
  return (
    typeof obj === "object" &&
    obj !== null &&
    !Array.isArray(obj) &&
    typeof obj !== "function"
  );
}

// Check if value is an array
export function isArr(obj: any): boolean {
  return Array.isArray(obj);
}

// Assign a value to a nested path inside an object
export function assignAny<T extends object>(
  target: T,
  key: string,
  value: any,
  separator: string = ".",
  keyFunc = (p: string) => p,
): void {
  const keys = key.split(separator).map(keyFunc);
  let currObj: any = target;

  keys.forEach((key, i) => {
    const match = key.match(/^([^\[\]]+)\[(\d+)\]$/);
    if (match) {
      const [, k, idx] = match;
      if (!Array.isArray(currObj[k])) currObj[k] = [];
      if (i === keys.length - 1) currObj[k][Number(idx)] = value;
      else
        ((currObj[k][Number(idx)] ||= {}), (currObj = currObj[k][Number(idx)]));
    } else {
      if (i === keys.length - 1) currObj[key] = value;
      else ((currObj[key] ||= {}), (currObj = currObj[key]));
    }
  });
}

// Get array of paths from leaf to root for bubbling
export function getTrailPaths<T>(
  path: WCPaths<T>,
  reverse = true,
): WCPaths<T>[] {
  const parts = path.split(".");
  const chain: WCPaths<T>[] = ["*"];
  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    acc += (i === 0 ? "" : ".") + parts[i];
    chain.push(acc as WCPaths<T>);
  }
  return reverse ? chain.reverse() : chain;
}

// Get trail record: [path, parent, child] tuples for a path
export function getTrailRecord<T extends object>(
  obj: T,
  path: WCPaths<T>,
): [WCPaths<T>, any, any][] {
  const parts = path.split(".");
  const record: [WCPaths<T>, any, any][] = [["*", obj, obj]];
  let acc = "";
  let currObj: any = obj;

  for (let i = 0; i < parts.length; i++) {
    acc += (i === 0 ? "" : ".") + parts[i];
    record.push([
      acc as WCPaths<T>,
      currObj,
      (currObj = Reflect.get(currObj, parts[i])),
    ]);
  }
  return record;
}
