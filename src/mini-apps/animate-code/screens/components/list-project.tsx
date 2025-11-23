import { memo } from "react";
import { useStore } from "../../state/state";
import { ProjectCard } from "./project-card";
import { PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const ListProject = () => {
  const projects = useStore((state) => state.projects);

  return (
    <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <AddProjectButton />
      {/* INFO: using framer motion cause every change is re-render, thinking of optimize it using other way */}
      <AnimatePresence>
        {projects.map((p, idx) => {
          return (
            <motion.div
              layout
              layoutId={`project-item-${p.id}`}
              key={`project-item-${p.id}`}
              className="h-full"
              initial={{ scale: 0.9, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <ProjectCard id={p.id} index={idx} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

const AddProjectButton = memo(() => {
  const addProject = useStore((s) => s.addProject);
  return (
    <div>
      <div
        className="w-full aspect-video rounded-sm flex items-center justify-center bg-slate-100 cursor-pointer mb-4"
        onClick={() => {
          addProject();
        }}
      >
        <PlusIcon size={32} className="text-foreground" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <p className="truncate line-clamp-1 text-wrap text-center text-foreground">
          Add Slide
        </p>
      </div>
    </div>
  );
});
