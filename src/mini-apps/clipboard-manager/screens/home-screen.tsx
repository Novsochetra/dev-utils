import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import { useClipboardStore } from "../state/state";
import { APP_ID } from "../utils/constants";
import { ClipboardList } from "./components/clipboard-list";
import { Empty } from "./components/empty";

export default function ClipboardManager() {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useClipboardStore((s) => s.items);

  if (!items[activeIndex]) {
    return <Empty />;
  }

  return (
    <div className="flex flex-1 min-h-0">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 min-h-0 min-w-0">
            <ClipboardList
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />

            <div className="h-full w-px bg-border" />

            <div className="flex flex-1 flex-col min-w-0 min-h-0">
              <div className="flex flex-1 p-4 min-h-0 min-w-0">
                <div className="flex flex-1 p-4 min-w-0 min-h-0 border rounded-md">
                  <div className="flex flex-1 overflow-y-scroll h-full">
                    <pre>
                      {items[activeIndex]?.content}
                    </pre>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex gap-1 flex-col p-4">
                <div className="flex justify-between overflow-hidden">
                  <p>copied:</p>
                  <p className="truncate">
                    {items[activeIndex]?.count
                      ? `${items[activeIndex]?.count}`
                      : ""}
                  </p>
                </div>
                <div className="flex justify-between overflow-hidden">
                  <p>Date:</p>
                  <p className="truncate">{items[activeIndex]?.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
}
