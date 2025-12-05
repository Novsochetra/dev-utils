import type { StorageAdapter } from "./storage.interface";

export const LocalStorage: StorageAdapter = {
  async get(key) {
     try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  async set(key, value) {
    await localStorage.setItem(key, JSON.stringify(value));
  },
};