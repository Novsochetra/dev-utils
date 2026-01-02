import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { APP_NAME } from "@/mini-apps/diff-checker/utils/constant";

export const DiffCheckerLeftToolbar = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-1 px-2 min-w-0 items-center gap-2"
      data-tauri-drag-region
    >
      <Button
        tabIndex={-1}
        data-tauri-drag-region={false}
        size="sm"
        variant="ghost"
        onClick={() => {
          navigate("/");
        }}
      >
        <ChevronLeft />
      </Button>

      <p className="w-full truncate text-sm text-foreground">
        {APP_NAME}
      </p>
    </div>
  );
};
