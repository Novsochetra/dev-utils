import { useNavigate, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";

import { useBookmarkStore } from "@/mini-apps/bookmark-manager/state/state";
import { Button } from "@/vendor/shadcn/components/ui/button";

export const BookmarkManagerDetailLeftToolbar = () => {
  const navigate = useNavigate();
  const params = useParams()
  const folders = useBookmarkStore(s => s.folders)
  const folder = folders.find(f => f.id === params['id'])

  return (
    <div
      className="flex flex-1 px-2 min-w-0 items-center"
      data-tauri-drag-region
    >
      <Button
        data-tauri-drag-region={false}
        size="sm"
        variant="ghost"
        onClick={() => {
          navigate(-1);
        }}
      >
        <ChevronLeft />
      </Button>

      <p className="w-full truncate text-sm text-foreground">
        {folder?.name || ""}
      </p>
    </div>
  );
};
