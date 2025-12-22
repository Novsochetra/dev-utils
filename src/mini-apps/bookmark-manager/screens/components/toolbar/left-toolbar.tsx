import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

export const BookmarkManagerLeftToolbar = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-1 px-2 min-w-0 items-center"
      data-tauri-drag-region
    >
      <a
        href="#"
        data-tauri-drag-region={false}
        onClick={() => {
          navigate('/')
        }}
        className="flex items-center text-zinc-600"
      >
        <ChevronLeft className="mr-2" size={24} />
      </a>

      <p className="w-full truncate text-sm text-foreground">
        Bookmark Manager
      </p>
    </div>
  );
};
