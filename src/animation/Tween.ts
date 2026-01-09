import { EasingFunction, Easing } from './Easing';

export interface TweenOptions {
  from: number;
  to: number;
  duration: number;
  easing?: EasingFunction;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
}

export class Tween {
  public from: number;
  public to: number;
  public duration: number;
  public easing: EasingFunction;
  public onUpdate?: (value: number) => void;
  public onComplete?: () => void;

  private currentTime: number = 0;
  private isPlaying: boolean = false;
  private isComplete: boolean = false;

  constructor(options: TweenOptions) {
    this.from = options.from;
    this.to = options.to;
    this.duration = options.duration;
    this.easing = options.easing ?? Easing.linear;
    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;
  }

  update(deltaTime: number): void {
    if (!this.isPlaying || this.isComplete) return;

    this.currentTime += deltaTime;

    if (this.currentTime >= this.duration) {
      this.currentTime = this.duration;
      this.isComplete = true;
      this.isPlaying = false;
    }

    const t = this.currentTime / this.duration;
    const easedT = this.easing(t);
    const value = this.from + (this.to - this.from) * easedT;

    if (this.onUpdate) {
      this.onUpdate(value);
    }

    if (this.isComplete && this.onComplete) {
      this.onComplete();
    }
  }

  play(): this {
    this.isPlaying = true;
    return this;
  }

  pause(): this {
    this.isPlaying = false;
    return this;
  }

  reset(): this {
    this.currentTime = 0;
    this.isComplete = false;
    this.isPlaying = false;
    return this;
  }

  restart(): this {
    this.reset();
    this.play();
    return this;
  }

  getValue(): number {
    const t = this.currentTime / this.duration;
    const easedT = this.easing(t);
    return this.from + (this.to - this.from) * easedT;
  }

  isFinished(): boolean {
    return this.isComplete;
  }

  static create(options: TweenOptions): Tween {
    return new Tween(options);
  }
}
