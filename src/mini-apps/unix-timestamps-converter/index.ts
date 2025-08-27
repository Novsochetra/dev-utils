import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  basePath: "/unix-timestamps-converter",
  routes,
  name: "Unix Timestamps Converter",
});
