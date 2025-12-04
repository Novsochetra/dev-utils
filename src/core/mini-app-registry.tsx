import type { RouteObject } from "react-router";
import { routes as mainRoutes } from "@/main-app/routes";
import { AppLayout } from "@/vendor/components/app-layout";

export type MiniApp = {
  id: string;
  basePath: string;
  routes: RouteObject[];
  icon?: string;
  name: string;
  description?: string;
};

const miniApps: MiniApp[] = [];

export function registerMiniApp(app: MiniApp) {
  miniApps.push(app);
}

export function getRoutes() {
  const miniAppRoutes = miniApps.map((m) => {
    return {
      path: `${m.basePath}`,
      children: m.routes,
    };
  });

  const cloneMainRoutes = [...mainRoutes];
  const findIdx = cloneMainRoutes.findIndex((r) => r.path === "/");
  if (findIdx !== -1) {
    cloneMainRoutes[findIdx] = {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true, // default route when visiting "/"
          lazy: async () => {
            const { default: Component } =
              await import("../main-app/dashboard");
            return { Component };
          },
        },
        ...miniAppRoutes,
      ],
    };

    return cloneMainRoutes;
  }

  return [...mainRoutes, ...miniAppRoutes];
}

export function getMiniApps() {
  return miniApps;
}
