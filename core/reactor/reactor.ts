import {
  WCPaths,
  Payload,
  Target,
  Listener,
  ListenerRecord,
  ReactorOptions,
} from "./types";
import { getTrailRecord, assignAny } from "./utils";
import { Event } from "./event";

// ------------------------------------------------------------------
// Minimal Reactor implementation (provides API surface used by reactify)
// ------------------------------------------------------------------
export class Reactor<T extends object = any> {
  root: T;
  private _listeners: Map<string, ListenerRecord<T, any>[]> = new Map();
  private options: ReactorOptions;

  constructor(target: T, options?: ReactorOptions) {
    this.root = target;
    this.options = options ?? {};
  }

  get(path: WCPaths<T>): any {
    if (path === "*") return this.root;
    const record = getTrailRecord(this.root, path);
    return record[record.length - 1][2];
  }

  noget(path: WCPaths<T>): any {
    try {
      return this.get(path);
    } catch {
      return undefined;
    }
  }

  noset(path: WCPaths<T>, value: any): void {
    assignAny(this.root as any, path as string, value);
  }

  set(path: WCPaths<T>, value: any): void {
    const record = getTrailRecord(this.root, path);
    const oldValue = record[record.length - 1][2];
    this.noset(path, value);

    const payload: Payload<T> = {
      type: "set",
      target: {
        path: path as any,
        value,
        oldValue,
        key: String(path).split(".").slice(-1)[0],
        object: value,
      },
      currentTarget: {
        path: path as any,
        value,
        oldValue,
        key: String(path).split(".").slice(-1)[0],
        object: value,
      },
      root: this.root,
    } as Payload<T>;

    const event = new Event(payload);

    // Dispatch with full Event phases: Capture -> Target -> Bubble
    const paths = event.composedPath(); // Returns [Target, Parent, ..., Root]

    // 1. CAPTURING PHASE (Root -> Parent)
    event.eventPhase = Event.CAPTURING_PHASE;
    for (let i = paths.length - 1; i > 0; i--) {
      if (event.propagationStopped) break;
      this._dispatch(event, paths[i] as string, true);
    }

    // 2. AT TARGET
    if (!event.propagationStopped) {
      event.eventPhase = Event.AT_TARGET;
      this._dispatch(event, paths[0] as string);
    }

    // 3. BUBBLING PHASE (Parent -> Root)
    if (event.bubbles && !event.propagationStopped) {
      event.eventPhase = Event.BUBBLING_PHASE;
      for (let i = 1; i < paths.length; i++) {
        if (event.propagationStopped) break;
        this._dispatch(event, paths[i] as string, false);
      }
    }
  }

  on(
    path: WCPaths<T>,
    cb: Listener<T>,
    options?: boolean | { capture?: boolean; once?: boolean },
  ) {
    const opts =
      typeof options === "boolean"
        ? { capture: options, once: false }
        : { capture: options?.capture ?? false, once: options?.once ?? false };
    const list = this._listeners.get(path as string) || [];
    list.push({ cb: cb as any, capture: !!opts.capture, once: !!opts.once });
    this._listeners.set(path as string, list);
  }

  off(path: WCPaths<T>, cb?: Listener<T>) {
    if (!cb) return this._listeners.delete(path as string);
    const list = this._listeners.get(path as string);
    if (!list) return;
    this._listeners.set(
      path as string,
      list.filter((r) => r.cb !== (cb as any)),
    );
  }

  private _dispatch(event: Event<T>, path: string, onlyCapture?: boolean) {
    const list = this._listeners.get(path);
    if (!list) return;

    for (const rec of list.slice()) {
      // Filter listeners based on phase requirements
      if (onlyCapture === true && !rec.capture) continue;
      if (onlyCapture === false && rec.capture) continue;

      try {
        rec.cb(event as any);
      } catch (e) {
        console.error(e);
      }
      if (rec.once) this.off(path as any, rec.cb as any);
      if (event.immediatePropagationStopped) return;
    }
  }

  cascade() {
    // minimal no-op cascade implementation
  }

  tick() {
    // minimal tick: invoke listeners on root
    const list = this._listeners.get("*");
    if (!list) return;
    const payload: Payload<T> = {
      type: "update",
      target: { path: "*" as any, key: "*", object: this.root },
      currentTarget: { path: "*" as any, key: "*", object: this.root },
      root: this.root,
    } as Payload<T>;
    const event = new Event(payload);
    for (const rec of list.slice()) rec.cb(event as any);
  }

  reset() {
    this._listeners.clear();
  }
}
