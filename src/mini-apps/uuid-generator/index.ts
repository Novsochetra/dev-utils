import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  basePath: "/uuid-generator",
  routes,
  name: "UUID Generator",
});
