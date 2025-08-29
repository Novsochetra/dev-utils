import { useContext, useState } from "react";
import { QRCodeContext } from "./qr-code-context";
import { AnimatePresence, motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/vendor/shadcn/components/ui/collapsible";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { fileToDataURL } from "../utils/file-data-to-url";
import { ChevronRightIcon } from "lucide-react";
import { ALLOW_MAX_LOGO_UPLOAD_SIZE_IN_BYTES } from "../utils/constants";
import { bytesToMB } from "../utils/bytes-to-mb";

export const MainOptionsView = () => {
  const { setOptions, options } = useContext(QRCodeContext);
  const [open, setOpen] = useState(true);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // simple validation (optional)
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    if (file.size > ALLOW_MAX_LOGO_UPLOAD_SIZE_IN_BYTES) {
      alert(`Max ${bytesToMB(ALLOW_MAX_LOGO_UPLOAD_SIZE_IN_BYTES)}`);
      return;
    }

    const url = await fileToDataURL(file);
    setOptions((prev) => ({
      ...prev,
      image: url,
    }));
  }

  return (
    <div className="">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-1 justify-between">
            <Label className="text-md font-bold">Main Options</Label>
            <ChevronRightIcon
              className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}
            />
          </div>
        </CollapsibleTrigger>

        <AnimatePresence initial={false}>
          {open && (
            <CollapsibleContent asChild forceMount>
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <div className="flex flex-1 flex-col my-4 gap-4">
                  <Label className="" htmlFor="main-options-data-input">
                    Data
                  </Label>
                  <Input
                    id="main-options-data-input"
                    value={options.data}
                    onChange={(e) => {
                      setOptions((prev) => ({
                        ...prev,
                        data: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col my-2 gap-4">
                  <Label htmlFor="main-options-qr-logo-file-input">Logo</Label>
                  <Input
                    id="main-options-qr-logo-file-input"
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                  />
                  <p className="text-muted-foreground text-sm">
                    Max: {bytesToMB(ALLOW_MAX_LOGO_UPLOAD_SIZE_IN_BYTES)}
                  </p>
                </div>
                <div className="flex flex-1 my-4 gap-4">
                  <div className="flex flex-1 flex-col gap-4">
                    <Label htmlFor="main-options-width-input">Width</Label>
                    <Input
                      id="main-options-width-input"
                      type="number"
                      value={options?.width}
                      onChange={(e) => {
                        let value: number = 0;
                        if (Number.isNaN(e.target.value)) {
                          value = 200;
                        } else {
                          value = parseInt(e.target.value);
                        }
                        setOptions((prev) => ({
                          ...prev,
                          width: value,
                        }));
                      }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <Label htmlFor="main-options-height-input">Height</Label>
                    <Input
                      id="main-options-height-input"
                      type="number"
                      value={options.height}
                      onChange={(e) => {
                        let value: number = 0;
                        if (Number.isNaN(e.target.value)) {
                          value = 200;
                        } else {
                          value = parseInt(e.target.value);
                        }
                        setOptions((prev) => ({
                          ...prev,
                          height: value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label className="my-4" htmlFor="main-options-margin-input">
                    Margin
                  </Label>
                  <Input
                    id="main-options-margin-input"
                    type="number"
                    min={0}
                    value={options.margin || 0}
                    onChange={(e) => {
                      let value: number = 0;
                      if (Number.isNaN(e.target.value)) {
                        value = 200;
                      } else {
                        value = parseInt(e.target.value);
                      }
                      setOptions((prev) => ({
                        ...prev,
                        margin: value,
                      }));
                    }}
                  />
                </div>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </div>
  );
};
