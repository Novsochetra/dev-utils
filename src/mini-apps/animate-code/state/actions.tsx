import { v4 } from "uuid";
import { AppState, store } from "./state";
import { atom } from "jotai";
import { Mode, PreviewResizeDirection, PreviewState } from "../utils/constants";

export const AppActions = {
  SelectSlide: (index: number) => {
    store.set(AppState.currentSlideIdx, index);
  },
  AddSlide: () => {
    const newItem = { id: v4(), data: atom("") };
    const prev = store.get(AppState.slides);
    store.set(AppState.slides, [...prev, newItem]);

    // Add Image Preview
    const imagePreviews = store.get(AppState.imagePreviews);
    store.set(AppState.imagePreviews, {
      ...imagePreviews,
      [newItem.id]: atom(""),
    });
  },
  AddSlideBelow: (index: number) => {
    const newItem = { id: v4(), data: atom("") };
    const prev = store.get(AppState.slides);
    store.set(AppState.slides, [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);

    // Add Image Preview
    const imagePreviews = store.get(AppState.imagePreviews);
    store.set(AppState.imagePreviews, {
      ...imagePreviews,
      [newItem.id]: atom(""),
    });
  },
  AddSlideAbove: (index: number) => {
    const newItem = { id: v4(), data: atom("") };
    const prev = store.get(AppState.slides);
    store.set(AppState.slides, [
      ...prev.slice(0, index),
      newItem,
      ...prev.slice(index),
    ]);

    // Add Image Preview
    const imagePreviews = store.get(AppState.imagePreviews);
    store.set(AppState.imagePreviews, {
      ...imagePreviews,
      [newItem.id]: atom(""),
    });
  },
  RemoveSlide: (index: number) => {
    const prev = store.get(AppState.slides);
    if (prev.length === 1) {
      return prev;
    }

    store.set(
      AppState.slides,
      prev.filter((_, i) => index !== i),
    );

    // Update Image Preview
    const imagePreviews = store.get(AppState.imagePreviews);
    delete imagePreviews[prev[index].id];

    store.set(AppState.imagePreviews, {
      ...imagePreviews,
    });

    // Auto select previous slide
    const currentIdx = store.get(AppState.currentSlideIdx);
    store.set(AppState.currentSlideIdx, currentIdx <= 0 ? 0 : currentIdx - 1);
  },
  ToggleSidebar: () => {
    const isOpen = store.get(AppState.sidebarOpen);
    store.set(AppState.sidebarOpen, !isOpen);
  },

  SetMode: (mode: Mode) => {
    store.set(AppState.mode, mode);
  },

  SetPreviewSize: (size: number) => {
    store.set(AppState.previewSize, size);
  },

  TogglePreviewSize: () => {
    const MIN_SIZE = 50;
    const MAX_SIZE = 100;
    const step = 10;
    const currentDirection = store.get(AppState.previewResizeDirection);

    let currentSize = store.get(AppState.previewSize);
    currentSize += step * currentDirection;

    if (currentSize === MIN_SIZE) {
      currentSize = MIN_SIZE;
      store.set(AppState.previewResizeDirection, PreviewResizeDirection.UP);
    }

    if (currentSize === MAX_SIZE) {
      currentSize = MAX_SIZE;
      store.set(AppState.previewResizeDirection, PreviewResizeDirection.DOWN);
    }

    store.set(AppState.previewSize, currentSize);
  },

  SetPreviewLanguage: (lang: string) => {
    store.set(AppState.previewLanguage, lang);
  },

  SetPreviewSlideIdx: (idx: number) => {
    store.set(AppState.previewSlideIdx, idx);
  },

  SetPreviewState: (mode: PreviewState) => {
    store.set(AppState.previewState, mode);
  },
};
