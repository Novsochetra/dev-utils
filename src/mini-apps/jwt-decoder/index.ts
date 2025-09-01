import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  basePath: "/jwt-decoder-encoder",
  routes,
  name: "JWT Decoder / Encoder",
});
