import { routes as mainRoutes } from "@/main-app/routes";

export type MiniApp = {
  basePath: string;
  routes: Array<any>;
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

  return [...mainRoutes, ...miniAppRoutes];
}

export const getMiniApps = () => {
  return miniApps;
};
