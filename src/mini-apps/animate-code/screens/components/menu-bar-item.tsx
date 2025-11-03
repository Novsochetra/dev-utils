import { memo } from "react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { ButtonGroup } from "@/vendor/shadcn/components/ui/button-group";
import { ToggleSidebarButton } from "./toggle-sidebar-button";
import { AppActions } from "../../state/actions";
import { ShortCuts } from "./shortcuts";

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
        <ShortCuts
          key={`cheat-sheat-${idx}`}
          keys={shortcut.keys}
          label={shortcut.label}
        />
      ))}
    </div>
  );
});
