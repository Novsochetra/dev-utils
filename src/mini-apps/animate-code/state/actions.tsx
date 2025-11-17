import { v4 } from "uuid";
import { AppState, createProjectDetailAtom, store } from "./state";
import { atom } from "jotai";
import {
  Mode,
  predefinedEditorFontSize,
  PreviewResizeDirection,
  PreviewState,
} from "../utils/constants";
import type { ThemeNames } from "../screens/components/code-editor/extensions/themes";

export const AppActions = {
  AddProject: () => {
    const prev = store.get(AppState.projects);
    const projectId = v4();
    const projectDetailAtom = createProjectDetailAtom();
    AppState.projectDetail[projectId] = projectDetailAtom;
    store.set(AppState.projects, [
      ...prev,
      { id: projectId, name: atom(`Untitled ${prev.length + 1}`) },
    ]);
  },

  DuplicateSlide: (projectId: string) => {
    const index = store.get(AppState.projectDetail[projectId].currentSlideIdx);
    const slides = store.get(AppState.projectDetail[projectId].slides);
    const currentSlideData = store.get(slides[index]?.data);

    const newItem = {
      id: v4(),
      data: atom(currentSlideData),
      preview: atom(false),
    };
    const prev = store.get(AppState.projectDetail[projectId].slides);
    store.set(AppState.projectDetail[projectId].slides, [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);

    // auto select next slide
    store.set(AppState.projectDetail[projectId].currentSlideIdx, index + 1);
  },

  SelectSlide: (projectId: string, index: number) => {
    store.set(AppState.projectDetail[projectId].currentSlideIdx, index);
  },

  SetCurrentSlideIdx: (projectId: string, index: number) => {
    store.set(AppState.projectDetail[projectId].currentSlideIdx, index);
  },

  AddSlide: (projectId: string) => {
    const newItem = {
      id: v4(),
      data: atom(""),
      preview: atom(false),
      projectId: projectId,
    };
    const prev = store.get(AppState.projectDetail[projectId].slides);
    const newSlides = [...prev, newItem];
    store.set(AppState.projectDetail[projectId].slides, newSlides);

    // auto select last slide
    store.set(
      AppState.projectDetail[projectId].currentSlideIdx,
      newSlides.length - 1,
    );
  },

  AddSlideBelow: (projectId: string, index: number) => {
    const newItem = {
      id: v4(),
      data: atom(""),
      preview: atom(false),
      projectId,
    };
    const prev = store.get(AppState.projectDetail[projectId].slides);
    store.set(AppState.projectDetail[projectId].slides, [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);

    // auto select next slide
    const currentSlideIdx = store.get(
      AppState.projectDetail[projectId].currentSlideIdx,
    );
    store.set(
      AppState.projectDetail[projectId].currentSlideIdx,
      currentSlideIdx + 1,
    );
  },

  AddSlideAbove: (projectId: string, index: number) => {
    const newItem = {
      id: v4(),
      data: atom(""),
      preview: atom(false),
      projectId,
    };
    const prev = store.get(AppState.projectDetail[projectId].slides);
    store.set(AppState.projectDetail[projectId].slides, [
      ...prev.slice(0, index),
      newItem,
      ...prev.slice(index),
    ]);
  },

  RemoveSlide: (projectId: string, index: number) => {
    const prev = store.get(AppState.projectDetail[projectId].slides);
    if (prev.length === 1) {
      return prev;
    }

    store.set(
      AppState.projectDetail[projectId].slides,
      prev.filter((_, i) => index !== i),
    );

    // Auto select previous slide
    const currentIdx = store.get(
      AppState.projectDetail[projectId].currentSlideIdx,
    );
    store.set(
      AppState.projectDetail[projectId].currentSlideIdx,
      currentIdx <= 0 ? 0 : currentIdx - 1,
    );
  },

  PreviewNextSlide: (projectId: string) => {
    const previewSlideIdx =
      store.get(AppState.projectDetail[projectId].previewSlideIdx) ?? 0;
    const slides = store.get(AppState.projectDetail[projectId].slides);
    const lastIdx = slides.length - 1;

    const nextIdx = Math.min(previewSlideIdx + 1, slides.length - 1);

    if (nextIdx >= lastIdx) {
      AppActions.SetPreviewState(projectId, PreviewState.FINISH);
    } else {
      AppActions.SetPreviewState(projectId, PreviewState.PAUSE);
    }

    AppActions.SetPreviewSlideIdx(projectId, nextIdx);
  },

  PreviewPreviousSlide: (projectId: string) => {
    const previewSlideIdx =
      store.get(AppState.projectDetail[projectId].previewSlideIdx) ?? 0;

    if (previewSlideIdx <= 0) {
      AppActions.SetPreviewState(projectId, PreviewState.PAUSE);
      return;
    }

    AppActions.SetPreviewState(projectId, PreviewState.PAUSE);
    AppActions.SetPreviewSlideIdx(
      projectId,
      Math.max((previewSlideIdx || 0) - 1, 0),
    );
  },

  ToggleSidebar: (projectId: string) => {
    const isOpen = store.get(AppState.projectDetail[projectId].sidebarOpen);
    store.set(AppState.projectDetail[projectId].sidebarOpen, !isOpen);
  },

  SetMode: (projectId: string, mode: Mode) => {
    store.set(AppState.projectDetail[projectId].mode, mode);
  },

  SetPreviewSize: (projectId: string, size: number) => {
    store.set(AppState.projectDetail[projectId].previewSize, size);
  },

  TogglePreviewSize: (projectId: string) => {
    const MIN_SIZE = 50;
    const MAX_SIZE = 100;
    const step = 10;
    const currentDirection = store.get(
      AppState.projectDetail[projectId].previewResizeDirection,
    );

    let currentSize = store.get(AppState.projectDetail[projectId].previewSize);
    currentSize += step * currentDirection;

    if (currentSize === MIN_SIZE) {
      currentSize = MIN_SIZE;
      store.set(
        AppState.projectDetail[projectId].previewResizeDirection,
        PreviewResizeDirection.UP,
      );
    }

    if (currentSize === MAX_SIZE) {
      currentSize = MAX_SIZE;
      store.set(
        AppState.projectDetail[projectId].previewResizeDirection,
        PreviewResizeDirection.DOWN,
      );
    }

    store.set(AppState.projectDetail[projectId].previewSize, currentSize);
  },

  SetPreviewLanguage: (projectId: string, lang: string) => {
    store.set(AppState.projectDetail[projectId].previewLanguage, lang);
  },

  SetPreviewSlideIdx: (projectId: string, idx: number) => {
    store.set(AppState.projectDetail[projectId].previewSlideIdx, idx);
  },

  SetPreviewState: (projectId: string, mode: PreviewState) => {
    store.set(AppState.projectDetail[projectId].previewState, mode);
  },

  SetEditorTheme: (projectId: string, v: ThemeNames) => {
    store.set(AppState.projectDetail[projectId].editorTheme, v);
  },

  SetEditorPreviewTheme: (projectId: string, v: ThemeNames | null) => {
    store.set(AppState.projectDetail[projectId].previewEditorTheme, v);
  },

  SetEditorFontSize: (projectId: string, size: number) => {
    store.set(AppState.projectDetail[projectId].editorConfig.fontSize, size);
  },

  SetToggleEditorFontSIze: (projectId: string, direction: "up" | "down") => {
    const current = store.get(
      AppState.projectDetail[projectId].editorConfig.fontSize,
    );
    const idx = predefinedEditorFontSize.findIndex((v) => v >= current);
    const nextIdx =
      direction === "up"
        ? Math.min(idx + 1, predefinedEditorFontSize.length - 1)
        : Math.max(idx - 1, 0);

    store.set(
      AppState.projectDetail[projectId].editorConfig.fontSize,
      predefinedEditorFontSize[nextIdx],
    );
  },
};
