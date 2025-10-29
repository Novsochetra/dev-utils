import { memo } from "react";
import { SidebarIcon } from "lucide-react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { AppActions } from "../../state/actions";

export const ToggleSidebarButton = memo(() => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => AppActions.ToggleSidebar()}
    >
      <SidebarIcon />
    </Button>
  );
});
