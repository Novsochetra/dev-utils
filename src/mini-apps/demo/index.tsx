import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  basePath: "/demo",
  routes,
  name: "Demo",
});
