import { PlusIcon } from "lucide-react";
import { useBookmarkStore } from "@/mini-apps/bookmark-manager/state/state";
import { Button } from "@/vendor/shadcn/components/ui/button";

export const BookmarkManagerRightToolbar = () => {
  const addFolder = useBookmarkStore((s) => s.addFolder);

  return (
    <div
      className="flex flex-1 overflow-auto scrollbar-hidden justify-end"
      data-tauri-drag-region
      onClick={() => addFolder("welcome")}
      title="Add Folders"
    >
      <Button size="icon" variant="ghost">
        <PlusIcon size={24} />
      </Button>
    </div>
  );
};
