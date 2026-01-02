import { Link } from "react-router";
import { memo } from "react";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { useBookmarkStore } from "../../state/state";
import clsx from "clsx";

type ListFolderItemProps = {
  id: string;
  name: string;
  index: number;
  isFocus: boolean;
};

export const ListFolderItem = memo(({ id, name, isFocus }: ListFolderItemProps) => {
  const removeFolder = useBookmarkStore((state) => state.removeFolder);

  return (
    <div
      tabIndex={-1}
      id={`list-folder-item-${id}`}
      className={clsx(
        "flex flex-col h-full items-center overflow-hidden relative group transition-all duration-150 border-2 rounded-lg",
        isFocus ? "border" : "border-white"
      )}
    >
      <Link
        tabIndex={-1}
        className="w-full aspect-video bg-gray-100 rounded-md overflow-hidden mb-4"
        to={`/bookmark-manager/${id}`}
      >
        <Button
          tabIndex={-1}
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
      <div className="flex flex-1 h-full" tabIndex={-1}>
        <BookmarkNameInput id={id} name={name} />
      </div>
    </div>
  );
});

const BookmarkNameInput = memo(({ id, name }: { id: string; name: string }) => {
  const renameFolder = useBookmarkStore((state) => state.renameFolder);
  const searchQuery = useBookmarkStore((state) => state.searchFolderQuery);

  return (
    <input
      tabIndex={-1}
      type="text"
      name="editor-title-input"
      value={name}
      disabled={!!searchQuery}
      className="outline-none focus-visible:outline-none w-full overflow-scroll text-center  truncate text-ellipsis line-clamp-1"
      onChange={(e) => renameFolder(id, e.target.value)}
    />
  );
});
