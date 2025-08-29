import { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import type { ErrorCorrectionLevel, Mode, TypeNumber } from "qr-code-styling";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/vendor/shadcn/components/ui/collapsible";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/vendor/shadcn/components/ui/select";
import { QRCodeContext } from "./qr-code-context";

export const QROptionsView = () => {
  const { options, setOptions } = useContext(QRCodeContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="my-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-1 items-center justify-between">
            <Label className="text-md font-bold">QR Options</Label>
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
                <div className="flex flex-1 flex-col gap-4 my-4">
                  <Label htmlFor="qr-options-type-number-input">
                    Type Number
                  </Label>
                  <Input
                    id="qr-options-type-number-input"
                    type="number"
                    min="0"
                    max="40"
                    value={options.qrOptions?.typeNumber}
                    onChange={(e) => {
                      if (!Number.isNaN(e.target.value)) {
                        setOptions((prev) => ({
                          ...prev,
                          qrOptions: {
                            ...prev.qrOptions,
                            typeNumber: Number(e.target.value) as TypeNumber,
                          },
                        }));
                      }
                    }}
                  />
                  <p className="text-muted-foreground text-sm">
                    Min: 0 - Max: 40
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-4 my-4">
                  <Label htmlFor="qr-options-option-mode-input">Mode</Label>
                  <Select
                    defaultValue={"Byte"}
                    onValueChange={(v: Mode) => {
                      setOptions((prev) => ({
                        ...prev,
                        qrOptions: {
                          ...prev.qrOptions,
                          mode: v,
                        },
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Numeric | Alphanumeric | Byte | Kanji" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"Byte"}>Byte</SelectItem>
                      <SelectItem value={"Alphanumeric"}>
                        Alphanumeric
                      </SelectItem>
                      <SelectItem value={"Numeric"}>Numeric</SelectItem>
                      <SelectItem value={"Kanji"}>Kanji</SelectItem>
                      <SelectItem value={"square"}>Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-1 flex-col gap-4 my-4">
                  <Label>Error Correction Level</Label>
                  <Select
                    defaultValue={"Q"}
                    onValueChange={(v: ErrorCorrectionLevel) => {
                      setOptions((prev) => ({
                        ...prev,
                        qrOptions: {
                          ...prev.qrOptions,
                          errorCorrectionLevel: v,
                        },
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="L | M | Q | H" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"L"}>L</SelectItem>
                      <SelectItem value={"M"}>M</SelectItem>
                      <SelectItem value={"Q"}>Q</SelectItem>
                      <SelectItem value={"H"}>H</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </div>
  );
};
