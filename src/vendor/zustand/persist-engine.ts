import { get, set } from "idb-keyval";
import { v4 } from "uuid";
import type { StoreApi } from "zustand";

export type PersistEngineConfig = {
  /** Only start hydration after explicit start (default: false) */
  skipHydration?: boolean;
};

// TODO:
// 1. we need to find the way to auto unsubscribe
export function createPersistEngine(config: PersistEngineConfig) {
  const watching = new Map<string, string>();
  const hydratedKeys = new Map<string, boolean>();
  let unsubscribe: (() => void) | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hydrationCompletedCallback: ((...args: any[]) => any)[] = [];
  const tasks: (() => Promise<void>)[] = [];

  return {
    id: v4(),
    config: config,

    isHydrated: false,

    registerKeys: (key: string) => {
      hydratedKeys.set(key, false);
    },

    _registerTask<Value>(
      key: string,
      defaultValue: Value,
      cb: (hydratedValue: Value) => void,
    ) {
      const task = async () => {
        try {
          const stored = await get(key);
          hydratedKeys.set(key, true);
          const hydratedValue = stored?.data ?? defaultValue;

          cb(hydratedValue);
        } catch {
          cb(defaultValue);
        }
      };

      tasks.push(task);
    },

    async rehydrate() {
      if (tasks.length > 0) {
        await Promise.all(tasks.map((t) => t()));
      }

      this._notifyCompletedCallback();
    },

    _notifyCompletedCallback() {
      const isReady =
        hydratedKeys.size > 0 &&
        Array.from(hydratedKeys.values()).every((v) => v);

      if (isReady) {
        tasks.length = 0;
        this.isHydrated = true;

        if (hydrationCompletedCallback.length) {
          hydrationCompletedCallback.forEach((t) => t());
          hydrationCompletedCallback.length = 0;
        }
      }
    },

    async hydrate<Value>(key: string, defaultValue: Value) {
      try {
        const stored = await get(key);
        hydratedKeys.set(key, true);

        return stored?.data ?? defaultValue;
      } catch {
        return defaultValue;
      }
    },

    onHydrationCompleted(cb: () => void) {
      hydrationCompletedCallback.push(cb);
    },

    watch<TStore>(
      storeApi: StoreApi<TStore>,
      storageKey: string,
      path: string,
    ) {
      watching.set(storageKey, path);

      if (!unsubscribe) {
        unsubscribe = storeApi.subscribe((nextState) => {
          // Save each watched path
          watching.forEach((fieldPath, key) => {
            const value = getByPath(nextState, fieldPath);
            set(key, { data: value, version: 1 });
          });
        });
      }
    },
  };
}

function getByPath(obj: unknown, path: string) {
  if (obj == null || typeof obj !== "object") return undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split(".").reduce((acc: any, key) => acc?.[key], obj);
}
