import { atom, getDefaultStore, type Atom, type PrimitiveAtom } from "jotai";

import {
  defaultProjectId,
  Mode,
  PreviewResizeDirection,
  PreviewState,
} from "../utils/constants";
import { ThemeNames } from "../screens/components/code-editor/extensions/themes";
import { v4 } from "uuid";

export const store = getDefaultStore();

export type AppState = {
  projects: PrimitiveAtom<Array<{ id: string; name: PrimitiveAtom<string> }>>;
  projectDetail: {
    [k: string]: {
      sidebarOpen: PrimitiveAtom<boolean>;
      currentSlideIdx: PrimitiveAtom<number>;
      previewSlideIdx: PrimitiveAtom<number | undefined>;
      mode: PrimitiveAtom<Mode>;
      previewState: PrimitiveAtom<PreviewState>;
      slides: PrimitiveAtom<
        {
          id: string;
          data: Atom<string>;
          preview: Atom<boolean>;
        }[]
      >;
      editorTheme: PrimitiveAtom<ThemeNames>;
      previewEditorTheme: PrimitiveAtom<ThemeNames | null>;
      previewSize: PrimitiveAtom<number>;
      previewTitle: PrimitiveAtom<string>;
      previewBackground: {
        angle: PrimitiveAtom<number>;
        from: PrimitiveAtom<string>;
        to: PrimitiveAtom<string>;
      };
      previewResizeDirection: PrimitiveAtom<PreviewResizeDirection>;
      previewLanguage: PrimitiveAtom<string>;
      editorConfig: {
        fontSize: PrimitiveAtom<number>;
        animationConfig: {
          removeDuration: PrimitiveAtom<number>;
          addDuration: PrimitiveAtom<number>;
          addedDelayPerChar: PrimitiveAtom<number>;
          lineDelay: PrimitiveAtom<number>;
        };
      };
    };
  };
};

export const fallbackAtom = atom();

const defaultProjectDetail = createProjectDetailAtom();

export const AppState: AppState = {
  projects: atom<{ id: string; name: PrimitiveAtom<string> }[]>([
    { id: defaultProjectId, name: atom("Untitled 1") },
  ]),
  projectDetail: {
    [defaultProjectId]: defaultProjectDetail,
  },
};

export function createProjectDetailAtom(): any {
  return {
    sidebarOpen: atom(true),
    currentSlideIdx: atom(0),
    previewSlideIdx: atom(), // INFO: why undefined value ? since we need to since the currentSlideIdx with previewSlideIdx on <Preview />
    mode: atom<Mode>(Mode.Edit),
    previewState: atom<PreviewState>(PreviewState.IDLE),
    editorTheme: atom(ThemeNames.GruvboxDark),
    previewEditorTheme: atom<ThemeNames | null>(null),
    slides: atom<
      Array<{ id: string; data: Atom<string>; preview: Atom<boolean> }>
    >([
      {
        id: v4(),
        data: atom(""),
        preview: atom(false),
      },
    ]),
    previewSize: atom(100), // percentage
    previewTitle: atom("index.html"),
    previewResizeDirection: atom<PreviewResizeDirection>(
      PreviewResizeDirection.DOWN,
    ),
    previewBackground: {
      angle: atom(135),
      from: atom("#93c5fd"),
      to: atom("#c4b5fd"),
    },
    previewLanguage: atom("html"),
    editorConfig: {
      fontSize: atom(16),
      animationConfig: {
        removeDuration: atom(0.8),
        addDuration: atom(1),
        addedDelayPerChar: atom(0.08),
        lineDelay: atom(0.05),
      },
    },
  };
}
