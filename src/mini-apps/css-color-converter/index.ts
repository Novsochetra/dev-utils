import { v4 } from "uuid";
import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  id: v4(),
  basePath: "/css-color-converter",
  routes,
  name: "CSS Color Converter",
});
