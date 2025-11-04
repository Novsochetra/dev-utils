import { motion } from "framer-motion";
import { Button } from "@/vendor/shadcn/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4">404</h1>
        <p className="text-lg md:text-xl mb-6">
          Busy working on features…
          <br />
          didn’t have time for a fancy 404 page 😅
        </p>

        <Button
          className="bg-indigo-600 hover:bg-indigo-700 mb-4 border-2 border-white"
          asChild
        >
          <a href="#" target="_blank" rel="noopener noreferrer">
            Go Back Home
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
