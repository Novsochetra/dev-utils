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
    if (file.size > 5 * 1024 * 1024) {
      alert("Max 5MB");
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
                <div>
                  <Label className="my-4" htmlFor="dataInput">
                    Data
                  </Label>
                  <Input
                    id="dataInput"
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
                  <Label htmlFor="img">Logo</Label>
                  <Input
                    id="img"
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                  />
                </div>
                <div className="flex flex-1 gap-4">
                  <div className="flex flex-1 flex-col">
                    <Label className="my-4" htmlFor="widthInput">
                      Width
                    </Label>
                    <Input
                      id="widthInput"
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
                  <div className="flex flex-1 flex-col">
                    <Label className="my-4" htmlFor="heightInput">
                      Height
                    </Label>
                    <Input
                      id="heightInput"
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
                  <Label className="my-4" htmlFor="marginInput">
                    Margin
                  </Label>
                  <Input
                    id="marginInput"
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
