import { v4 } from "uuid";
import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  id: v4(),
  basePath: "/base64-decoder",
  routes,
  name: "Base64 Decode / Encode",
});
