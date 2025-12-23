import { Link } from "react-router";
import { memo } from "react";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { useBookmarkStore } from "../../state/state";

type ListFolderItemProps = {
  id: string;
  name: string;
  index: number;
};

export const ListFolderItem = memo(({ id, name }: ListFolderItemProps) => {
  const removeFolder = useBookmarkStore((state) => state.removeFolder);

  return (
      <div className="flex flex-col h-full items-center overflow-hidden relative group">
        <Link
          to={`/bookmark-manager/${id}`}
          className="w-full aspect-video bg-gray-100 rounded-sm overflow-hidden mb-4"
        >
          <Button
            variant="link"
            size="icon"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-white bg-zinc-600 transition-opacity hover:bg-none z-50"
            onClick={(e) => {
              e.preventDefault();
              removeFolder(id);
            }}
          >
            <Trash2Icon size={12} />
          </Button>
        </Link>
        <div className="flex flex-1 h-full">
          <BookmarkNameInput id={id} name={name} />
        </div>
      </div>
  );
});

const BookmarkNameInput = memo(({ id, name }: { id: string, name: string }) => {
  const renameFolder = useBookmarkStore((state) => state.renameFolder);
  const searchQuery = useBookmarkStore(state => state.searchFolderQuery)

  return (
    <input
      type="text"
      name="editor-title-input"
      value={name}
      disabled={!!searchQuery}
      className="outline-none focus-visible:outline-none w-full overflow-scroll text-center  truncate text-ellipsis line-clamp-1"
      onChange={(e) => renameFolder(id, e.target.value)}
    />
  );
});