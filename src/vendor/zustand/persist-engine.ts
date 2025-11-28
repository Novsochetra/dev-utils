import { get, set } from "idb-keyval";
import { v4 } from "uuid";
import type { StoreApi } from "zustand";

export type PersistEngineConfig = {
  /** Only start hydration after explicit start (default: false) */
  skipHydration?: boolean;
};

// TODO:
// 1. we need to find the way to auto unsubscribe
// 2. refactor seem has many variable haha like hydratedKey & hydratedVersion
export function createPersistEngine(config: PersistEngineConfig) {
  const watching = new Map<string, string>();
  const hydratedKeys = new Map<string, boolean>();
  const hydratedVersions = new Map<string, number>();
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
      cb: (hydratedValue: { data: Value; version: number }) => void,
    ) {
      const task = async () => {
        try {
          const hydrated = await this.hydrate(key, defaultValue);

          cb(hydrated);
        } catch {
          cb({ data: defaultValue, version: 1 });
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

    async hydrate<Value>(
      key: string,
      defaultValue: Value,
    ): Promise<{ data: Value; version: number }> {
      try {
        const stored = await get(key);
        hydratedKeys.set(key, true);

        return { data: stored?.data ?? defaultValue, version: stored.version };
      } catch {
        return { data: defaultValue, version: 1 };
      }
    },

    onHydrationCompleted(cb: () => void) {
      hydrationCompletedCallback.push(cb);
    },

    watch<TStore>(
      storeApi: StoreApi<TStore>,
      storageKey: string,
      path: string,
      version: number,
    ) {
      watching.set(storageKey, path);
      hydratedVersions.set(storageKey, version);

      if (!unsubscribe) {
        unsubscribe = storeApi.subscribe((nextState) => {
          // Save each watched path
          watching.forEach((fieldPath, key) => {
            const value = getByPath(nextState, fieldPath);
            set(key, { data: value, version: hydratedVersions.get(key) });
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
