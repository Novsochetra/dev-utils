

import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  basePath: "/lorem-generator",
  routes,
  name: "Lorem Generator",
});
