import { type StateCreator } from "zustand";
import { createPersistEngine } from "./persist-engine";

export type StateCreatorParams<TStore> = Parameters<
  StateCreator<TStore, [], []>
>;

export const defaultPersistEngine = createPersistEngine({
  skipHydration: false,
});

type PersistOptions = {
  name: string;
  path: string;
  engine?: ReturnType<typeof createPersistEngine>;
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

    // hydration is async → return default first, then patch
    const hydratedValue = value;
    const callback = (hydrated: TFieldValue) => {
      storeApi.setState((state) => {
        if (state && typeof state === "object") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (state as Record<string, any>)[options.path] = hydrated;
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

    defaultPersistEngine.watch(storeApi, options.name, options.path);

    return hydratedValue;
  };
}
