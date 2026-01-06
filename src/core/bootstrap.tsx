import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import { getRoutes } from "./mini-app-registry.tsx";
import { Toaster } from "@/vendor/shadcn/components/ui/sonner.tsx";
import { SplashScreenCloser } from "@/main-app/splash-screen-closer.tsx";

import.meta.glob("@/mini-apps/*/index.{ts,tsx,js,jsx}", { eager: true });

const routes = getRoutes();

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
    <SplashScreenCloser />
  </StrictMode>,
);
