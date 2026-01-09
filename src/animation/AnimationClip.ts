import { AnimationTrack } from './AnimationTrack';
import { KeyframeValue } from './Keyframe';

export class AnimationClip {
  public name: string;
  public tracks: Map<string, AnimationTrack>;
  public duration: number;

  constructor(name: string = 'Animation') {
    this.name = name;
    this.tracks = new Map();
    this.duration = 0;
  }

  addTrack(track: AnimationTrack): this {
    this.tracks.set(track.property, track);
    this.updateDuration();
    return this;
  }

  removeTrack(property: string): this {
    this.tracks.delete(property);
    this.updateDuration();
    return this;
  }

  getTrack(property: string): AnimationTrack | undefined {
    return this.tracks.get(property);
  }

  evaluate(time: number): Map<string, KeyframeValue> {
    const values = new Map<string, KeyframeValue>();
    
    this.tracks.forEach((track, property) => {
      const value = track.evaluate(time);
      if (value !== null) {
        values.set(property, value);
      }
    });

    return values;
  }

  private updateDuration(): void {
    this.duration = 0;
    this.tracks.forEach(track => {
      const trackDuration = track.getDuration();
      if (trackDuration > this.duration) {
        this.duration = trackDuration;
      }
    });
  }

  clone(): AnimationClip {
    const clip = new AnimationClip(this.name);
    this.tracks.forEach(track => {
      clip.addTrack(track.clone());
    });
    return clip;
  }
}
