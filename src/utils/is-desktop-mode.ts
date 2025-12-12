export const isDesktopApp =
  // @ts-ignore
  typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;
export const isWebApp = !isDesktopApp;

export const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);