import { memo, useContext } from "react";
import { SidebarIcon } from "lucide-react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { ProjectContext } from "./project-context";
import { useStore } from "../../state/state";

export const ToggleSidebarButton = memo(() => {
  const { id: projectId } = useContext(ProjectContext);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  return (
    <Button
      tabIndex={-1}
      variant="outline"
      size="sm"
      onClick={() => toggleSidebar(projectId)}
    >
      <SidebarIcon />
    </Button>
  );
});
