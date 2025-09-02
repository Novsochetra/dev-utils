import { v4 } from "uuid";
import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  id: v4(),
  basePath: "/qr-code-generator",
  routes,
  name: "QR Code Generator",
});
