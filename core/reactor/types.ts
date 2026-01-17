import type { Reactor } from "./reactor";

// ------------------------------------------------------------------
// TYPES & INTERFACES
// ------------------------------------------------------------------

export type Primitive =                                                     
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;

// Wildcard paths or full nested object paths
export type WCPaths<T> = "*" | Paths<T, ".">;

// Recursive type for paths in an object or array
export type Paths<T, S extends string = "."> =
  T extends Primitive
    ? never
    : T extends readonly (infer U)[]
      ? | `${Extract<keyof T, number>}`
        | `${Extract<keyof T, number>}${S}${Paths<U, S>}`
      : {
          [K in keyof T & (string | number)]:
            T[K] extends Primitive
              ? `${K}`
              : `${K}` | `${K}${S}${Paths<T[K], S>}`;
        }[keyof T & (string | number)];


// Get the value type at a given path
export type PathValue<T, P extends string, S extends string | number | bigint | boolean | null | undefined = "."> = P extends "*"
  ? T
  : P extends `${infer K}${S}${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest, S>
    : never
  : P extends keyof T
  ? T[P]
  : never;

// Readonly version of paths
export type ReadonlyPaths<T> = Paths<{
  readonly [K in keyof T]: T[K] extends Primitive ? T[K] : Readonly<T[K]>;
}>;

// Reactor options
export interface ReactorOptions {
  rejectable?: boolean; // If true, state updates can be rejected in the capture phase
}

// Terminator symbol type
export type Terminator = typeof TERMINATOR;

// Target info for an event
export interface Target<T, P extends WCPaths<T> = WCPaths<T>> {
  path: P;
  value?: PathValue<T, P>;
  oldValue?: PathValue<T, P>;
  key: string;
  object: PathValue<T, P>;
}

// Payload for mediators/listeners
export interface Payload<T, P extends WCPaths<T> = WCPaths<T>> {
  type: "get" | "set" | "delete" | "update";
  target: Target<T, P>;
  currentTarget: Target<T, P>;
  root: T;
}

// Mediator function type (can transform/reject value)
export type Mediator<T, P extends Paths<T> = Paths<T>> = (
  value: PathValue<T, P> | undefined,
  terminated: boolean,
  payload: Payload<T, P>
) => PathValue<T, P> | typeof TERMINATOR;

// Listener function type
export type Listener<T, P extends WCPaths<T> = WCPaths<T>> = (
  event: Payload<T, P>
) => void;

// Listener options
export type ListenerOptionsTuple = { capture?: boolean; once?: boolean };
export type ListenerOptions = boolean | ListenerOptionsTuple;

// Listener record (internal)
export type ListenerRecord<T, P extends WCPaths<T> = WCPaths<T>> = {
  cb: Listener<T, P>;
} & ListenerOptionsTuple;

// API exposed via reactify
export type API<T extends object> = Pick<
  Reactor<T>,
  | "get"
  | "noget"
  | "set"
  | "noset"
  | "on"
  | "off"
  | "cascade"
  | "tick"
  | "reset"
>;

// Export TERMINATOR separately
export const TERMINATOR = Symbol("TERMINATOR");
