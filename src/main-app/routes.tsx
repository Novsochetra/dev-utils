export const routes = [
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
