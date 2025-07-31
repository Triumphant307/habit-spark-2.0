// types/aos.d.ts
declare module "aos" {
  interface AosOptions {
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
  }

  const Aos: {
    init(options?: AosOptions): void;
    refresh(): void;
    refreshHard(): void;
  };

  export default Aos;
}
