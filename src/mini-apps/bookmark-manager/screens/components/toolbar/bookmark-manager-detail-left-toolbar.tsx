import { useNavigate, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";

import { useBookmarkStore } from "@/mini-apps/bookmark-manager/state/state";

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
      <a
        href="#"
        data-tauri-drag-region={false}
        onClick={() => {
          navigate(-1);
        }}
        className="flex items-center text-zinc-600"
      >
        <ChevronLeft className="mr-2" size={24} />
      </a>

      <p className="w-full truncate text-sm text-foreground">
        {folder?.name || ""}
      </p>
    </div>
  );
};
