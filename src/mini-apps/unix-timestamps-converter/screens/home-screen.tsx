import { useState } from "react";
import { UTCDate } from "@date-fns/utc";

import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Navbar } from "@/vendor/components/navbar";
import { Separator } from "@/vendor/shadcn/components/ui/separator";

import { CurrentUTCDate } from "../components/current-utc-date";
import { CurrentUnix } from "../components/current-unix";

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
  const [milliSeconds, setMilliSeconds] = useState<number>();

  return (
    <div>
      <Label className="my-4" htmlFor="millisecondsInput">
        Convert Milliseconds
      </Label>
      <Input
        id="millisecondsInput"
        onChange={(e) => {
          const value = e.target.value;
          if (!Number.isNaN(value)) {
            setMilliSeconds(Number(value));
          }
        }}
        autoFocus
      />
      <Label className="my-4">To UTC Date & Time</Label>
      <Input
        value={milliSeconds ? new UTCDate(milliSeconds).toString() : ""}
        readOnly
      />
      <Label className="my-4">To Local Date & Time</Label>
      <Input
        value={milliSeconds ? new Date(milliSeconds).toString() : ""}
        readOnly
      />
    </div>
  );
};

export default UnixTimeStapConverterScreen;
