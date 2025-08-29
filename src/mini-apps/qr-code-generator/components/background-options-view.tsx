import { useContext, useState } from "react";
import { QRCodeContext } from "./qr-code-context";
import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  Gradient,
  GradientType as QRCodeGradientType,
} from "qr-code-styling";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/vendor/shadcn/components/ui/collapsible";
import { Label } from "@/vendor/shadcn/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/vendor/shadcn/components/ui/radio-group";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { GradientType, QrDotOptionColorType } from "../utils/share-type";
import {
  defaultDotOptionsGradientColor,
  defaultOptions,
} from "../utils/constants";

export const BackgroundOptionsView = () => {
  const [open, setOpen] = useState(false);
  const { options, setOptions } = useContext(QRCodeContext);

  return (
    <div className="my-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-1 items-center justify-between">
            <Label className="text-md font-bold">Background Options</Label>
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
                  <Label className="my-4 mr-4">Color Type</Label>
                  <RadioGroup
                    defaultValue={
                      options.backgroundOptions?.color
                        ? QrDotOptionColorType.Single
                        : QrDotOptionColorType.Gradient
                    }
                    className="flex flex-row"
                    onValueChange={(v) => {
                      if (v === QrDotOptionColorType.Single) {
                        setOptions((prev) => ({
                          ...prev,
                          backgroundOptions: {
                            ...(prev?.backgroundOptions || {}),
                            color:
                              prev?.backgroundOptions?.color ||
                              defaultOptions.backgroundOptions?.color,
                            gradient: undefined,
                          },
                        }));
                      } else if (v === QrDotOptionColorType.Gradient) {
                        setOptions((prev) => ({
                          ...prev,
                          backgroundOptions: {
                            ...(prev?.backgroundOptions || {}),
                            color: undefined,
                            gradient:
                              prev?.backgroundOptions?.gradient ||
                              defaultDotOptionsGradientColor,
                          },
                        }));
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={QrDotOptionColorType.Single}
                        id="background-options-single-color"
                      />
                      <Label htmlFor="background-options-single-color">
                        Single Color
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={QrDotOptionColorType.Gradient}
                        id="background-options-gradient-color"
                      />
                      <Label htmlFor="background-options-gradient-color">
                        Gradient Color
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {options?.backgroundOptions?.color ? (
                  <div>
                    <Label
                      htmlFor="background-options-single-color-input"
                      className="my-4"
                    >
                      Color
                    </Label>
                    <Input
                      id="background-options-single-color-input"
                      type="color"
                      className="rounded-md border border-gray-300 p-1 [appearance:none]"
                      value={
                        options?.backgroundOptions?.color ||
                        defaultOptions.backgroundOptions?.color
                      }
                      onChange={(e) => {
                        if (options.backgroundOptions?.color) {
                          setOptions((prev) => ({
                            ...prev,
                            backgroundOptions: {
                              ...(prev?.backgroundOptions || {}),
                              color: e.target.value,
                              gradient: undefined,
                            },
                          }));
                        } else if (options.backgroundOptions?.gradient) {
                          setOptions((prev) => ({
                            ...prev,
                            backgroundOptions: {
                              ...(prev?.backgroundOptions || {}),
                              color: undefined,
                              gradient: prev?.backgroundOptions?.gradient,
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                ) : null}

                {options.backgroundOptions?.gradient ? (
                  <div>
                    <div className="">
                      <Label className="my-4 mr-4">Gradient Type</Label>
                      <RadioGroup
                        defaultValue={options.backgroundOptions.gradient.type}
                        className="flex flex-row"
                        onValueChange={(v: QRCodeGradientType) => {
                          setOptions((prev) => ({
                            ...prev,
                            backgroundOptions: {
                              ...(prev.backgroundOptions || {}),
                              gradient: {
                                type: v || defaultDotOptionsGradientColor.type,
                                rotation:
                                  prev.backgroundOptions?.gradient?.rotation ||
                                  defaultDotOptionsGradientColor.rotation,
                                colorStops: [
                                  prev.backgroundOptions?.gradient
                                    ?.colorStops[0] as Gradient["colorStops"][number],
                                  prev.backgroundOptions?.gradient
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
                            id="background-options-linear-color"
                          />
                          <Label htmlFor="background-options-linear-color">
                            Linear Color
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={GradientType.Radial}
                            id="background-options-radial-color"
                          />
                          <Label htmlFor="background-options-radial-color">
                            Radial Color
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex flex-1 gap-4 my-4">
                      <div className="flex flex-1 flex-col gap-4">
                        <Label htmlFor="background-options-gradient-type-color-start">
                          Color Start
                        </Label>
                        <Input
                          type="color"
                          id="background-options-gradient-type-color-start"
                          className="rounded-md border border-gray-300 p-1 [appearance:none]"
                          value={
                            options?.backgroundOptions?.gradient
                              ?.colorStops?.[0]?.color
                          }
                          onChange={(e) => {
                            setOptions((prev) => ({
                              ...prev,
                              backgroundOptions: {
                                ...(prev.backgroundOptions || {}),
                                gradient: {
                                  type:
                                    prev.backgroundOptions?.gradient?.type ||
                                    defaultDotOptionsGradientColor.type,
                                  rotation:
                                    prev.backgroundOptions?.gradient
                                      ?.rotation ||
                                    defaultDotOptionsGradientColor.rotation,
                                  colorStops: [
                                    {
                                      offset: 0,
                                      color: e.target.value,
                                    } as Gradient["colorStops"][number],
                                    prev.backgroundOptions?.gradient
                                      ?.colorStops[1] as Gradient["colorStops"][number],
                                  ],
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-4">
                        <Label htmlFor="background-options-gradient-type-color-end">
                          Color End
                        </Label>
                        <Input
                          type="color"
                          id="background-options-gradient-type-color-end"
                          className="rounded-md border border-gray-300 p-1 [appearance:none]"
                          value={
                            options?.backgroundOptions?.gradient
                              ?.colorStops?.[1]?.color
                          }
                          onChange={(e) => {
                            setOptions((prev) => ({
                              ...prev,
                              backgroundOptions: {
                                ...(prev.backgroundOptions || {}),
                                gradient: {
                                  type:
                                    prev.backgroundOptions?.gradient?.type ||
                                    defaultDotOptionsGradientColor.type,
                                  rotation:
                                    prev.backgroundOptions?.gradient
                                      ?.rotation ||
                                    defaultDotOptionsGradientColor.rotation,
                                  colorStops: [
                                    prev.backgroundOptions?.gradient
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
                          options.backgroundOptions?.gradient.rotation || 0
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
                            backgroundOptions: {
                              ...(prev.backgroundOptions || {}),
                              gradient: {
                                type:
                                  prev.backgroundOptions?.gradient?.type ||
                                  defaultDotOptionsGradientColor.type,
                                rotation:
                                  value ||
                                  defaultDotOptionsGradientColor.rotation,
                                colorStops: prev.backgroundOptions?.gradient
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
