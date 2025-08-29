import { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { type DotType, type Gradient } from "qr-code-styling";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/vendor/shadcn/components/ui/collapsible";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/vendor/shadcn/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/vendor/shadcn/components/ui/select";

import { QRCodeContext } from "./qr-code-context";
import {
  defaultOptions,
  defaultDotOptionsGradientColor,
} from "../utils/constants";
import { QrDotOptionColorType, GradientType } from "../utils/share-type";

export const CornerSquareOptionsView = () => {
  const [open, setOpen] = useState(false);
  const { options, setOptions } = useContext(QRCodeContext);

  return (
    <div className="my-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-1 items-center justify-between">
            <Label className="text-md font-bold">Corner Square Options</Label>
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
                <div className="">
                  <Label
                    className="my-4"
                    htmlFor="corner-square-options-dot-style"
                  >
                    Corner Square Style
                  </Label>
                  <Select
                    defaultValue={"extra-rounded"}
                    onValueChange={(v: DotType) => {
                      setOptions((prev) => ({
                        ...prev,
                        cornersSquareOptions: {
                          ...(prev?.cornersSquareOptions || {}),
                          type: v,
                        },
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="dots | rounded | classy | classy-rounded | square | extra-rounded" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"extra-rounded"}>
                        Extra Rounded
                      </SelectItem>
                      <SelectItem value={"dots"}>Dots</SelectItem>
                      <SelectItem value={"rounded"}>Rounded</SelectItem>
                      <SelectItem value={"classy"}>Classy</SelectItem>
                      <SelectItem value={"classy-rounded"}>
                        Classy Rounded
                      </SelectItem>
                      <SelectItem value={"square"}>Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="">
                  <Label className="my-4 mr-4">Color Type</Label>
                  <RadioGroup
                    defaultValue={
                      options?.cornersSquareOptions?.color
                        ? QrDotOptionColorType.Single
                        : QrDotOptionColorType.Gradient
                    }
                    className="flex flex-row"
                    onValueChange={(v) => {
                      if (v === QrDotOptionColorType.Single) {
                        setOptions((prev) => ({
                          ...prev,
                          cornersSquareOptions: {
                            ...(prev?.cornersSquareOptions || {}),
                            color:
                              prev?.cornersSquareOptions?.color ||
                              defaultOptions.cornersSquareOptions?.color,
                            gradient: undefined,
                          },
                        }));
                      } else if (v === QrDotOptionColorType.Gradient) {
                        setOptions((prev) => ({
                          ...prev,
                          cornersSquareOptions: {
                            ...(prev?.cornersSquareOptions || {}),
                            color: undefined,
                            gradient:
                              prev?.cornersSquareOptions?.gradient ||
                              defaultDotOptionsGradientColor,
                          },
                        }));
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={QrDotOptionColorType.Single}
                        id="corner-square-options-single-color"
                      />
                      <Label htmlFor="corner-square-options-single-color">
                        Single Color
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={QrDotOptionColorType.Gradient}
                        id="corner-square-options-gradient-color"
                      />
                      <Label htmlFor="corner-square-options-gradient-color">
                        Gradient Color
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {options.cornersSquareOptions?.color ? (
                  <div>
                    <Label
                      htmlFor="corner-square-options-single-color-input"
                      className="my-4"
                    >
                      Color
                    </Label>
                    <Input
                      id="corner-square-options-single-color-input"
                      type="color"
                      className="rounded-md border border-gray-300 p-1 [appearance:none]"
                      value={
                        options.cornersSquareOptions?.color ||
                        defaultOptions.cornersSquareOptions?.color
                      }
                      onChange={(e) => {
                        if (options.cornersSquareOptions?.color) {
                          setOptions((prev) => ({
                            ...prev,
                            cornersSquareOptions: {
                              ...(prev?.cornersSquareOptions || {}),
                              color: e.target.value,
                              gradient: undefined,
                            },
                          }));
                        } else if (options.cornersSquareOptions?.gradient) {
                          setOptions((prev) => ({
                            ...prev,
                            cornersSquareOptions: {
                              ...(prev?.cornersSquareOptions || {}),
                              color: undefined,
                              gradient: prev?.cornersSquareOptions?.gradient,
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                ) : null}

                {options.cornersSquareOptions?.gradient ? (
                  <div>
                    <div className="">
                      <Label className="my-4 mr-4">Gradient Type</Label>
                      <RadioGroup
                        defaultValue={
                          options.cornersSquareOptions?.gradient?.type ===
                          GradientType.Radial
                            ? GradientType.Radial
                            : GradientType.Linear
                        }
                        className="flex flex-row"
                        onValueChange={(v: GradientType) => {
                          setOptions((prev) => ({
                            ...prev,
                            cornersSquareOptions: {
                              ...(prev.cornersSquareOptions || {}),
                              gradient: {
                                type: v || defaultDotOptionsGradientColor.type,
                                rotation:
                                  prev.cornersSquareOptions?.gradient
                                    ?.rotation ||
                                  defaultDotOptionsGradientColor.rotation,
                                colorStops: [
                                  prev.cornersSquareOptions?.gradient
                                    ?.colorStops[0] as Gradient["colorStops"][number],
                                  prev.cornersSquareOptions?.gradient
                                    ?.colorStops[1] as Gradient["colorStops"][number],
                                ],
                              },
                            },
                          }));
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={GradientType.Linear}
                            id="corner-square-options-linear-color"
                          />
                          <Label htmlFor="corner-square-options-linear-color">
                            Linear Color
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={GradientType.Radial}
                            id="corner-square-options-radial-color"
                          />
                          <Label htmlFor="corner-square-options-radial-color">
                            Radial Color
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex flex-1 gap-4 my-4">
                      <div className="flex flex-1 flex-col gap-4">
                        <Label htmlFor="corner-square-options-gradient-type-color-start">
                          Color Start
                        </Label>
                        <Input
                          type="color"
                          id="corner-square-options-gradient-type-color-start"
                          className="rounded-md border border-gray-300 p-1 [appearance:none]"
                          value={
                            options?.cornersSquareOptions?.gradient
                              ?.colorStops?.[0]?.color
                          }
                          onChange={(e) => {
                            setOptions((prev) => ({
                              ...prev,
                              cornersSquareOptions: {
                                ...(prev.cornersSquareOptions || {}),
                                gradient: {
                                  type:
                                    prev.cornersSquareOptions?.gradient?.type ||
                                    defaultDotOptionsGradientColor.type,
                                  rotation:
                                    prev.cornersSquareOptions?.gradient
                                      ?.rotation ||
                                    defaultDotOptionsGradientColor.rotation,
                                  colorStops: [
                                    {
                                      offset: 0,
                                      color: e.target.value,
                                    } as Gradient["colorStops"][number],
                                    prev.cornersSquareOptions?.gradient
                                      ?.colorStops[1] as Gradient["colorStops"][number],
                                  ],
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-4">
                        <Label htmlFor="corner-square-options-gradient-type-color-end">
                          Color End
                        </Label>
                        <Input
                          type="color"
                          id="corner-square-options-gradient-type-color-end"
                          className="rounded-md border border-gray-300 p-1 [appearance:none]"
                          value={
                            options?.cornersSquareOptions?.gradient
                              ?.colorStops?.[1]?.color
                          }
                          onChange={(e) => {
                            setOptions((prev) => ({
                              ...prev,
                              cornersSquareOptions: {
                                ...(prev.cornersSquareOptions || {}),
                                gradient: {
                                  type:
                                    prev.cornersSquareOptions?.gradient?.type ||
                                    defaultDotOptionsGradientColor.type,
                                  rotation:
                                    prev.cornersSquareOptions?.gradient
                                      ?.rotation ||
                                    defaultDotOptionsGradientColor.rotation,
                                  colorStops: [
                                    prev.cornersSquareOptions?.gradient
                                      ?.colorStops[0] as Gradient["colorStops"][number],
                                    {
                                      offset: 1,
                                      color: e.target.value,
                                    } as Gradient["colorStops"][number],
                                  ],
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <Label>Rotate Degree</Label>
                      <Input
                        type="number"
                        value={
                          options.cornersSquareOptions?.gradient?.rotation || 0
                        }
                        onChange={(e) => {
                          let value: number = 0;
                          if (Number.isNaN(e.target.value)) {
                            value = 0;
                          } else {
                            value = Number(e.target.value);
                          }
                          setOptions((prev) => ({
                            ...prev,
                            cornersSquareOptions: {
                              ...(prev.cornersSquareOptions || {}),
                              gradient: {
                                type:
                                  prev.cornersSquareOptions?.gradient?.type ||
                                  defaultDotOptionsGradientColor.type,
                                rotation:
                                  value ||
                                  defaultDotOptionsGradientColor.rotation,
                                colorStops: prev.cornersSquareOptions?.gradient
                                  ?.colorStops as Gradient["colorStops"],
                              },
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </div>
  );
};
