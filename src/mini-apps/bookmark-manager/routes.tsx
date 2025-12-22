export const routes = [
  {
    path: "",
    lazy: async () => {
      const { default: Component } = await import("./screens/home-screen.tsx");
      return { Component };
    },
  },
  {
    path: "/bookmark-manager/:id",
    lazy: async () => {
      const { default: Component } = await import("./screens/bookmark-detail-screen.tsx");
      return { Component };
    },
    handle: { showBackButton: true },
  },
];
