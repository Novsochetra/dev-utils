import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/vendor/shadcn/components/ui/select";

export const DownloadSelectOptions = ({
  onValueChange,
}: {
  onValueChange: (v: "png" | "svg") => void;
}) => {
  return (
    <Select defaultValue={"png"} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="png | svg" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"png"}>PNG</SelectItem>
        <SelectItem value={"svg"}>SVG</SelectItem>
      </SelectContent>
    </Select>
  );
};
