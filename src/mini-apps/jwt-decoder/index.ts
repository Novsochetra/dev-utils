import { v4 } from "uuid";
import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  id: v4(),
  basePath: "/jwt-decoder-encoder",
  routes,
  name: "JWT Decoder / Encoder",
});
