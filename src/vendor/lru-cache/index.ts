export class LRUCache<K, V> {
  private capacity: number;
  private map: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;

    // Move key to end to mark as recently used
    const value = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key: K, value: V) {
    if (this.map.has(key)) {
      // Remove old entry
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Remove least recently used (first entry)
      const lruKey = this.map.keys().next().value;

      if (lruKey) {
        this.map.delete(lruKey);
      }
    }

    // Insert new entry at end
    this.map.set(key, value);
  }

  keys(): K[] {
    return Array.from(this.map.keys());
  }

  values(): V[] {
    return Array.from(this.map.values());
  }
}
