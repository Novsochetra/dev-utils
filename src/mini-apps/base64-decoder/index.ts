import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  basePath: "/base64-decoder",
  routes,
  name: "Base64 Decode / Encode",
});
