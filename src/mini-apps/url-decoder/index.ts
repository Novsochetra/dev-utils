
import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  basePath: "/url-decoder",
  routes,
  name: "URL Decode / Encode",
});
