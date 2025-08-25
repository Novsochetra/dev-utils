export const routes = [
  {
    path: "/",
    lazy: async () => {
      const { default: Component } = await import("./dashboard");
      return { Component };
    },
  },
];
