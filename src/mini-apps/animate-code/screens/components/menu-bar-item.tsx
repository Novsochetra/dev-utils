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

      <div className="flex flex-1 justify-center">
        <PreviewButton />
      </div>
    </div>
  );
});
