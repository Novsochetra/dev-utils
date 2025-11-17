import { AnimatePresence } from "framer-motion";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";

import { APP_ID } from "../utils/constants";
import { ListProject } from "./components/list-project";

export const AnimateCodeHomeScreen = () => {
  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="h-dvh w-full flex flex-col overscroll-none">
          <Navbar
            showBack
            title="🤩"
            showSearchBar={false}
            enableBackOnFormTags
          />
          <div className="flex flex-1 flex-col px-8 py-4 min-h-0">
            <ListProject />
          </div>
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default AnimateCodeHomeScreen;
