import { v4 } from "uuid";
import { create, type StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  Mode,
  PreviewResizeDirection,
  PreviewState,
  defaultProjectId,
} from "../utils/constants";
import { ThemeNames } from "../screens/components/code-editor/extensions/themes";

export type Store = {
  projects: { id: string; name: string }[];
  getProjects: () => Store["projects"];
  setProjectName: (index: number, name: string) => void;

  projectDetail: {
    [k: string]: {
      sidebarOpen: boolean;
      currentSlideIdx: number;
      previewSlideIdx: number | undefined;
      mode: Mode;
      previewState: PreviewState;
      slides: {
        id: string;
        data: string;
        preview: boolean;
      }[];
      editorTheme: ThemeNames;
      previewEditorTheme: ThemeNames | null;
      previewSize: number;
      previewTitle: string;
      previewBackground: {
        angle: number;
        from: string;
        to: string;
      };
      previewResizeDirection: PreviewResizeDirection;
      previewLanguage: string;
      editorConfig: {
        fontSize: number;
        animationConfig: {
          removeDuration: number;
          addDuration: number;
          addedDelayPerChar: number;
          lineDelay: number;
        };
      };
    };
  };

  // actions
  addProject: () => void;
  addProjectDetail: (projectId: string) => void;
  duplicateSlide: (param: string) => void;
  selectSlide: (projectId: string, index: number) => void;
  setCurrentSlideIdx: (projectId: string, index: number) => void;
  addSlide: (projectId: string) => void;
  addSlideBelow: (projectId: string, index: number) => void;
  addSlideAbove: (projectId: string, index: number) => void;
  removeSlide: (projectId: string, index: number) => void;
  previewNextSlide: (projectId: string) => void;
  previewPreviousSlide: (projectId: string) => void;
  toggleSidebar: (projectId: string) => void;
  setMode: (projectId: string, mode: Mode) => void;
  setPreviewSize: (projectId: string, size: number) => void;
  togglePreviewSize: (projectId: string) => void;
  setPreviewLanguage: (projectId: string, lang: string) => void;
  setPreviewSlideIdx: (projectId: string, idx: number) => void;
  setPreviewState: (projectId: string, mode: PreviewState) => void;
  setEditorTheme: (projectId: string, v: ThemeNames) => void;
  setEditorPreviewTheme: (projectId: string, v: ThemeNames | null) => void;
  setEditorFontSize: (projectId: string, size: number) => void;
};

type StateCreatorParams = Parameters<StateCreator<Store, [], []>>;
type SliceParams = [
  StateCreatorParams[0], // Set type
  () => Store, // get -> full store
  ...(StateCreatorParams extends [
    StateCreatorParams[0],
    StateCreatorParams[1],
    ...infer Rest,
  ]
    ? Rest
    : []), // preserve rest
];
type SliceFunc<StoreKey extends keyof Store> = (
  ...args: SliceParams
) => Pick<Store, StoreKey>;

const projectSlice: (
  ...args: SliceParams
) => Pick<Store, "projects" | "getProjects" | "setProjectName" | "addProject"> =
  immer((set, get) => ({
    projects: [] as Store["projects"],
    getProjects: () => get().projects,
    setProjectName: (index: number, name: string) => {
      set((state) => {
        state.projects[index].name = name;
      });
    },
    addProject: () => {
      const prev = get().projects;
      const projectId = v4();

      set((state) => {
        state.projects.push({
          id: projectId,
          name: `Untitled ${prev.length + 1}`,
        });
      });

      // TODO
      // get().addProjectDetail(projectId);
    },
  }));

const projectDetailSlice: SliceFunc<
  | "projectDetail"
  | "addProjectDetail"
  | "duplicateSlide"
  | "selectSlide"
  | "setCurrentSlideIdx"
  | "addSlide"
  | "addSlideBelow"
  | "addSlideAbove"
  | "removeSlide"
  | "previewNextSlide"
  | "previewPreviousSlide"
  | "toggleSidebar"
  | "setMode"
  | "setPreviewSize"
  | "togglePreviewSize"
  | "setPreviewLanguage"
  | "setPreviewSlideIdx"
  | "setPreviewState"
  | "setEditorTheme"
  | "setEditorPreviewTheme"
  | "setEditorFontSize"
> = immer((set, get) => ({
  projectDetail: {
    [defaultProjectId]: createProjectDetailStructure(),
  } as Store["projectDetail"],

  // actions
  addProjectDetail: (projectId: string) => {
    set((state) => {
      state.projectDetail[projectId] = createProjectDetailStructure();
    });
  },

  duplicateSlide: (projectId: string) => {
    const index = get().projectDetail[projectId].currentSlideIdx;
    const slides = get().projectDetail[projectId].slides;
    const currentSlideData = slides[index]?.data;

    const newItem = {
      id: v4(),
      data: currentSlideData,
      preview: false,
    };
    const prev = get().projectDetail[projectId].slides;
    set((state) => {
      state.projectDetail[projectId].slides = [
        ...prev.slice(0, index + 1),
        newItem,
        ...prev.slice(index + 1),
      ];

      // auto select next slide
      state.projectDetail[projectId].currentSlideIdx = index + 1;
    });
  },

  selectSlide: (projectId: string, index: number) => {
    set((state) => {
      state.projectDetail[projectId].currentSlideIdx = index;
    });
  },

  setCurrentSlideIdx: (projectId: string, index: number) => {
    set((state) => {
      state.projectDetail[projectId].currentSlideIdx = index;
    });
  },

  addSlide: (projectId: string) => {
    const newItem = {
      id: v4(),
      data: "",
      preview: false,
      projectId: projectId,
    };
    const prev = get().projectDetail[projectId].slides;
    const newSlides = [...prev, newItem];

    set((state) => {
      state.projectDetail[projectId].slides.push(newItem);
      // auto select last slide
      state.projectDetail[projectId].currentSlideIdx = newSlides.length - 1;
    });
  },

  addSlideBelow: (projectId: string, index: number) => {
    const newItem = {
      id: v4(),
      data: "",
      preview: false,
      projectId,
    };
    const prev = get().projectDetail[projectId].slides;
    set((state) => {
      state.projectDetail[projectId].slides = [
        ...prev.slice(0, index + 1),
        newItem,
        ...prev.slice(index + 1),
      ];

      // auto select next slide
      state.projectDetail[projectId].currentSlideIdx =
        get().projectDetail[projectId].currentSlideIdx + 1;
    });
  },

  addSlideAbove: (projectId: string, index: number) => {
    const newItem = {
      id: v4(),
      data: "",
      preview: false,
      projectId,
    };

    const prev = get().projectDetail[projectId].slides;
    set((state) => {
      state.projectDetail[projectId].slides = [
        ...prev.slice(0, index),
        newItem,
        ...prev.slice(index),
      ];
    });
  },

  removeSlide: (projectId: string, index: number) => {
    const prev = get().projectDetail[projectId].slides;

    if (prev.length === 1) {
      return prev;
    }

    set((state) => {
      state.projectDetail[projectId].slides = prev.filter(
        (_, i) => index !== i,
      );
    });

    // Auto select previous slide
    const currentIdx = get().projectDetail[projectId].currentSlideIdx;
    set((state) => {
      state.projectDetail[projectId].currentSlideIdx =
        currentIdx <= 0 ? 0 : currentIdx - 1;
    });
  },

  previewNextSlide: (projectId: string) => {
    const previewSlideIdx = get().projectDetail[projectId].previewSlideIdx ?? 0;
    const slides = get().projectDetail[projectId].slides;
    const lastIdx = slides.length - 1;

    const nextIdx = Math.min(previewSlideIdx + 1, slides.length - 1);

    if (nextIdx >= lastIdx) {
      get().setPreviewState(projectId, PreviewState.FINISH);
    } else {
      get().setPreviewState(projectId, PreviewState.PAUSE);
    }

    get().setPreviewSlideIdx(projectId, nextIdx);
  },

  previewPreviousSlide: (projectId: string) => {
    const previewSlideIdx = get().projectDetail[projectId].previewSlideIdx ?? 0;

    if (previewSlideIdx <= 0) {
      get().setPreviewState(projectId, PreviewState.PAUSE);
      return;
    }

    get().setPreviewState(projectId, PreviewState.PAUSE);
    get().setPreviewSlideIdx(
      projectId,
      Math.max((previewSlideIdx || 0) - 1, 0),
    );
  },

  toggleSidebar: (projectId: string) => {
    const isOpen = get().projectDetail[projectId].sidebarOpen;
    set((state) => {
      state.projectDetail[projectId].sidebarOpen = !isOpen;
    });
  },

  setMode: (projectId: string, mode: Mode) => {
    set((state) => {
      state.projectDetail[projectId].mode = mode;
    });
  },

  setPreviewSize: (projectId: string, size: number) => {
    set((state) => (state.projectDetail[projectId].previewSize = size));
  },

  togglePreviewSize: (projectId: string) => {
    const MIN_SIZE = 50;
    const MAX_SIZE = 100;
    const step = 10;
    const currentDirection =
      get().projectDetail[projectId].previewResizeDirection;

    let currentSize = get().projectDetail[projectId].previewSize;
    currentSize += step * currentDirection;

    if (currentSize === MIN_SIZE) {
      currentSize = MIN_SIZE;
      set((state) => {
        state.projectDetail[projectId].previewResizeDirection =
          PreviewResizeDirection.UP;
      });
    }

    if (currentSize === MAX_SIZE) {
      currentSize = MAX_SIZE;
      set((state) => {
        state.projectDetail[projectId].previewResizeDirection =
          PreviewResizeDirection.DOWN;
      });
    }

    set((state) => {
      state.projectDetail[projectId].previewSize = currentSize;
    });
  },

  setPreviewLanguage: (projectId: string, lang: string) => {
    set((state) => (state.projectDetail[projectId].previewLanguage = lang));
  },

  setPreviewSlideIdx: (projectId: string, idx: number) => {
    set((state) => (state.projectDetail[projectId].previewSlideIdx = idx));
  },

  setPreviewState: (projectId: string, mode: PreviewState) => {
    set((state) => (state.projectDetail[projectId].previewState = mode));
  },

  setEditorTheme: (projectId: string, v: ThemeNames) => {
    set((state) => (state.projectDetail[projectId].editorTheme = v));
  },

  setEditorPreviewTheme: (projectId: string, v: ThemeNames | null) => {
    set((state) => (state.projectDetail[projectId].previewEditorTheme = v));
  },

  setEditorFontSize: (projectId: string, size: number) => {
    set(
      (state) => (state.projectDetail[projectId].editorConfig.fontSize = size),
    );
  },
}));

export const useStore = create<Store>()((...args) => ({
  ...projectSlice(...args),
  ...projectDetailSlice(...args),
}));

function createProjectDetailStructure() {
  return {
    sidebarOpen: true,
    currentSlideIdx: 0,
    previewSlideIdx: undefined, // INFO: why undefined value ? since we need to since the currentSlideIdx with previewSlideIdx on <Preview />
    mode: Mode.Edit,
    previewState: PreviewState.IDLE,
    editorTheme: ThemeNames.GruvboxDark,
    previewEditorTheme: null,
    slides: [
      {
        id: v4(),
        data: "",
        preview: false,
      },
    ],
    previewSize: 100, // percentage
    previewTitle: "index.html",
    previewResizeDirection: PreviewResizeDirection.DOWN,
    previewBackground: {
      angle: 135,
      from: "#93c5fd",
      to: "#c4b5fd",
    },
    previewLanguage: "html",
    editorConfig: {
      fontSize: 16,
      animationConfig: {
        removeDuration: 0.8,
        addDuration: 1,
        addedDelayPerChar: 0.08,
        lineDelay: 0.05,
      },
    },
  };
}
