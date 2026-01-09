import { Keyframe, KeyframeValue } from './Keyframe';
import { EasingFunction, Easing } from './Easing';

export class AnimationTrack<T extends KeyframeValue = KeyframeValue> {
  public property: string;
  public keyframes: Keyframe<T>[];
  public easing: EasingFunction;

  constructor(property: string, keyframes: Keyframe<T>[] = [], easing: EasingFunction = Easing.linear) {
    this.property = property;
    this.keyframes = keyframes.sort((a, b) => a.time - b.time);
    this.easing = easing;
  }

  addKeyframe(time: number, value: T): this {
    const keyframe = new Keyframe(time, value);
    this.keyframes.push(keyframe);
    this.keyframes.sort((a, b) => a.time - b.time);
    return this;
  }

  removeKeyframe(index: number): this {
    if (index >= 0 && index < this.keyframes.length) {
      this.keyframes.splice(index, 1);
    }
    return this;
  }

  evaluate(time: number): T | null {
    if (this.keyframes.length === 0) return null;
    if (this.keyframes.length === 1) return this.keyframes[0].value;

    // Before first keyframe
    if (time <= this.keyframes[0].time) {
      return this.keyframes[0].value;
    }

    // After last keyframe
    if (time >= this.keyframes[this.keyframes.length - 1].time) {
      return this.keyframes[this.keyframes.length - 1].value;
    }

    // Find surrounding keyframes
    for (let i = 0; i < this.keyframes.length - 1; i++) {
      const kf1 = this.keyframes[i];
      const kf2 = this.keyframes[i + 1];

      if (time >= kf1.time && time <= kf2.time) {
        // Interpolate between keyframes
        const duration = kf2.time - kf1.time;
        const t = (time - kf1.time) / duration;
        const easedT = this.easing(t);
        return Keyframe.lerp(kf1, kf2, easedT);
      }
    }

    return this.keyframes[this.keyframes.length - 1].value;
  }

  getDuration(): number {
    if (this.keyframes.length === 0) return 0;
    return this.keyframes[this.keyframes.length - 1].time;
  }

  clone(): AnimationTrack<T> {
    return new AnimationTrack(
      this.property,
      this.keyframes.map(kf => kf.clone()),
      this.easing
    );
  }
}
