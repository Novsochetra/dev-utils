import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";

registerMiniApp({
  basePath: "/qr-code-generator",
  routes,
  name: "QR Code Generator",
});
