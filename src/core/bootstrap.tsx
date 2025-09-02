import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { getRoutes } from "./mini-app-registry.ts";
import { Toaster } from "@/vendor/shadcn/components/ui/sonner.tsx";

import.meta.glob("@/mini-apps/*/index.{ts,tsx,js,jsx}", { eager: true });

const routes = getRoutes();

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
);
