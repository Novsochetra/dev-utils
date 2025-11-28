import { type StateCreator } from "zustand";
import { createPersistEngine } from "./persist-engine";

export type StateCreatorParams<TStore> = Parameters<
  StateCreator<TStore, [], []>
>;

export const defaultPersistEngine = createPersistEngine({
  skipHydration: true,
});

type PersistOptions = {
  name: string;
  path: string;
  engine?: ReturnType<typeof createPersistEngine>;
  version?: number;
  migrate?: (persistStated: any, version: number) => any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReturnPersist<Args extends any[], Field> = (...args: Args) => Field;

export function persist<TStore, TFieldValue>(
  value: TFieldValue,
  options: PersistOptions,
): ReturnPersist<StateCreatorParams<TStore>, TFieldValue> {
  const eng = options.engine ?? defaultPersistEngine;
  eng.registerKeys(options.name);

  return (...args: StateCreatorParams<TStore>): TFieldValue => {
    const storeApi = args[2];
    const version = options?.version ?? 1;

    // hydration is async → return default first, then patch
    let hydratedValue = value;

    const callback = (hydrated: { data: TFieldValue; version: number }) => {
      storeApi.setState((state) => {
        if (state && typeof state === "object") {
          let migrated = hydrated.data;

          if (options.migrate) {
            migrated = options.migrate(hydrated.data, hydrated.version);
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (state as Record<string, any>)[options.path] = migrated;
        }

        return state;
      });
    };

    if (!eng.isHydrated) {
      if (eng.config.skipHydration) {
        eng._registerTask(options.name, value, callback);
      } else {
        eng.hydrate(options.name, value).then((hydrated) => {
          callback(hydrated);

          eng._notifyCompletedCallback();
        });
      }
    }

    defaultPersistEngine.watch(storeApi, options.name, options.path, version);

    return hydratedValue;
  };
}
