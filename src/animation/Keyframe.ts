export interface KeyframeValue {
  [key: string]: number | number[];
}

export class Keyframe<T extends KeyframeValue = KeyframeValue> {
  public time: number;
  public value: T;

  constructor(time: number, value: T) {
    this.time = time;
    this.value = value;
  }

  clone(): Keyframe<T> {
    return new Keyframe(this.time, { ...this.value });
  }

  static lerp<T extends KeyframeValue>(a: Keyframe<T>, b: Keyframe<T>, t: number): T {
    const result: any = {};
    
    for (const key in a.value) {
      const valueA = a.value[key];
      const valueB = b.value[key];
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        result[key] = valueA + (valueB - valueA) * t;
      } else if (Array.isArray(valueA) && Array.isArray(valueB)) {
        result[key] = valueA.map((v, i) => v + (valueB[i] - v) * t);
      }
    }
    
    return result as T;
  }
}
