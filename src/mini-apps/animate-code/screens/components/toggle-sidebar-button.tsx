import { memo, useContext } from "react";
import { SidebarIcon } from "lucide-react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { AppActions } from "../../state/actions";
import { ProjectContext } from "./project-context";

export const ToggleSidebarButton = memo(() => {
  const { id: projectId } = useContext(ProjectContext);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => AppActions.ToggleSidebar(projectId)}
    >
      <SidebarIcon />
    </Button>
  );
});
