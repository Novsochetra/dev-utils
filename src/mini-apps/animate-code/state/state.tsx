import { atom, getDefaultStore, type Atom, type PrimitiveAtom } from "jotai";
import { v4 } from "uuid";

import {
  defaultSlides,
  Mode,
  PreviewResizeDirection,
  PreviewState,
} from "../utils/constants";

export const store = getDefaultStore();

export type AppState = {
  projects: PrimitiveAtom<string[]>;
  sidebarOpen: PrimitiveAtom<boolean>;
  currentSlideIdx: PrimitiveAtom<number>;
  previewSlideIdx: PrimitiveAtom<number | undefined>;
  mode: PrimitiveAtom<Mode>;
  previewState: PrimitiveAtom<PreviewState>;
  slides: PrimitiveAtom<{ id: string; data: Atom<string> }[]>;
  editorTheme: PrimitiveAtom<string>;
  previewEditorTheme: PrimitiveAtom<string>;
  previewSize: PrimitiveAtom<number>;
  previewTitle: PrimitiveAtom<string>;
  previewBackground: {
    angle: PrimitiveAtom<number>;
    from: PrimitiveAtom<string>;
    to: PrimitiveAtom<string>;
  };
  previewResizeDirection: PrimitiveAtom<PreviewResizeDirection>;
  previewLanguage: PrimitiveAtom<string>;
};

export const fallbackAtom = atom();

const defaultProjectId = v4();

export const AppState: AppState = {
  projects: atom([defaultProjectId]),
  sidebarOpen: atom(true),
  currentSlideIdx: atom(0),
  previewSlideIdx: atom(), // INFO: why undefined value ? since we need to since the currentSlideIdx with previewSlideIdx on <Preview />
  mode: atom<Mode>(Mode.Edit),
  previewState: atom<PreviewState>(PreviewState.IDLE),
  editorTheme: atom("atom-one-light"),
  previewEditorTheme: atom(""),
  slides: atom<Array<{ id: string; data: Atom<string> }>>(defaultSlides),
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
  previewLanguage: atom("javascript"),
};

export const slideIdsAtom = atom((get) =>
  get(AppState.slides).map((s) => s.id),
);

export const slideLengthAtom = atom((get) => get(AppState.slides).length);
