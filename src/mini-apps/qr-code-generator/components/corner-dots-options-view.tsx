import { useState, useContext } from "react";
import { QRCodeContext } from "./qr-code-context";
import { GradientType, QrDotOptionColorType } from "../utils/share-type";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/vendor/shadcn/components/ui/collapsible";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/vendor/shadcn/components/ui/select";
import type { DotType, Gradient } from "qr-code-styling";
import { Input } from "@/vendor/shadcn/components/ui/input";
import {
  defaultOptions,
  defaultDotOptionsGradientColor,
} from "../utils/constants";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/vendor/shadcn/components/ui/radio-group";

export const CornerDotOptionsView = () => {
  const [open, setOpen] = useState(false);
  const { options, setOptions } = useContext(QRCodeContext);

  return (
    <div className="my-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-1 items-center justify-between">
            <Label className="text-md font-bold">Corner Dots Options</Label>
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
                    htmlFor="corner-dots-options-dot-style"
                  >
                    Corner Dot Style
                  </Label>
                  <Select
                    defaultValue={"extra-rounded"}
                    onValueChange={(v: DotType) => {
                      setOptions((prev) => ({
                        ...prev,
                        cornersDotOptions: {
                          ...(prev?.cornersDotOptions || {}),
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
                    className="flex flex-row"
                    defaultValue={
                      options.cornersDotOptions?.color
                        ? QrDotOptionColorType.Single
                        : QrDotOptionColorType.Gradient
                    }
                    onValueChange={(v) => {
                      if (v === QrDotOptionColorType.Single) {
                        setOptions((prev) => ({
                          ...prev,
                          cornersDotOptions: {
                            ...(prev?.cornersDotOptions || {}),
                            color:
                              prev?.cornersDotOptions?.color ||
                              defaultOptions.cornersDotOptions?.color,
                            gradient: undefined,
                          },
                        }));
                      } else if (v === QrDotOptionColorType.Gradient) {
                        setOptions((prev) => ({
                          ...prev,
                          cornersDotOptions: {
                            ...(prev?.cornersDotOptions || {}),
                            color: undefined,
                            gradient:
                              prev?.cornersDotOptions?.gradient ||
                              defaultDotOptionsGradientColor,
                          },
                        }));
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={QrDotOptionColorType.Single}
                        id="corner-dots-options-single-color"
                      />
                      <Label htmlFor="corner-dots-options-single-color">
                        Single Color
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={QrDotOptionColorType.Gradient}
                        id="corder-dot-options-gradient-color"
                      />
                      <Label htmlFor="corder-dot-options-gradient-color">
                        Gradient Color
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {options.cornersDotOptions?.color ? (
                  <div>
                    <Label
                      htmlFor="corner-dots-options-single-color-input"
                      className="my-4"
                    >
                      Color
                    </Label>
                    <Input
                      type="color"
                      className="rounded-md border border-gray-300 p-1 [appearance:none]"
                      value={
                        options?.cornersDotOptions?.color ||
                        defaultOptions.cornersDotOptions?.color
                      }
                      onChange={(e) => {
                        if (options.cornersDotOptions?.color) {
                          setOptions((prev) => ({
                            ...prev,
                            cornersDotOptions: {
                              ...(prev?.cornersDotOptions || {}),
                              color: e.target.value,
                              gradient: undefined,
                            },
                          }));
                        } else if (options.cornersDotOptions?.gradient) {
                          setOptions((prev) => ({
                            ...prev,
                            cornersDotOptions: {
                              ...(prev?.cornersDotOptions || {}),
                              color: undefined,
                              gradient: prev?.cornersDotOptions?.gradient,
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                ) : null}

                {options.cornersDotOptions?.gradient ? (
                  <div>
                    <div className="">
                      <Label className="my-4 mr-4">Gradient Type</Label>
                      <RadioGroup
                        className="flex flex-row"
                        defaultValue={
                          options?.cornersDotOptions?.gradient?.type
                        }
                        onValueChange={(v: GradientType) => {
                          setOptions((prev) => ({
                            ...prev,
                            cornersDotOptions: {
                              ...(prev.cornersDotOptions || {}),
                              gradient: {
                                type: v || defaultDotOptionsGradientColor.type,
                                rotation:
                                  prev.cornersDotOptions?.gradient?.rotation ||
                                  defaultDotOptionsGradientColor.rotation,
                                colorStops: [
                                  prev.dotsOptions?.gradient
                                    ?.colorStops[0] as Gradient["colorStops"][number],
                                  prev.dotsOptions?.gradient
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
                            id="corner-dots-options-linear-color"
                          />
                          <Label htmlFor="corner-dots-options-linear-color">
                            Linear Color
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={GradientType.Radial}
                            id="corner-dots-options-radial-color"
                          />
                          <Label htmlFor="corner-dots-options-radial-color">
                            Radial Color
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex flex-1 gap-4 my-4">
                      <div className="flex flex-1 flex-col gap-4">
                        <Label htmlFor="corner-dots-options-gradient-type-color-start">
                          Color Start
                        </Label>
                        <Input
                          type="color"
                          id="corner-dots-options-gradient-type-color-start"
                          className="rounded-md border border-gray-300 p-1 [appearance:none]"
                          value={
                            options?.cornersDotOptions?.gradient
                              ?.colorStops?.[0]?.color
                          }
                          onChange={(e) => {
                            setOptions((prev) => ({
                              ...prev,
                              cornersDotOptions: {
                                ...(prev.cornersDotOptions || {}),
                                gradient: {
                                  type:
                                    prev.cornersDotOptions?.gradient?.type ||
                                    defaultDotOptionsGradientColor.type,
                                  rotation:
                                    prev.cornersDotOptions?.gradient
                                      ?.rotation ||
                                    defaultDotOptionsGradientColor.rotation,
                                  colorStops: [
                                    {
                                      offset: 0,
                                      color: e.target.value,
                                    } as Gradient["colorStops"][number],
                                    prev.cornersDotOptions?.gradient
                                      ?.colorStops[1] as Gradient["colorStops"][number],
                                  ],
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-4">
                        <Label htmlFor="corner-dots-options-gradient-type-color-end">
                          Color End
                        </Label>
                        <Input
                          type="color"
                          id="corner-dots-options-gradient-type-color-end"
                          className="rounded-md border border-gray-300 p-1 [appearance:none]"
                          value={
                            options?.cornersDotOptions?.gradient
                              ?.colorStops?.[1]?.color
                          }
                          onChange={(e) => {
                            setOptions((prev) => ({
                              ...prev,
                              cornersDotOptions: {
                                ...(prev.cornersDotOptions || {}),
                                gradient: {
                                  type:
                                    prev.cornersDotOptions?.gradient?.type ||
                                    defaultDotOptionsGradientColor.type,
                                  rotation:
                                    prev.cornersDotOptions?.gradient
                                      ?.rotation ||
                                    defaultDotOptionsGradientColor.rotation,
                                  colorStops: [
                                    prev.cornersDotOptions?.gradient
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
                          options.cornersDotOptions?.gradient.rotation || 0
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
                            cornersDotOptions: {
                              ...(prev.cornersDotOptions || {}),
                              gradient: {
                                type:
                                  prev.cornersDotOptions?.gradient?.type ||
                                  defaultDotOptionsGradientColor.type,
                                rotation:
                                  value ||
                                  defaultDotOptionsGradientColor.rotation,
                                colorStops: prev.cornersDotOptions?.gradient
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
