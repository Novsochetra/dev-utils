import { v4 } from "uuid";
import { AppState, store } from "./state";
import { atom } from "jotai";
import {
  Mode,
  predefinedEditorFontSize,
  PreviewResizeDirection,
  PreviewState,
} from "../utils/constants";

export const AppActions = {
  DuplicateSlide: () => {
    const index = store.get(AppState.currentSlideIdx);
    const slides = store.get(AppState.slides);
    const currentSlideData = store.get(slides[index]?.data);

    const newItem = { id: v4(), data: atom(currentSlideData) };
    const prev = store.get(AppState.slides);
    store.set(AppState.slides, [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);

    // auto select next slide
    store.set(AppState.currentSlideIdx, index + 1);
  },

  SelectSlide: (index: number) => {
    store.set(AppState.currentSlideIdx, index);
  },

  SetCurrentSlideIdx: (index: number) => {
    store.set(AppState.currentSlideIdx, index);
  },

  AddSlide: () => {
    const newItem = { id: v4(), data: atom("") };
    const prev = store.get(AppState.slides);
    const newSlides = [...prev, newItem];
    store.set(AppState.slides, newSlides);

    // auto select last slide
    store.set(AppState.currentSlideIdx, newSlides.length - 1);
  },

  AddSlideBelow: (index: number) => {
    const newItem = { id: v4(), data: atom("") };
    const prev = store.get(AppState.slides);
    store.set(AppState.slides, [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);

    // auto select next slide
    const currentSlideIdx = store.get(AppState.currentSlideIdx);
    store.set(AppState.currentSlideIdx, currentSlideIdx + 1);
  },

  AddSlideAbove: (index: number) => {
    const newItem = { id: v4(), data: atom("") };
    const prev = store.get(AppState.slides);
    store.set(AppState.slides, [
      ...prev.slice(0, index),
      newItem,
      ...prev.slice(index),
    ]);
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

    // Auto select previous slide
    const currentIdx = store.get(AppState.currentSlideIdx);
    store.set(AppState.currentSlideIdx, currentIdx <= 0 ? 0 : currentIdx - 1);
  },

  PreviewNextSlide: () => {
    const previewSlideIdx = store.get(AppState.previewSlideIdx) ?? 0;
    const slides = store.get(AppState.slides);
    const lastIdx = slides.length - 1;

    const nextIdx = Math.min(previewSlideIdx + 1, slides.length - 1);

    if (nextIdx >= lastIdx) {
      AppActions.SetPreviewState(PreviewState.FINISH);
    } else {
      AppActions.SetPreviewState(PreviewState.PAUSE);
    }

    AppActions.SetPreviewSlideIdx(nextIdx);
  },

  PreviewPreviousSlide: () => {
    const previewSlideIdx = store.get(AppState.previewSlideIdx) ?? 0;

    if (previewSlideIdx <= 0) {
      AppActions.SetPreviewState(PreviewState.PAUSE);
      return;
    }

    AppActions.SetPreviewState(PreviewState.PAUSE);
    AppActions.SetPreviewSlideIdx(Math.max((previewSlideIdx || 0) - 1, 0));
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

  SetEditorTheme: (v: string) => {
    store.set(AppState.editorTheme, v);
  },

  SetEditorPreviewTheme: (v: string) => {
    store.set(AppState.previewEditorTheme, v);
  },

  SetEditorFontSize: (size: number) => {
    store.set(AppState.editorConfig.fontSize, size);
  },

  SetToggleEditorFontSIze: (direction: "up" | "down") => {
    const current = store.get(AppState.editorConfig.fontSize);
    const idx = predefinedEditorFontSize.findIndex((v) => v >= current);
    const nextIdx =
      direction === "up"
        ? Math.min(idx + 1, predefinedEditorFontSize.length - 1)
        : Math.max(idx - 1, 0);

    store.set(
      AppState.editorConfig.fontSize,
      predefinedEditorFontSize[nextIdx],
    );
  },
};
