import { memo } from "react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { ButtonGroup } from "@/vendor/shadcn/components/ui/button-group";
import { ToggleSidebarButton } from "./toggle-sidebar-button";
import { AppActions } from "../../state/actions";

export const MenuBarItem = memo(() => {
  return (
    <div className="flex flex-row gap-4 rounded-xl mb-4">
      <div className="flex gap-2">
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

      <ShortCutsCheatSheet />
    </div>
  );
});

export const ShortCutsCheatSheet = memo(() => {
  const shortcuts = [{ keys: ["⌘", "k"], label: "Show Command Menu" }];

  return (
    <div className="flex flex-1 items-center justify-center gap-8">
      {shortcuts.map((shortcut, idx) => (
        <div
          key={idx}
          className="flex items-center space-x-1 text-xs shrink grow-0 overflow-hidden"
        >
          {shortcut.keys.map((key, i) => (
            <kbd
              key={i}
              className="px-1 py-0.5 rounded border bg-gray-100 flex-shrink-0"
            >
              {key}
            </kbd>
          ))}
          <span className="truncate">{shortcut.label}</span>
        </div>
      ))}
    </div>
  );
});
