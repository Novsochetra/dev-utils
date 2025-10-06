import { v4 } from "uuid";
import { registerMiniApp } from "@/core/mini-app-registry";
import { routes } from "./routes";
import { APP_BASE_PATH, APP_NAME, APP_ID } from "./utils/constants";

registerMiniApp({
  id: APP_ID,
  basePath: APP_BASE_PATH,
  routes,
  name: APP_NAME,
});
