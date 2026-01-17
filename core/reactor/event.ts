import { WCPaths, Payload, Target } from "./types";
import { getTrailPaths } from "./utils";

// ------------------------------------------------------------------
// Event class for Reactor phases
// ------------------------------------------------------------------
export class Event<T, P extends WCPaths<T> = WCPaths<T>> {
  static readonly NONE = 0;
  static readonly CAPTURING_PHASE = 1; // Phase 1: The event is moving down the tree towards the target
  static readonly AT_TARGET = 2; // Phase 2: The event has reached the target
  static readonly BUBBLING_PHASE = 3; // Phase 3: The event is bubbling up from the target

  // The type of event (e.g., "set", "get", "update")
  type: string;
  // The object currently handling the event (changes as event bubbles)
  currentTarget: Payload<T, P>["target"];
  // Current phase of the event flow (Capturing, At Target, or Bubbling)
  eventPhase: number = Event.NONE;

  // The original target where the event was dispatched
  readonly target: Payload<T, P>["target"];
  // The string path to the property being modified (e.g., "user.settings.theme")
  readonly path: Target<T, P>["path"];
  // The new value being set
  readonly value: Target<T, P>["value"];
  // The previous value before the change
  readonly oldValue: Target<T, P>["oldValue"];
  // Whether this event bubbles up to parent objects
  readonly bubbles: boolean;
  // Whether listeners can cancel/reject this change
  readonly rejectable: boolean;
  // Time when the event was created
  readonly timestamp: number;

  private _propagationStopped = false;
  private _immediatePropagationStopped = false;
  private _rejected = "";

  constructor(
    payload: Payload<T, P> & { bubbles?: boolean; rejectable?: boolean },
  ) {
    this.type = payload.type;
    this.target = payload.target;
    this.currentTarget = payload.currentTarget;
    this.value = payload.target.value;
    this.oldValue = payload.target.oldValue;
    this.path = payload.target.path;
    this.bubbles = payload.bubbles ?? true;
    this.rejectable = payload.rejectable ?? true;
    this.timestamp = Date.now();
  }

  get propagationStopped(): boolean {
    return this._propagationStopped;
  }
  // Prevents the event from bubbling further up the tree
  stopPropagation(): void {
    this._propagationStopped = true;
  }
  get immediatePropagationStopped(): boolean {
    return this._immediatePropagationStopped;
  }
  // Prevents bubbling AND prevents other listeners on the current element from running
  stopImmediatePropagation(): void {
    this._propagationStopped = true;
    this._immediatePropagationStopped = true;
  }

  get rejected(): string {
    return this._rejected;
  }

  // Allows a listener to veto/cancel the operation (if rejectable is true)
  reject(reason?: string): void {
    if (!this.rejectable)
      return console.warn(
        `Ignored reject() on non-rejectable "${this.type}" at "${this.path}"`,
      );
    this._rejected =
      reason || `Couldn't ${this.type} intended value at "${this.path}"`;
    console.log(this._rejected);
  }

  // Returns array of paths from target up to root
  composedPath(): WCPaths<T>[] {
    return getTrailPaths(this.path);
  }
}
