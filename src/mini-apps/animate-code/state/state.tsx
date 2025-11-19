import { v4 } from "uuid";
import { create, type StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware/persist";
import {
  Mode,
  PreviewResizeDirection,
  PreviewState,
  defaultProjectId,
} from "../utils/constants";
import { ThemeNames } from "../screens/components/code-editor/extensions/themes";

export type Store = {
  projects: { id: string; name: string }[];

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
  duplicateSlide: (param: string) => void;
  selectSlide: (projectId: string, index: number) => void;
  setCurrentSlideIdx: (projectId: string, index: number) => void;
};

type SliceParams = Parameters<StateCreator<Store, [], []>>;
type SliceFunc<StoreKey extends keyof Store> = (
  ...args: SliceParams
) => Pick<Store, StoreKey>;

const projectSlice: SliceFunc<"projects" | "addProject"> = immer(
  (set, get) => ({
    projects: [] as Store["projects"],
    addProject: () => {
      const prev = get().projects;
      const projectId = v4();
      const projectDetail = createProjectDetailStructure();

      set((state) => {
        state.projects.push({
          id: projectId,
          name: `Untitled ${prev.length + 1}`,
        });
        // TODO
        // state.projectDetail[projectId] = projectDetail;
      });
    },
  }),
);

const projectDetailSlice: SliceFunc<
  "projectDetail" | "duplicateSlide" | "selectSlide" | "setCurrentSlideIdx"
> = immer((set, get) => ({
  projectDetail: {
    [defaultProjectId]: createProjectDetailStructure(),
  } as Store["projectDetail"],
  // actions
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
