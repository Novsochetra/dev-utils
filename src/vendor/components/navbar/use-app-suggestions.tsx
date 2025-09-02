import { useRef, useState } from "react";
import type { MiniApp } from "@/core/mini-app-registry";
import { LRUCache } from "@/vendor/lru-cache";

const maxCapacity = 5;
const suggestionAppsCache = new LRUCache<
  string,
  { timestamp: number; data: MiniApp }
>(maxCapacity);

export function useAppSuggestions(apps: MiniApp[]) {
  const previousData = JSON.parse(
    localStorage.getItem("dev-utils::suggestions") || "[]",
  );
  const initData = previousData?.length ? previousData : apps;

  const lruRef = useRef(suggestionAppsCache);

  const [data, setData] = useState<MiniApp[]>(() => {
    initData.slice(0, maxCapacity).forEach((a: MiniApp) => {
      lruRef.current.put(a.id, { timestamp: Date.now(), data: a });
    });
    return lruRef.current
      .values()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((v) => v.data);
  });

  const update = (key: string, v: MiniApp) => {
    lruRef.current.put(key, { timestamp: Date.now(), data: v });
    const newData = lruRef.current
      .values()
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((v) => v.data);

    localStorage.setItem("dev-utils::suggestions", JSON.stringify(newData));
    setData(newData);
  };

  return { data, update };
}
