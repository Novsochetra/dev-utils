export const routes = [
  {
    path: "",
    lazy: async () => {
      const { default: Component } = await import("./screens/home-screen.tsx");
      return { Component };
    },
  },
  // {
  //   path: "/animate-code/project/:id",
  //   lazy: async () => {
  //     const { default: Component } = await import(
  //       "./screens/project-detail-screen.tsx"
  //     );
  //     return { Component };
  //   },
  // },
  {
    path: "/animate-code/landing",
    lazy: async () => {
      const { default: Component } = await import(
        "./screens/landing-v2-screen.tsx"
      );
      return { Component };
    },
  },
];
