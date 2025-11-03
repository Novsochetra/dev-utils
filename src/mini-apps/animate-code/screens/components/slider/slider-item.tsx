import { memo } from "react";
import { motion } from "framer-motion";
import { Trash2Icon } from "lucide-react";
import clsx from "clsx";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/vendor/shadcn/components/ui/context-menu";
import { AppActions } from "@/mini-apps/animate-code/state/actions";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { SliderPreviewImage } from "./slider-preview-item";

import { SLIDER_CONTENT_WIDTH, BORDER_WIDTH } from "./constants";

export type SliderItemProps = {
  index: number;
  active: boolean;
};

export const SliderItem = memo(
  ({ active, index }: SliderItemProps) => {
    return (
      <div>
        <ContextMenu>
          <ContextMenuTrigger>
            <motion.div
              className={clsx(
                `group w-[${SLIDER_CONTENT_WIDTH}px] max-h-[72px] min-h-[72px] rounded-md overflow-hidden relative transition-border`,
                active ? "border-sky-400" : "",
              )}
              style={{ borderWidth: BORDER_WIDTH }}
              onClick={() => AppActions.SelectSlide(index)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 200, // Apple-style stiffness
                damping: 25, // Apple-style damping
                mass: 0.6, // lighter mass for smoother motion
              }}
              layout
            >
              <div className="w-full h-full bg-gray-50 relative">
                <SliderPreviewImage index={index} />
                <p className="absolute top-1 left-1 text-xs font-semibold text-gray-600 bg-border px-1 rounded">
                  {index + 1}
                </p>
              </div>
              <Button
                variant="link"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-white bg-zinc-600 transition-opacity hover:bg-none"
                onClick={() => AppActions.RemoveSlide(index)}
              >
                <Trash2Icon size={12} />
              </Button>
            </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              className="text-xs"
              onClick={() => {
                AppActions.AddSlideAbove(index);
              }}
            >
              Add Slide Above
            </ContextMenuItem>
            <ContextMenuItem
              className="text-xs"
              onClick={() => {
                AppActions.AddSlideBelow(index);
              }}
            >
              Add Slide Below
            </ContextMenuItem>
            <ContextMenuItem
              className="text-xs"
              onClick={() => AppActions.RemoveSlide(index)}
            >
              Delete Slide
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
  (prev, next) => prev.index === next.index && prev.active === next.active,
);
