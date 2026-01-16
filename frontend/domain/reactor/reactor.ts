/* -------------------------------------------
 * Types
 * ------------------------------------------- */

export type Phase = "capture" | "target" | "bubble";

export interface Event<T = any> {
  phase: Phase;
  type: "get" | "set" | "delete";
  path: string;
  value?: any;
  oldValue?: any;
  root: T;
  cancel(): void;
  cancelled: boolean;
}

export type Listener<T = any> = (event: Event<T>) => void;
export type Mediator<T = any> = (event: Event<T>) => any;

/* -------------------------------------------
 * Terminator
 * ------------------------------------------- */

export const TERMINATOR = Symbol("TERMINATOR");

/* -------------------------------------------
 * Reactor Options
 * ------------------------------------------- */

export interface ReactorOptions {
  rejectable?: boolean;
}

/* -------------------------------------------
 * Reactor
 * ------------------------------------------- */

export default class Reactor<T extends object> {
  private root: T;
  private listeners = new Map<string, Listener<T>[]>();
  private mediators = new Map<string, Mediator<T>>();
  private options: ReactorOptions;

  constructor(state: T, options: ReactorOptions = {}) {
    this.options = options;
    this.root = this.wrap(state, "");
  }

  /* -------------------------------------------
   * Public API
   * ------------------------------------------- */

  get state() {
    return this.root;
  }

  on(path: string, listener: Listener<T>) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, []);
    }
    this.listeners.get(path)!.push(listener);
  }

  mediate(path: string, mediator: Mediator<T>) {
    this.mediators.set(path, mediator);
  }

  /* -------------------------------------------
   * Proxy Wrapper
   * ------------------------------------------- */

  private wrap(obj: any, basePath: string): any {
    return new Proxy(obj, {
      get: (target, key) => {
        const path = this.join(basePath, key);
        const value = target[key];

        this.dispatch("get", path, value, undefined);

        if (typeof value === "object" && value !== null) {
          return this.wrap(value, path);
        }

        return value;
      },

      set: (target, key, value) => {
        const path = this.join(basePath, key);
        const oldValue = target[key];

        const result = this.dispatch("set", path, value, oldValue);

        if (result === TERMINATOR) return true;

        target[key] = result ?? value;
        return true;
      },

      deleteProperty: (target, key) => {
        const path = this.join(basePath, key);
        const oldValue = target[key];

        const result = this.dispatch("delete", path, undefined, oldValue);

        if (result === TERMINATOR) return true;

        delete target[key];
        return true;
      },
    });
  }

  /* -------------------------------------------
   * Dispatch (THE HEART)
   * ------------------------------------------- */

  private dispatch(
    type: Event["type"],
    path: string,
    value?: any,
    oldValue?: any
  ) {
    const event: Event<T> = {
      phase: "capture",
      type,
      path,
      value,
      oldValue,
      root: this.root,
      cancelled: false,
      cancel() {
        this.cancelled = true;
      },
    };

    // 1️ CAPTURE
    this.emit(event);

    if (event.cancelled && this.options.rejectable) {
      return TERMINATOR;
    }

    // 2️ TARGET (MEDIATOR)
    event.phase = "target";
    const mediator = this.mediators.get(path);

    if (mediator) {
      const result = mediator(event);

      if (result === TERMINATOR) return TERMINATOR;
      if (result !== undefined) value = result;
    }

    // 3️ BUBBLE
    event.phase = "bubble";
    this.emit(event);

    return value;
  }

  /* -------------------------------------------
   * Emit listeners
   * ------------------------------------------- */

  private emit(event: Event<T>) {
    for (const [path, listeners] of this.listeners) {
      if (event.path.startsWith(path)) {
        listeners.forEach((l) => l(event));
      }
    }
  }

  /* -------------------------------------------
   * Utils
   * ------------------------------------------- */

  private join(base: string, key: string | symbol) {
    return base ? `${base}.${String(key)}` : String(key);
  }
}
