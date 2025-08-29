import { useContext, useState } from "react";
import { type DotType, type Gradient } from "qr-code-styling";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";

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
  defaultDotOptionsGradientColor,
  defaultOptions,
} from "../utils/constants";
import { GradientType, QrDotOptionColorType } from "../utils/share-type";

export const QRDotOptionsView = () => {
  const { options, setOptions } = useContext(QRCodeContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="my-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-1 items-center justify-between">
            <Label className="text-md font-bold">Dots Options</Label>
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
                  <Label className="my-4" htmlFor="dotStyle">
                    Dot Style
                  </Label>
                  <Select
                    defaultValue={"extra-rounded"}
                    onValueChange={(v: DotType) => {
                      setOptions((prev) => ({
                        ...prev,
                        dotsOptions: {
                          ...(prev?.dotsOptions || {}),
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
                      options.dotsOptions?.color
                        ? QrDotOptionColorType.Single
                        : QrDotOptionColorType.Gradient
                    }
                    className="flex flex-row"
                    onValueChange={(v) => {
                      if (v === QrDotOptionColorType.Single) {
                        setOptions((prev) => ({
                          ...prev,
                          dotsOptions: {
                            ...(prev?.dotsOptions || {}),
                            color:
                              prev?.dotsOptions?.color ||
                              defaultOptions.dotsOptions?.color,
                            gradient: undefined,
                          },
                        }));
                      } else if (v === QrDotOptionColorType.Gradient) {
                        setOptions((prev) => ({
                          ...prev,
                          dotsOptions: {
                            ...(prev?.dotsOptions || {}),
                            color: undefined,
                            gradient:
                              prev?.dotsOptions?.gradient ||
                              defaultDotOptionsGradientColor,
                          },
                        }));
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={QrDotOptionColorType.Single}
                        id="single-color"
                      />
                      <Label htmlFor="single-color">Single Color</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={QrDotOptionColorType.Gradient}
                        id="gradient-color"
                      />
                      <Label htmlFor="gradient-color">Gradient Color</Label>
                    </div>
                  </RadioGroup>
                </div>

                {options?.dotsOptions?.color ? (
                  <div>
                    <Label htmlFor="singleColorInput" className="my-4">
                      Color
                    </Label>
                    <Input
                      type="color"
                      className="rounded-md border border-gray-300 p-1 [appearance:none]"
                      value={
                        options?.dotsOptions?.color ||
                        defaultOptions.dotsOptions?.color
                      }
                      onChange={(e) => {
                        if (options.dotsOptions?.color) {
                          setOptions((prev) => ({
                            ...prev,
                            dotsOptions: {
                              ...(prev?.dotsOptions || {}),
                              color: e.target.value,
                              gradient: undefined,
                            },
                          }));
                        } else if (options.dotsOptions?.gradient) {
                          setOptions((prev) => ({
                            ...prev,
                            dotsOptions: {
                              ...(prev?.dotsOptions || {}),
                              color: undefined,
                              gradient: prev?.dotsOptions?.gradient,
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                ) : null}

                {options?.dotsOptions?.gradient ? (
                  <div>
                    <div className="">
                      <Label className="my-4 mr-4">Gradient Type</Label>
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
                              dotsOptions: {
                                ...(prev?.dotsOptions || {}),
                                color:
                                  prev?.dotsOptions?.color ||
                                  defaultOptions.dotsOptions?.color,
                                gradient: undefined,
                              },
                            }));
                          } else if (v === QrDotOptionColorType.Gradient) {
                            setOptions((prev) => ({
                              ...prev,
                              dotsOptions: {
                                ...(prev?.dotsOptions || {}),
                                color: undefined,
                                gradient:
                                  prev?.dotsOptions?.gradient ||
                                  defaultDotOptionsGradientColor,
                              },
                            }));
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={GradientType.Linear}
                            id="linear-color"
                          />
                          <Label htmlFor="linear-color">Linear Color</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={GradientType.Radial}
                            id="radial-color"
                          />
                          <Label htmlFor="radial-color">Radial Color</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex flex-1 gap-4 my-4">
                      <div className="flex flex-1 flex-col gap-4">
                        <Label htmlFor="gradientTypeColorStart">
                          Color Start
                        </Label>
                        <Input
                          type="color"
                          id="gradientTypeColorStart"
                          className="rounded-md border border-gray-300 p-1 [appearance:none]"
                          value={
                            options?.dotsOptions?.gradient?.colorStops?.[0]
                              ?.color
                          }
                          onChange={(e) => {
                            setOptions((prev) => ({
                              ...prev,
                              dotsOptions: {
                                ...(prev.dotsOptions || {}),
                                gradient: {
                                  type:
                                    prev.dotsOptions?.gradient?.type ||
                                    defaultDotOptionsGradientColor.type,
                                  rotation:
                                    prev.dotsOptions?.gradient?.rotation ||
                                    defaultDotOptionsGradientColor.rotation,
                                  colorStops: [
                                    {
                                      offset: 0,
                                      color: e.target.value,
                                    } as Gradient["colorStops"][number],
                                    prev.dotsOptions?.gradient
                                      ?.colorStops[1] as Gradient["colorStops"][number],
                                  ],
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-4">
                        <Label htmlFor="gradientTypeColorEnd">Color End</Label>
                        <Input
                          type="color"
                          id="gradientTypeColorEnd"
                          className="rounded-md border border-gray-300 p-1 [appearance:none]"
                          value={
                            options?.dotsOptions?.gradient?.colorStops?.[1]
                              ?.color
                          }
                          onChange={(e) => {
                            setOptions((prev) => ({
                              ...prev,
                              dotsOptions: {
                                ...(prev.dotsOptions || {}),
                                gradient: {
                                  type:
                                    prev.dotsOptions?.gradient?.type ||
                                    defaultDotOptionsGradientColor.type,
                                  rotation:
                                    prev.dotsOptions?.gradient?.rotation ||
                                    defaultDotOptionsGradientColor.rotation,
                                  colorStops: [
                                    prev.dotsOptions?.gradient
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
                        value={options.dotsOptions?.gradient.rotation || 0}
                        onChange={(e) => {
                          let value: number = 0;
                          if (Number.isNaN(e.target.value)) {
                            value = 0;
                          } else {
                            value = Number(e.target.value);
                          }
                          setOptions((prev) => ({
                            ...prev,
                            dotsOptions: {
                              ...(prev.dotsOptions || {}),
                              gradient: {
                                type:
                                  prev.dotsOptions?.gradient?.type ||
                                  defaultDotOptionsGradientColor.type,
                                rotation:
                                  value ||
                                  defaultDotOptionsGradientColor.rotation,
                                colorStops: prev.dotsOptions?.gradient
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
