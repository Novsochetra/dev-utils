import { Button } from "@/vendor/shadcn/components/ui/button";
import { DownloadIcon } from "lucide-react";

export const DownloadButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button className="self-center" onClick={onClick}>
      Download <DownloadIcon size={12} />
    </Button>
  );
};
