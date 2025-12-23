import { AnimatePresence, motion } from "framer-motion";
import { ListFolderItem } from "./list-folder-item";
import { useBookmarkStore } from "../../state/state";

export const BookmarkFolders = () => {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.05, // delay between each card
          },
        },
      }}
    >
      <ListFolder />
    </motion.div>
  );
};

export const ListFolder = () => {
  const folders = useBookmarkStore((state) => state.folders);
  const searchFolderQuery = useBookmarkStore(state => state.searchFolderQuery)
  const searchFolderResult = useBookmarkStore(state => state.searchFolderResult)
  const items = searchFolderQuery ? searchFolderResult : folders

  return (
    <AnimatePresence>
      {items.map((p, idx) => {
        return (
          <motion.div
            key={p.id}
            layout
            layoutId={`folder-item-${p.id}`}
            variants={{
              hidden: {
                scale: 0.9,
                opacity: 0,
              },
              show: {
                scale: 1,
                opacity: 1,
              },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
            }}
          >
            <ListFolderItem id={p.id} index={idx} name={p.name} />
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};
