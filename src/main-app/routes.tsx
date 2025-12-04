import type { RouteObject } from "react-router";

export const routes: RouteObject[] = [
  {
    path: "/",
    lazy: async () => {
      const { default: Component } = await import("./dashboard");
      return { Component };
    },
  },
  {
    path: "*",
    lazy: async () => {
      const { default: Component } = await import("./not-found");
      return { Component };
    },
  },
];
