import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { AnimatePresence } from "framer-motion";
import { APP_ID } from "../utils/constants";
import { Navbar } from "@/vendor/components/navbar";
import AnimateSlides from "./animate-slide";
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

const slides = [slide2, slide3, slide4];

export const Mode = {
  Preview: 0,
  Edit: 1,
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];

export const AnimateCodeHomeScreen = () => {
  const [slides, setSlides] = useState([slide1, slide2, slide3]);
  const slidersContentRef = useRef<string[]>([slide1, slide2, slide3]);
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<Mode>(Mode.Edit);

  // Handle arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIdx((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIdx((prev) => Math.max(prev - 1, 0));
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
    setSlides((prev) => [...prev, ""]);
    slidersContentRef.current.push("");
  }, []);

  const onRemoveSlide = useCallback((index: number) => {
    setSlides((prev) => prev.filter((_, i) => index !== i));
    slidersContentRef.current.push("");
  }, []);

  const onUpdateContentRef = (index: number, newValue: string) => {
    slidersContentRef.current[index] = newValue;
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
          <Navbar showBack title="🤩" showSearchBar={false} />

          <div className="flex flex-1 flex-col items-center p-8 bg-red-200 ">
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
                <div className="w-full">
                  <AnimateSlides
                    newText={slidersContentRef.current[idx]}
                    oldText={
                      slidersContentRef.current[idx == 0 ? 0 : idx - 1] || ""
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default AnimateCodeHomeScreen;
