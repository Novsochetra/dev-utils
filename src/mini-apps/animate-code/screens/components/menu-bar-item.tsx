import { memo, useContext } from "react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { ButtonGroup } from "@/vendor/shadcn/components/ui/button-group";
import { ToggleSidebarButton } from "./toggle-sidebar-button";
import { AppActions } from "../../state/actions";
import { ShortCuts } from "./shortcuts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/vendor/shadcn/components/ui/tooltip";
import { AppState, fallbackAtom, store } from "../../state/state";
import { useAtom, useAtomValue, type PrimitiveAtom } from "jotai";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { ProjectContext } from "./project-context";

export const MenuBarItem = memo(() => {
  return (
    <div className="flex flex-row gap-4 rounded-xl mb-4">
      <div className="flex gap-2">
        <ButtonGroup>
          <ToggleSidebarButton />
          <AddSlideButton />
        </ButtonGroup>
      </div>

      <ShortCutsCheatSheet />
      <BrowserButtonPreview />
    </div>
  );
});

export const BrowserButtonPreview = memo(() => {
  const { id: projectId } = useContext(ProjectContext);
  const currentSlideIdx = useAtomValue(
    AppState.projectDetail[projectId].currentSlideIdx,
  );
  const slides = store.get(AppState.projectDetail[projectId].slides);
  const [includePreview, setPreview] = useAtom(
    (slides[currentSlideIdx]?.preview ||
      fallbackAtom) as PrimitiveAtom<boolean>,
  );

  return (
    <Button variant="ghost" onClick={() => setPreview((prev) => !prev)}>
      {includePreview ? <EyeClosedIcon size={16} /> : <EyeIcon size={16} />}
    </Button>
  );
});

export const AddSlideButton = memo(() => {
  const { id: projectId } = useContext(ProjectContext);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            AppActions.AddSlide(projectId);
          }}
        >
          Add Slide
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center">
          <span className="mr-4">Add Slide</span>

          <ShortCuts keys={["⌘", "option", "n"]} className="text-zinc-800" />
        </div>
      </TooltipContent>
    </Tooltip>
  );
});

export const ShortCutsCheatSheet = memo(() => {
  const shortcuts = [{ keys: ["⌘", "k"], label: "Show Command Menu" }];

  return (
    <div className="flex flex-1 items-center justify-center gap-8">
      {shortcuts.map((shortcut, idx) => (
        <ShortCuts
          key={`cheat-sheat-${idx}`}
          keys={shortcut.keys}
          label={shortcut.label}
        />
      ))}
    </div>
  );
});
