import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { v4 } from "uuid";

import AnimateSlides from "./animate-slide";
import { APP_ID } from "../utils/constants";
import { AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";
import { Slider } from "./slider";

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
const d = [slide1, slide2, slide3];

const defaultSlides = d.map((v, i) => ({ id: v4(), data: v }));

console.log("D; ", defaultSlides);
export const Mode = {
  Preview: 0,
  Edit: 1,
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];

export const AnimateCodeHomeScreen = () => {
  const [slides, setSlides] =
    useState<Array<{ id: string; data: string }>>(defaultSlides);
  const slidersContentRef =
    useRef<Array<{ id: string; data: string }>>(defaultSlides);
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<Mode>(Mode.Edit);

  // Handle arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIdx((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setMode(Mode.Edit);
      }
    };

    if (mode === Mode.Preview) {
      window.addEventListener("keydown", handleKey);
    } else {
      window.removeEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode]);

  const onAddSlide = useCallback(() => {
    //
    const newItem = { id: v4(), data: "" };
    setSlides((prev) => [...prev, newItem]);
    slidersContentRef.current.push({ ...newItem });
  }, []);

  const onRemoveSlide = useCallback((index: number) => {
    setSlides((prev) => {
      if (prev.length === 1) {
        return prev;
      }

      return prev.filter((_, i) => index !== i);
    });
    slidersContentRef.current.filter((_, i) => index !== i);
  }, []);

  const onUpdateContentRef = (index: number, newValue: string) => {
    slidersContentRef.current[index].data = newValue;
    console.log("update: ", slidersContentRef.current);
  };

  const onToggleMode = useCallback(() => {
    console.log("HI");
    if (mode === Mode.Edit) {
      setMode(Mode.Preview);
    } else if (mode === Mode.Preview) {
      setMode(Mode.Edit);
    }
  }, [mode]);

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="min-h-screen w-full flex flex-col">
          <Navbar
            showBack
            title="🤩"
            showSearchBar={false}
            enableBackListener={mode === Mode.Edit}
          />

          <div className="flex flex-1 flex-col items-center p-8">
            <div className="flex lg:w-8/12 rounded-xl bg-white border overflow-hidden">
              {mode === Mode.Edit ? (
                <Slider
                  mode={mode}
                  slidersContentRef={slidersContentRef}
                  onUpdateContentRef={onUpdateContentRef}
                  activeIdx={idx}
                  slides={slides}
                  onAddSlide={onAddSlide}
                  onRemoveSlide={onRemoveSlide}
                  onToggleMode={onToggleMode}
                  onSelecteSlide={(index) => setIdx(index)}
                />
              ) : null}
              {mode === Mode.Preview ? (
                <motion.div
                  className="w-full h-[600px]"
                  layout
                  key="code-editor-preview"
                  layoutId="code-editor"
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                    mass: 0.6,
                  }}
                >
                  <AnimateSlides
                    newText={slidersContentRef.current[idx].data}
                    oldText={
                      slidersContentRef.current[idx == 0 ? 0 : idx - 1]?.data ||
                      ""
                    }
                  />
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default AnimateCodeHomeScreen;
