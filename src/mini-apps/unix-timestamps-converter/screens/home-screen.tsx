import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { fromUnixTime } from "date-fns";
import { UTCDate } from "@date-fns/utc";

import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Separator } from "@/vendor/shadcn/components/ui/separator";

import { CurrentUTCDate } from "../components/current-utc-date";
import { CurrentUnix } from "../components/current-unix";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/vendor/shadcn/components/ui/select";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { APP_ID } from "../utils/constants";

export const GenerateMode = {
  Milliseconds: "milliSeconds",
  Unix: "unix",
} as const;

export type GenerateMode = (typeof GenerateMode)[keyof typeof GenerateMode];

const UnixTimeStapConverterScreen = () => {
  return (
    <div className="flex flex-1 min-h-0 overflow-auto">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-col flex-1">
          <div className="p-8">
            <div className="w-full h-full p-6 rounded-xl border bg-white gap-2">
              <div className="flex flex-1 flex-col sm:flex-row text-center gap-4 mb-4">
                <CurrentUTCDate />

                <CurrentUnix />
              </div>

              <Separator />

              <FormConverter />
            </div>
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};

const FormConverter = () => {
  const [value, setValue] = useState<number>();
  const [mode, setMode] = useState<GenerateMode>(GenerateMode.Milliseconds);
  const { utcDateTime, localDateTime } = useMemo(() => {
    return convertToDates(value, mode);
  }, [mode, value]);

  return (
    <div>
      <div className="flex flex-1 flex-col">
        <Label className="my-4" htmlFor="millisecondsInput">
          Convert Milliseconds
        </Label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-1">
            <Input
              id="millisecondsInput"
              onChange={(e) => {
                const value = e.target.value;
                if (!Number.isNaN(value)) {
                  setValue(Number(value));
                }
              }}
              autoFocus
            />
          </div>
          <div className="flex flex-1">
            <Select
              defaultValue={GenerateMode.Milliseconds}
              onValueChange={(v: GenerateMode) => {
                setMode(v);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GenerateMode.Milliseconds}>
                  Milliseconds
                </SelectItem>
                <SelectItem value={GenerateMode.Unix}>Unix</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Label className="my-4">To UTC Date & Time</Label>
      <Input value={utcDateTime} readOnly />
      <Label className="my-4">To Local Date & Time</Label>
      <Input value={localDateTime} readOnly />
    </div>
  );
};

function convertToDates(value: number | undefined, mode: GenerateMode) {
  if (!value || !mode) return { utc: "", local: "" };

  const date =
    mode === GenerateMode.Milliseconds ? new Date(value) : fromUnixTime(value);

  return {
    utcDateTime: new UTCDate(date).toString(),
    localDateTime: date.toString(),
  };
}

export default UnixTimeStapConverterScreen;
