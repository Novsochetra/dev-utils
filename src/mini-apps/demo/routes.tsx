export const routes = [
  {
    path: "a",
    lazy: async () => {
      const { default: Component } = await import("./screen-a");
      return { Component };
    },
  },
  {
    path: "b",
    lazy: async () => {
      const { default: Component } = await import("./screen-a");
      return { Component };
    },
  },
];
