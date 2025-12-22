import { BookmarkForm } from "../bookmark-form";

export const BookmarkManagerDetailRightToolbar = () => {
  return (
    <div
      className="flex flex-1 overflow-auto scrollbar-hidden justify-end"
      data-tauri-drag-region
    >
      <BookmarkForm />
    </div>
  );
};
