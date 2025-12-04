import { useState } from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import { Label } from "@/vendor/shadcn/components/ui/label";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { APP_ID } from "../utils/constant";
import { convertColor } from "../utils/convert-color";

export const CssColorConverterScreen = () => {
  const [hexColor, setHexColor] = useState("");
  const [rgbColor, setRgbColor] = useState("");
  const [hslColor, setHslColor] = useState("");
  const [oklchColor, setOklchColor] = useState("");
  const [lchColor, setLchColor] = useState("");
  const [testValue, setTestValue] = useState("");

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-full p-6 flex flex-col gap-4 rounded-xl bg-white border">
            <div className="flex flex-col gap-4">
              <Label htmlFor="test-color-input"> Color</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  id="test-color-input"
                  value={testValue}
                  autoFocus
                  onChange={(e) => {
                    try {
                      const newColor = convertColor(e.target.value);

                      setRgbColor(newColor.rgb);
                      setHexColor(newColor.hex);
                      setHslColor(newColor.hsl);
                      setOklchColor(newColor.oklch);
                      setLchColor(newColor.lch);
                    } catch (_e) {
                      // TODO:
                    } finally {
                      setTestValue(e.target.value);
                    }
                  }}
                />
                <div
                  className="w-full sm:w-16 h-9 border rounded-md"
                  style={
                    rgbColor || hexColor || hslColor || oklchColor
                      ? { backgroundColor: `${testValue}` }
                      : { backgroundColor: "white" }
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Supported colors: hex, hsl, rgb, rgba, oklch, lch
              </p>
            </div>

            {hexColor || rgbColor || hslColor || oklchColor ? (
              <Separator className="my-4" />
            ) : null}

            {hexColor ? (
              <div className="flex flex-col gap-4">
                <Label htmlFor="hex-color-input">Hex Color</Label>
                <Input
                  id="hex-color-input"
                  value={hexColor}
                  readOnly
                  onFocus={() => {
                    navigator.clipboard.writeText(hexColor);
                    toast.success("Copied to clipboard!");
                  }}
                />
              </div>
            ) : null}

            {rgbColor ? (
              <div className="flex flex-col gap-4">
                <Label htmlFor="rgb-color-input">RGB Color</Label>
                <Input
                  id="rgb-color-input"
                  value={rgbColor}
                  readOnly
                  onFocus={() => {
                    navigator.clipboard.writeText(rgbColor);
                    toast.success("Copied to clipboard!");
                  }}
                />
              </div>
            ) : null}

            {hslColor ? (
              <div className="flex flex-col gap-4">
                <Label htmlFor="hsl-color-input">HSL Color</Label>
                <Input
                  id="hsl-color-input"
                  value={hslColor}
                  readOnly
                  onFocus={() => {
                    navigator.clipboard.writeText(hslColor);
                    toast.success("Copied to clipboard!");
                  }}
                />
              </div>
            ) : null}

            {oklchColor ? (
              <div className="flex flex-col gap-4">
                <Label htmlFor="oklch-color-input">OKLCH Color</Label>
                <Input
                  id="oklch-color-input"
                  value={oklchColor}
                  readOnly
                  onFocus={() => {
                    navigator.clipboard.writeText(oklchColor);
                    toast.success("Copied to clipboard!");
                  }}
                />
              </div>
            ) : null}

            {lchColor ? (
              <div className="flex flex-col gap-4">
                <Label htmlFor="lch-color-input">LCH Color</Label>
                <Input
                  id="lch-color-input"
                  value={lchColor}
                  readOnly
                  onFocus={() => {
                    navigator.clipboard.writeText(lchColor);
                    toast.success("Copied to clipboard!");
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default CssColorConverterScreen;
