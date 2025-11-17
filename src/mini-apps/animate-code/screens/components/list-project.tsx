import { useAtomValue } from "jotai";
import { AppState } from "../../state/state";
import { ProjectCard } from "./project-card";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { PlusIcon } from "lucide-react";
import { AppActions } from "../../state/actions";
import { AnimatePresence, motion } from "framer-motion";

export const ListProject = () => {
  const projects = useAtomValue(AppState.projects);

  return (
    <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <AddProjectButton />
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

const AddProjectButton = () => {
  return (
    <div>
      <div
        className="w-full aspect-video rounded-sm flex items-center justify-center bg-slate-100 cursor-pointer mb-4"
        onClick={() => {
          AppActions.AddProject();
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
};
