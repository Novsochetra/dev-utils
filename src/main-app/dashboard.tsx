import { getMiniApps, getRoutes } from "@/core/mini-app-registry";
import { Navbar } from "@/vendor/components/navbar";
import { Braces } from "lucide-react";
import { Link } from "react-router";

function App() {
  const miniApps = getMiniApps();

  return (
    <div className="">
      <Navbar showSearchBar />

      <div className="flex gap-8 p-8 items-stretch">
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
      className="rounded-xl w-40 flex flex-col items-center overflow-hidden "
    >
      <div className="w-40 h-40 bg-teal-100 rounded-xl flex items-center justify-center">
        {icon ? (
          <img src={icon} className="w-full h-full object-cover" />
        ) : (
          <Braces size={32} />
        )}
      </div>
      <p className="truncate line-clamp-2 text-wrap text-center mt-4">{name}</p>
    </Link>
  );
};

export default App;
