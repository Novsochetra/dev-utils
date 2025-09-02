import { v4 } from "uuid";
import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  id: v4(),
  basePath: "/unix-timestamps-converter",
  routes,
  name: "Unix Timestamps Converter",
});
