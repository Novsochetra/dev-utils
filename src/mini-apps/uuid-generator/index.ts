import { v4 } from "uuid";
import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";
import { APP_BASE_PATH, APP_NAME } from "./utils/constants";

registerMiniApp({
  id: v4(),
  basePath: APP_BASE_PATH,
  routes,
  name: APP_NAME,
});
