import { motion } from "framer-motion";

export const BrowserPreview = ({ code }: { code: string }) => {
  return (
    <motion.div
      key={"browser-preview"}
      className="w-full aspect-video rounded-lg select-none border-2 border-zinc-500 overflow-clip"
      layout
    >
      <iframe
        className="w-full h-full bg-white"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={code}
      />
    </motion.div>
  );
};
