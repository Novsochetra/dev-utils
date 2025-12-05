import type { StoreApi } from "zustand";
import type { StorageAdapter } from "./storage.interface";
import { TaskQueue } from "./task-queue";
export interface PersistEngineConfig<Keys extends readonly string[]> {
  skipHydration?: boolean;
  adapter: StorageAdapter;
  storageKeys: Keys
}
export class PersistEngine<Keys extends readonly string[]> {
  private readyCallbacks: (() => void)[] = [];

  public config: PersistEngineConfig<Keys>;
  private taskQueue: TaskQueue;

  constructor(config: PersistEngineConfig<Keys>) {
    this.config = config
    this.taskQueue = new TaskQueue()
  }

  get isReady() {
    return this.taskQueue.status
  }

  async rehydrate() {
    if (this.taskQueue.taskIds.length && this.taskQueue.taskIds.length === this.config.storageKeys.length) {
      await this.taskQueue.run("concurrent")
      this.checkReady();
    }
  }

  async _registerTask<T>(
    key: string,
    defaultValue: T,
    callback: (hydrated: T) => void,
    migrate?: (data: T, oldVersion: number) => T,
  ) {

    const task = async () => {
      await this.hydrateKey(key, defaultValue, callback, migrate)
    }

    this.taskQueue.addTask(key, task)
  }

  private async hydrateKey<T>(
    key: string,
    defaultValue: T,
    callback?: (hydrated: T) => void,
    migrate?: (data: T, oldVersion: number) => T
  ): Promise<T> {
    const stored = await this.config.adapter.get<T>(key);
    let value = stored?.data ?? defaultValue;
    const oldVersion = stored?.version ?? 1;

    if (migrate) value = migrate(value, oldVersion);

    if (callback) {
      callback(value)
    }

    return value;
  }

  onHydrateCompleted(callback: () => void) {
    if (this.taskQueue.status === 'done') {
      callback();
    } else {
      this.readyCallbacks.push(callback);
    }
  }

  private checkReady() {
    if (this.taskQueue.status === 'done') {
      this.readyCallbacks.forEach((cb) => cb());
      this.readyCallbacks.length = 0;
    }
  }

  _watch<T>(
    storeApi: StoreApi<T>,
    key: string,
    path: string,
    version: number
  ) {
    storeApi.subscribe((state) => {
      const value = getByPath(state, path);
      this.config.adapter.set(key, { data: value, version });
    });
  }
}

export function getByPath(obj: unknown, path: string) {
  if (obj == null || typeof obj !== "object") return undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split(".").reduce((acc: any, key) => acc?.[key], obj);
}

export function setByPath(obj: any, path: string, value: any) {
  const keys = path.split(".");
  let ref = obj;

  keys.slice(0, -1).forEach(k => ref = ref[k]);
  ref[keys[keys.length - 1]] = value;
}