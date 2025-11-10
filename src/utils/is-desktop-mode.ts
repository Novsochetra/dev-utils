export const isDesktopApp =
  // @ts-ignore
  typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;
export const isWebApp = !isDesktopApp;
