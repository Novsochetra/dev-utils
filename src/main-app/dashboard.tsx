import { PackageIcon } from "lucide-react";
import { Link } from "react-router";

import { getMiniApps } from "@/core/mini-app-registry";
import { Navbar } from "@/vendor/components/navbar";
import { AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/vendor/components/animate-page";

function App() {
  const miniApps = getMiniApps();

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage key="dashboard-main-app">
        <div className="">
          <Navbar showSearchBar />

          <div className="grid gap-8 p-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]">
            {miniApps.map((a, index) => {
              return (
                <AppIcon
                  key={`app-${index}`}
                  icon={a.icon}
                  path={a.basePath}
                  name={a.name}
                />
              );
            })}
          </div>
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
}

const AppIcon = ({
  icon,
  name,
  path,
}: {
  icon?: string;
  name: string;
  path: string;
}) => {
  return (
    <Link
      to={path}
      className="rounded-xl flex flex-col items-center overflow-hidden "
    >
      <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        {icon ? (
          <img src={icon} className="w-full h-full object-cover" />
        ) : (
          <PackageIcon size={32} className="text-stone-500" />
        )}
      </div>
      <p className="truncate line-clamp-2 text-wrap text-center mt-4">{name}</p>
    </Link>
  );
};

export default App;
