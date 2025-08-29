import { useContext, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/vendor/shadcn/components/ui/collapsible";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Checkbox } from "@/vendor/shadcn/components/ui/checkbox";
import { Label } from "@/vendor/shadcn/components/ui/label";

import { defaultImageSize } from "../utils/constants";
import { QRCodeContext } from "./qr-code-context";

export const ImageOptionsView = () => {
  const { options, setOptions } = useContext(QRCodeContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="my-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-1 items-center justify-between">
            <Label className="text-md font-bold">Image Options</Label>
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
                <div className="flex flex-1 gap-4">
                  <div className="flex flex-1 flex-col gap-4 my-4">
                    <Label htmlFor="image-options-image-size-input">
                      Image Size
                    </Label>
                    <Input
                      id="image-options-image-size-input"
                      type="number"
                      value={options.imageOptions?.imageSize}
                      step={0.1}
                      onChange={(e) => {
                        let value = defaultImageSize?.imageSize;
                        if (!Number.isNaN(e.target.value)) {
                          value = Number(e.target.value);
                        }
                        setOptions((prev) => ({
                          ...prev,
                          imageOptions: {
                            ...prev.imageOptions,
                            imageSize: value,
                          },
                        }));
                      }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 my-4">
                    <Label htmlFor="image-options-margin-input">Margin</Label>
                    <Input
                      id="image-options-margin-input"
                      type="number"
                      value={options.imageOptions?.margin}
                      onChange={(e) => {
                        let value = defaultImageSize?.margin;
                        if (!Number.isNaN(e.target.value)) {
                          value = Number(e.target.value);
                        }
                        setOptions((prev) => ({
                          ...prev,
                          imageOptions: {
                            ...prev.imageOptions,
                            margin: value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-1">
                  <Checkbox
                    id="image-options-hide-background-checkbox"
                    defaultChecked={options.imageOptions?.hideBackgroundDots}
                    onCheckedChange={(value: boolean) => {
                      setOptions((prev) => ({
                        ...prev,
                        imageOptions: {
                          ...prev.imageOptions,
                          hideBackgroundDots: value,
                        },
                      }));
                    }}
                  />
                  <Label
                    htmlFor="image-options-hide-background-checkbox"
                    className="ml-4"
                  >
                    Hide Background Dots
                  </Label>
                </div>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </div>
  );
};
