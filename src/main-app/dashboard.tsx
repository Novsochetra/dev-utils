import { PackageIcon } from "lucide-react";
import { Link } from "react-router";

import { getMiniApps } from "@/core/mini-app-registry";
import { AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/vendor/components/animate-page";
import("@/mini-apps/data-generator/utils/faker");

function App() {
  const miniApps = getMiniApps();

  return (
    <div className="flex flex-1 min-h-0 overflow-auto">
      <AnimatePresence mode="wait">
        <AnimatedPage id="dashboard-main-app" classname="flex flex-1">
          <div className="w-full grid gap-8 p-8 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-[repeat(auto-fill,_minmax(100px,200px))]">
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
        </AnimatedPage>
      </AnimatePresence>
    </div>
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
      className="rounded-xl flex flex-col"
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
