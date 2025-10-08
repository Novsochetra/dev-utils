import { motion } from "framer-motion";

export const AnimatedPage: React.FC<{
  children: React.ReactNode;
  id: string;
}> = ({ children, id }) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};
