import { useMemo, useState } from "react";
import { UTCDate } from "@date-fns/utc";

import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Navbar } from "@/vendor/components/navbar";
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
import { fromUnixTime } from "date-fns";

enum GenerateMode {
  Milliseconds = "milliSeconds",
  Unix = "unix",
}

const UnixTimeStapConverterScreen = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar
        showBack
        title="Unix Timestamps Converter"
        showSearchBar={false}
      />

      <div className="flex flex-col items-center justify-center p-8 ">
        <div className="w-[600px] h-full p-6 rounded-xl border bg-white gap-2">
          <div className="flex flex-1 mb-4">
            <CurrentUTCDate />

            <CurrentUnix />
          </div>

          <Separator />

          <FormConverter />
        </div>
      </div>
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
      <div className="flex flex-1 items-end">
        <div className="flex flex-1 flex-col pr-4">
          <Label className="my-4" htmlFor="millisecondsInput">
            Convert Milliseconds
          </Label>
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
        <div>
          <Select
            defaultValue={GenerateMode.Milliseconds}
            onValueChange={(v: GenerateMode) => {
              setMode(v);
            }}
          >
            <SelectTrigger className="w-[180px]">
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
