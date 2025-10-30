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
  mode: PrimitiveAtom<Mode>;
  previewState: PrimitiveAtom<PreviewState>;
  imagePreviews: PrimitiveAtom<Record<string, PrimitiveAtom<string>>>;
  slides: PrimitiveAtom<{ id: string; data: Atom<string> }[]>;
  previewSize: PrimitiveAtom<number>;
  previewTitle: PrimitiveAtom<string>;
  previewResizeDirection: PrimitiveAtom<PreviewResizeDirection>;
  previewLanguage: PrimitiveAtom<string>;
};

export const fallbackAtom = atom();

const defaultProjectId = v4();

export const AppState: AppState = {
  projects: atom([defaultProjectId]),
  sidebarOpen: atom(true),
  currentSlideIdx: atom(0),
  mode: atom<Mode>(Mode.Edit),
  previewState: atom<PreviewState>(PreviewState.IDLE),
  imagePreviews: keyByAtom(defaultSlides),
  slides: atom<Array<{ id: string; data: Atom<string> }>>(defaultSlides),
  previewSize: atom(100), // percentage
  previewTitle: atom("index.html"),
  previewResizeDirection: atom<PreviewResizeDirection>(
    PreviewResizeDirection.DOWN,
  ),
  previewLanguage: atom("javascript"),
};

export const slideIdsAtom = atom((get) =>
  get(AppState.slides).map((s) => s.id),
);

function keyByAtom(arr: any[]) {
  const res = atom({});
  arr.forEach((slide) => {
    const previews = store.get(res) as Record<string, PrimitiveAtom<string>>;
    let imageAtom = previews[slide.id];

    if (!imageAtom) {
      imageAtom = atom(""); // create atom with initial value
      store.set(res, { ...previews, [slide.id]: imageAtom });
    } else {
      store.set(imageAtom, ""); // update existing atom
    }
  });

  return res;
}
