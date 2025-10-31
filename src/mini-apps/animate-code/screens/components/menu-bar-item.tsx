import { memo } from "react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { ButtonGroup } from "@/vendor/shadcn/components/ui/button-group";
import { PreviewButton } from "./preview-button";
import { ToggleSidebarButton } from "./toggle-sidebar-button";
import { AppActions } from "../../state/actions";

export const MenuBarItem = memo(() => {
  return (
    <div className="flex w-full rounded-xl mb-4">
      <div>
        <ButtonGroup>
          <ToggleSidebarButton />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              AppActions.AddSlide();
            }}
          >
            Add Slide
          </Button>
        </ButtonGroup>
      </div>

      <div className="flex flex-1 justify-center sm:gap-4 md:gap-8">
        <ShortCutsCheatSheet />
      </div>
    </div>
  );
});

export const ShortCutsCheatSheet = memo(() => {
  const shortcuts = [
    { keys: ["⌘", "Enter"], label: "Enter Preview Mode" },
    { keys: ["Esc"], label: "Exit Presentation Mode" },
    { keys: ["Space"], label: "Toggle Animation Play/Pause" },
  ];

  return (
    <>
      {shortcuts.map((shortcut, idx) => (
        <div key={idx} className="flex items-center space-x-1 text-xs">
          {shortcut.keys.map((key, i) => (
            <kbd key={i} className="px-1 py-0.5 rounded border bg-gray-100">
              {key}
            </kbd>
          ))}
          <span>{shortcut.label}</span>
        </div>
      ))}
    </>
  );
});
