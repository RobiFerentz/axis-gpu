import { AnimationClip } from './AnimationClip';

export interface AnimationState {
  clip: AnimationClip;
  time: number;
  speed: number;
  weight: number;
  loop: boolean;
  isPlaying: boolean;
}

export class AnimationMixer {
  private animations: Map<string, AnimationState>;
  private target: any;

  constructor(target: any) {
    this.target = target;
    this.animations = new Map();
  }

  addAnimation(name: string, clip: AnimationClip, loop: boolean = true): this {
    this.animations.set(name, {
      clip,
      time: 0,
      speed: 1,
      weight: 1,
      loop,
      isPlaying: false,
    });
    return this;
  }

  removeAnimation(name: string): this {
    this.animations.delete(name);
    return this;
  }

  play(name: string, _fadeIn: number = 0): this {
    const state = this.animations.get(name);
    if (state) {
      state.isPlaying = true;
      // TODO: Implement fade-in
    }
    return this;
  }

  pause(name: string): this {
    const state = this.animations.get(name);
    if (state) {
      state.isPlaying = false;
    }
    return this;
  }

  stop(name: string): this {
    const state = this.animations.get(name);
    if (state) {
      state.isPlaying = false;
      state.time = 0;
    }
    return this;
  }

  setSpeed(name: string, speed: number): this {
    const state = this.animations.get(name);
    if (state) {
      state.speed = speed;
    }
    return this;
  }

  setWeight(name: string, weight: number): this {
    const state = this.animations.get(name);
    if (state) {
      state.weight = Math.max(0, Math.min(1, weight));
    }
    return this;
  }

  setLoop(name: string, loop: boolean): this {
    const state = this.animations.get(name);
    if (state) {
      state.loop = loop;
    }
    return this;
  }

  update(deltaTime: number): void {
    this.animations.forEach((state) => {
      if (!state.isPlaying) return;

      // Update time
      state.time += deltaTime * state.speed;

      // Handle looping
      if (state.time >= state.clip.duration) {
        if (state.loop) {
          state.time = state.time % state.clip.duration;
        } else {
          state.time = state.clip.duration;
          state.isPlaying = false;
        }
      }

      // Evaluate animation
      const values = state.clip.evaluate(state.time);

      // Apply values to target
      values.forEach((value, property) => {
        this.applyValue(property, value, state.weight);
      });
    });
  }

  private applyValue(property: string, value: any, weight: number): void {
    const parts = property.split('.');
    let obj = this.target;

    // Navigate to the property
    for (let i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]];
      if (!obj) return;
    }

    const finalProperty = parts[parts.length - 1];

    // Apply value with weight
    if (typeof value === 'number') {
      if (weight === 1) {
        obj[finalProperty] = value;
      } else {
        // Blend with current value
        const current = obj[finalProperty] ?? 0;
        obj[finalProperty] = current * (1 - weight) + value * weight;
      }
    } else if (Array.isArray(value)) {
      if (weight === 1) {
        if (obj[finalProperty] && typeof obj[finalProperty].set === 'function') {
          obj[finalProperty].set(...value);
        }
      } else {
        // Blend array values
        // TODO: Implement array blending
      }
    }
  }

  getAnimationState(name: string): AnimationState | undefined {
    return this.animations.get(name);
  }

  isPlaying(name: string): boolean {
    const state = this.animations.get(name);
    return state ? state.isPlaying : false;
  }

  clear(): void {
    this.animations.clear();
  }
}
