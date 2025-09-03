export const routes = [
  {
    path: "",
    lazy: async () => {
      const { default: Component } = await import("./screens/home-screen.tsx");
      return { Component };
    },
  },
];
