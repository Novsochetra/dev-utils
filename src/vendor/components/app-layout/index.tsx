import { memo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getVersion } from "@tauri-apps/api/app";
import { HomeIcon, PackageIcon, SidebarIcon } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Outlet,
  NavLink,
  useMatches,
  type UIMatch,
} from "react-router";

import { getMiniApps } from "@/core/mini-app-registry";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import { appStateLocalStorageEngine, useAppStore } from "@/main-app/state";
import { Navbar } from "../navbar";
import { MacOSTrafficLight } from "../navbar/macos-traffic-light";

const sidebarWidth = 300;
export const minMenuBarLeftWidth = 130;

export const AppLayout = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    appStateLocalStorageEngine.onHydrateCompleted(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return <p>loading</p>;
  }

  return (
    <div className="flex text-sm min-h-0 select-none">
      <MenuBar />

      <LeftSidebar />

      <div className="w-px h-screen bg-border" />

      {/* MAIN CONTENT */}
      <main className="h-screen flex flex-1 flex-col min-w-0">
        <div className="h-12 w-full" />
        <Separator />

        <Outlet />
      </main>
    </div>
  );
};

export const MenuBar = () => {
  return (
    <motion.div
      data-tauri-drag-region
      className="h-12 w-screen flex flex-1 fixed top-0 z-50 bg-transparent"
    >
      <MenuBar.Left />
      <MenuBar.Center />
      <MenuBar.Right />
    </motion.div>
  );
};

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    function onResize() {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return windowWidth
}

const MenuBarLeft = () => {
  const windowWidth = useWindowWidth()
  const sidebarVisible = useAppStore((s) => s.sidebarVisible);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const leftMenuBar = useAppStore(s => s.menubar.left)
  const width = sidebarVisible
    ? (windowWidth - sidebarWidth) / 3 + sidebarWidth
    : windowWidth / 3;

  return (
    <motion.div
      layout
      className="flex items-center"
      animate={{ width }}
      data-tauri-drag-region
    >
      <motion.div
        layout
        data-tauri-drag-region
        animate={{ width: sidebarVisible ? sidebarWidth : minMenuBarLeftWidth }}
        className="flex"
      >
        <MacOSTrafficLight />

        <Button
          variant="ghost"
          size="icon"
          title="toggle sidebar"
          data-tauri-drag-region={false}
          onClick={toggleSidebar}
        >
          <SidebarIcon className="text-slate-500" size={20} />
        </Button>
      </motion.div>

      <div className="flex flex-1 px-2 min-w-0 items-center" data-tauri-drag-region>
        {leftMenuBar}
      </div>
    </motion.div>
  );
};

const MenuBarCenter = memo(() => {
  const windowWidth = useWindowWidth()
  const sidebarVisible = useAppStore((s) => s.sidebarVisible);
  const matches = useMatches() as UIMatch<
    unknown,
    { title?: string; showBackButton?: boolean }
  >[];
  const current = matches[matches.length - 1];
  const width = sidebarVisible
    ? (windowWidth - sidebarWidth) / 3
    : windowWidth / 3;

  return (
    <motion.div
      layout
      className="flex flex-1 h-full justify-center min-w-0 max-h-12"
      animate={{ width }}
    >
      <Navbar showSearchBar showBack={current?.handle?.showBackButton} />
    </motion.div>
  );
});

const MenuBarRight = () => {
  const windowWidth = useWindowWidth()
  const sidebarVisible = useAppStore((s) => s.sidebarVisible);
  const children = useAppStore((state) => state.menubar.right);
  const width = sidebarVisible
    ? (windowWidth - sidebarWidth) / 3
    : windowWidth / 3;

    return (
    <motion.div
      data-tauri-drag-region
      className="flex items-center justify-end flex-nowrap px-2"
      animate={{ width }}
      layout
    >
      {children}
    </motion.div>
  );
};

MenuBar.Left = MenuBarLeft;
MenuBar.Right = MenuBarRight;
MenuBar.Center = MenuBarCenter;

const LeftSidebar = () => {
  const miniApps = getMiniApps();
  const show = useAppStore((state) => state.sidebarVisible);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const openSidebar = useAppStore((state) => state.openSidebar);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex gap-2 px-4 py-2 rounded-lg items-center ${
      isActive ? "bg-primary text-primary-foreground" : "bg text-foreground"
    }`;
  useHotkeys(
    "meta+b",
    () => {
      toggleSidebar();
    },
    { enabled: true, enableOnContentEditable: true, enableOnFormTags: true }
  );

  useEffect(() => {
    if (show) {
      openSidebar();
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          layout
          className={`h-screen flex flex-col w-[${sidebarWidth}px]`}
          initial={{ opacity: 0, maxWidth: 0 }}
          animate={{ opacity: 1, maxWidth: 300 }} // numeric animatable target
          exit={{ opacity: 0, maxWidth: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <div className="w-full h-12 flex" />

          <Separator />

          <div className="min-h-0 flex flex-1 flex-col">
            <nav className="flex-1 flex p-4 flex-col overflow-auto">
              <NavLink to="/" className={linkClass} end>
                <HomeIcon className="max-w-4 max-h-4 min-w-4 min-h-4" />
                <span className="w-full truncate">Dashboard</span>
              </NavLink>
              {miniApps.map((app) => (
                <NavLink key={app.id} className={linkClass} to={app.basePath}>
                  <PackageIcon className="max-w-4 max-h-4 min-w-4 min-h-4" />
                  <span className="w-full truncate">{app.name}</span>
                </NavLink>
              ))}
            </nav>

            <AppVersion />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

const AppVersion = () => {
  const [version, setVersion] = useState("");

  useEffect(() => {
    getVersion()
      .then((value) => {
        setVersion(value);
      })
      .catch((_err) => {
        // TODO: handle error case
      });
  }, []);

  return (
    <>
      <Separator />
      <div className="h-10 flex items-center justify-center">
        <div className="text-xs text-slate-500">v{version}</div>
      </div>
    </>
  );
};
