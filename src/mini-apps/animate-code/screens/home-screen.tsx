import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { v4 } from "uuid";
import("highlight.js/lib/common");
import "highlight.js/styles/atom-one-dark.css"; // any theme
import hljs from "highlight.js/lib/core";
import html2canvas from "html2canvas-pro";

import AnimateSlides from "./animate-slide";
import { APP_ID } from "../utils/constants";
import { AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";
import { Slider } from "./slider";

// Example slides
const slide0 = `
// Create a simple class
`;

const slide1 = `
// Create a simple class
class Person {
}
`;

const slide2 = `
// Create a simple class
class Person {
  constructor() { }
}
`;

const slide3 = `
// Create a simple class
class Person {
  constructor(name) {
    this.name = name;
  }
}
`;

const slide4 = `
// Create a simple class
class Person {
  constructor(name) { /* ... */ }
}

// Create an instance
const person = new Person("Alice");
`;

const slide5 = `
// Create a simple class
class Person { /* ... */ }

// Create an instance
const person = new Person("Alice");

`;

const slide6 = `
// Create a simple class
class Person { /* ... */ }

// Create an instance
const person = new Person("Alice");
console.log("person: ", person)
`;
const d = [slide0, slide1, slide2, slide3, slide4, slide5, slide6];

const defaultSlides = d.map((v, i) => ({ id: v4(), data: v }));

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
  const [canvasPreviewsRef, setCanvasPreviewRef] = useState<
    Record<string, string>
  >({});
  const codeEditorRef = useRef<HTMLDivElement | null>(null);
  const tempCanvas = useRef(document.createElement("canvas"));

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

  useEffect(() => {
    async function generateAllPreviews() {
      const hiddenContainer = document.createElement("div");
      hiddenContainer.style.position = "fixed";
      hiddenContainer.style.top = "-9999px";
      hiddenContainer.style.left = "-9999px";
      hiddenContainer.style.width = "400px";
      hiddenContainer.style.height = "225px";
      hiddenContainer.style.pointerEvents = "none";

      document.body.appendChild(hiddenContainer);

      console.log("LENGTH SLIDE: ", slides);
      for (let i = 0; i < slides.length; i++) {
        const div = document.createElement("div");

        div.classList.add("hljs");
        div.style.width = "600px";
        div.style.height = "337.5px";

        const highlighted = hljs.highlight(slides[i].data || "", {
          language: "javascript",
        });

        // Dynamically render your CodeEditorWithHighlight inside the offscreen div
        const preTagNode = `<pre
        ref={preRef}
        aria-hidden="true"
        className="relative w-[600px] h-[337.5px] inset-0 text-base font-mono hljs border-2 border-red-500 rounded-lg p-3 overflow-auto"
        style={{
          fontSize: 12,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <code>
          ${highlighted.value}
        </code>
      </pre>
        `;

        div.innerHTML = preTagNode;

        hiddenContainer.appendChild(div);

        const canvasWidth = 600;
        const canvas = await html2canvas(div, {});

        const resizedCanvasWidth = 200;
        tempCanvas.current.width = resizedCanvasWidth;
        tempCanvas.current.height = (9 * canvasWidth) / 16;
        const ctx = tempCanvas.current.getContext("2d");

        ctx?.drawImage(
          canvas,
          0,
          0,
          tempCanvas.current.width,
          tempCanvas.current.height,
        );

        const base64Image = tempCanvas.current.toDataURL("image/jpeg");
        setCanvasPreviewRef((prev) => ({ ...prev, [`${i}`]: base64Image }));
      }

      document.body.removeChild(hiddenContainer);
    }

    generateAllPreviews();
  }, []);

  const onAddSlide = useCallback(() => {
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
    setCanvasPreviewRef((prev) => {
      delete prev[`${index}`];
      return prev;
    });
  }, []);

  const onUpdateContentRef = (index: number, newValue: string) => {
    slidersContentRef.current[index].data = newValue;
    capturePreviewImage(index);
  };

  const onToggleMode = useCallback(() => {
    if (mode === Mode.Edit) {
      setMode(Mode.Preview);
    } else if (mode === Mode.Preview) {
      setMode(Mode.Edit);
    }
  }, [mode]);

  const capturePreviewImage = async (index: number) => {
    if (!codeEditorRef.current) {
      return;
    }

    const canvas = await html2canvas(codeEditorRef.current);
    // const aspectRatioCodeEditor = 16 / 9
    const canvasWidth = 300;
    tempCanvas.current.width = canvasWidth;
    tempCanvas.current.height = (9 * canvasWidth) / 16;
    const ctx = tempCanvas.current.getContext("2d");
    ctx?.drawImage(
      canvas,
      0,
      0,
      tempCanvas.current.width,
      tempCanvas.current.height,
    );

    const base64Image = tempCanvas.current.toDataURL("image/jpeg");
    console.log("UPDATE: ");
    setCanvasPreviewRef((prev) => ({
      ...prev,
      [`${index}`]: base64Image,
    }));
  };

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
                  slidersContentRef={slidersContentRef.current}
                  canvasPreviewsRef={canvasPreviewsRef}
                  codeEditorRef={codeEditorRef}
                  onUpdateContentRef={onUpdateContentRef}
                  setCanvasPreviewRef={setCanvasPreviewRef}
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
