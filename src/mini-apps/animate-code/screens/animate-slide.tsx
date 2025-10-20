"use client";

import React, { useRef, useState, useEffect } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";
import { AnimatePresence } from "framer-motion";
import { AnimateCode } from "./animate-code";

hljs.registerLanguage("javascript", javascript);

// Slides
const slides = [
  `class Person {}
`,
  `class Person {
}
`,
  `class Person {
  speak() {}
}
`,
  `class Person {
  speak() {
    console.log("speak")
  }
}
`,
  `class Person {
  speak() { ... }

  run() { 
    console.log("run")
  }
}
`,
];

export const SlideCodePreview: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const prevSlide = useRef<string>("");

  const currentCode = slides[currentSlide];

  // Handle arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const prevCode = prevSlide.current;

  useEffect(() => {
    prevSlide.current = currentCode;
  }, [currentCode]);

  return (
    <div className="w-[500px] bg-black p-4 rounded-lg relative min-h-32">
      <AnimatePresence mode="wait">
        <AnimateCode
          key={currentSlide} // force remount for animation
          code={currentCode}
          prevCode={prevCode} // pass previous code
          language="javascript"
        />
      </AnimatePresence>
    </div>
  );
};

export default SlideCodePreview;
