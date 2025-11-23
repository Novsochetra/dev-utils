import { memo } from "react";
import { useStore } from "../../state/state";
import { motion } from "framer-motion";

export const GradientBackground = memo(
  ({
    layoutId,
    projectId,
    layoutKey,
  }: {
    projectId: string;
    layoutId?: string;
    layoutKey?: string;
  }) => {
    const angle = useStore(
      (s) => s.projectDetail[projectId].previewBackground.angle,
    );
    const from = useStore(
      (s) => s.projectDetail[projectId].previewBackground.from,
    );
    const to = useStore((s) => s.projectDetail[projectId].previewBackground.to);

    return (
      <motion.div
        layoutId={layoutId}
        key={layoutKey}
        className="absolute top-0 left-0 select-none w-full h-full"
        layout
        style={{
          background: `linear-gradient(${angle}deg, ${from}, ${to})`,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 18,
          mass: 0.6,
        }}
      />
    );
  },
);
