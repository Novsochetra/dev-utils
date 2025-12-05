import * as idxDB from "idb-keyval";
import type { StorageAdapter } from "./storage.interface";

export const IndexDBStorage: StorageAdapter = {
  async get(key) {
     try {
      const raw = await idxDB.get(key);
      if (!raw) return null;
      
      return raw;
    } catch {
      return null;
    }
  },
  async set(key, value) {
    await idxDB.set(key, value);
  },
};