import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.02,
    },
  },
  hidden: {},
};

export const staggeredItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.15 }
  },
};

interface StaggeredListProps {
  animationKey?: string; 
  children: ReactNode; 
  className?: string;
}

export const StaggeredListContainer = ({
  animationKey,
  children,
  className,
}: StaggeredListProps) => {
  const shouldReduceMotion = useReducedMotion();

  // If motion is reduced, disable the initial/animate props
  const animationProps = shouldReduceMotion || !animationKey
    ? {
        key: animationKey,
        className,
      }
    : {
        key: animationKey, 
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
        className,
      };

  return (
    // INFO: must be provide animationKey={animationKey} re-triggering the stagger
    <motion.div {...animationProps}>
      <AnimatePresence mode="popLayout"> 
        {children}
      </AnimatePresence>
    </motion.div>
  );
};