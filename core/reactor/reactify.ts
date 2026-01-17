import { Reactor } from "./reactor";
import type { API, ReactorOptions } from "./types";

// Helper to attach Reactor API to a plain object
export function reactify<T extends object>(
  target: T,
  root?: any,
  options?: ReactorOptions,
): T & API<T> {
  const core = new Reactor(target, options);

  Object.assign(root ?? core.root, {
    get: core.get.bind(core),
    noget: core.noget?.bind(core),
    set: core.set.bind(core),
    noset: core.noset?.bind(core),
    on: core.on.bind(core),
    off: core.off.bind(core),
    cascade: core.cascade.bind(core),
    tick: core.tick.bind(core),
    reset: core.reset.bind(core),
  } as API<T>);

  return core.root as T & API<T>;
}
