import { AnimatedPage } from "@/vendor/components/animate-page";
import { AnimatePresence } from "framer-motion";
import { APP_ID } from "../utils/constants";
import { Navbar } from "@/vendor/components/navbar";
import AnimateSlides from "./animate-slide";

// Example slides
const slide1 = `class Person {}
`;

const slide2 = `class Person {
}
`;

const slide3 = `class Person {
  speak() {}
}
`;

const slide4 = `class Person {
  speak() {
    console.log("speak")
  }
}
`;

const slide5 = `class Person {
  speak() { ... }

  run() { 
    console.log("run")
  }
}
`;

const slides = [slide1, slide2, slide3];

export const AnimateCodeHomeScreen = () => {
  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="min-h-screen w-full flex flex-col">
          <Navbar showBack title="Animate Code" showSearchBar={false} />
          <AnimateSlides code={slide3} language="javascript" lineDelay={1} />
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default AnimateCodeHomeScreen;
