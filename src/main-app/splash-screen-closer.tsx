import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";

export function SplashScreenCloser() {
  useEffect(() => {
    setTimeout(() => {
      invoke("close_splashscreen");
    }, 500);
  }, []);

  return null;
}