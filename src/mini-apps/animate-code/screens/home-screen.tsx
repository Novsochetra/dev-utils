import { AnimatedPage } from "@/vendor/components/animate-page";
import { AnimatePresence } from "framer-motion";
import { APP_ID } from "../utils/constants";
import { Navbar } from "@/vendor/components/navbar";
import AnimateSlides from "./animate-slide";
import { useEffect, useState } from "react";

// Example slides
const slide1 = `
<div></div>
`;

const slide2 = `
<div>
</div>
`;

const slide3 = `
<div class="container">
  <input />
</div>
`;

const slide4 = `
<div class="...">
  <input />
</div>
`;

const slides = [slide2, slide3, slide4];

export const AnimateCodeHomeScreen = () => {
  const [idx, setIdx] = useState(0);

  // Handle arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIdx((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIdx((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="min-h-screen w-full flex flex-col">
          <Navbar showBack title="🤩" showSearchBar={false} />
          <button
            onClick={() => {
              setIdx((prev) => (prev + 1) % slides.length);
            }}
          >
            Next ({idx + 1} / {slides.length})
          </button>
          <AnimateSlides
            newText={slides[idx]}
            oldText={slides[idx == 0 ? 0 : idx - 1] || ""}
          />
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default AnimateCodeHomeScreen;
