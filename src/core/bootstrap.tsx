import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { getRoutes } from "./mini-app-registry.tsx";
import { Toaster } from "@/vendor/shadcn/components/ui/sonner.tsx";

import.meta.glob("@/mini-apps/*/index.{ts,tsx,js,jsx}", { eager: true });

const routes = getRoutes();

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <Fragment>
    <RouterProvider router={router} />
    <Toaster />
  </Fragment>,
);
