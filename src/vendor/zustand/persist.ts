import { type StateCreator } from "zustand";
import { PersistEngine, setByPath } from "./persist-engine";
import { IndexDBStorage } from "./index-db";

export type StateCreatorParams<TStore> = Parameters<
  StateCreator<TStore, [], []>
>;

export const defaultPersistEngine = new PersistEngine({
  skipHydration: false,
  adapter: IndexDBStorage,
  storageKeys: []
});


type PersistOptions<Engine extends PersistEngine<any>> = {
  name: Engine["config"]["storageKeys"][number];
  path: string;
  version?: number;
  migrate?: (data: any, oldVersion: number) => any;
  engine: Engine;
}

export function persist<TStore, TValue, Engine extends PersistEngine<any>>(
  defaultValue: TValue,
  options: PersistOptions<Engine>
): (...args: StateCreatorParams<TStore>) => TValue {
  const { name, path, migrate } = options;
  const engine = options.engine ?? defaultPersistEngine;
  
  return (...args) => {
    const storeApi = args[2];
    let initial = defaultValue;

    const cb = (hydrated: any) => {
      storeApi.setState((s) => {
       setByPath(s, path, hydrated);
       return s;
     });
    }

    engine._registerTask(name, defaultValue, cb, migrate)

    if(!engine.config.skipHydration) {
      engine.rehydrate()
    }

    engine.onHydrateCompleted(() => {
      engine._watch(storeApi, name, path, options.version ?? 1);
    })

    return initial;
  };
}
