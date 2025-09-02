import { useState } from "react";
import { v1, v4, v6, v7 } from "uuid";
import { toast } from "sonner";

import { Navbar } from "@/vendor/components/navbar";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Button } from "@/vendor/shadcn/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/vendor/shadcn/components/ui/select";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";

export const SupportUUIDVersion = {
  V1: "V1",
  V4: "V4",
  V6: "V6",
  V7: "V7",
} as const;

export type SupportUUIDVersion =
  (typeof SupportUUIDVersion)[keyof typeof SupportUUIDVersion];

const MAX_AMOUNT_ALLOW_GENERATE = 500;

function noob() {
  console.warn("Unsupported version uuid");
  return "";
}

function generateUUID(version: SupportUUIDVersion) {
  switch (version) {
    case SupportUUIDVersion.V1:
      return v1();
    case SupportUUIDVersion.V4:
      return v4();
    case SupportUUIDVersion.V6:
      return v6();
    case SupportUUIDVersion.V7:
      return v7();
    default:
      return noob();
  }
}

export const UUIDGeneratorScreen = () => {
  const [amount, setAmount] = useState(1);
  const [uuidVersion, setUUidVersion] = useState<SupportUUIDVersion>(
    SupportUUIDVersion.V4,
  );
  const [result, setResult] = useState<string>(generateUUID(uuidVersion));

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar showBack title="UUID Generator" showSearchBar={false} />

      <div className="flex flex-col items-center justify-center p-8 ">
        <div className="flex flex-col w-[600px] h-full p-6 rounded-xl border bg-white gap-4">
          <div className="flex flex-1 gap-4 items-end">
            <div className="flex flex-1 flex-col gap-4">
              <Label className="" htmlFor="amount-field">
                Amount
              </Label>
              <Input
                id="amount-field"
                type="number"
                placeholder="Max: 500"
                min={1}
                max={500}
                defaultValue={1}
                autoFocus
                onChange={(e) => {
                  if (!Number.isNaN(e.target.value)) {
                    const totalItem = Number(parseInt(e.target.value));
                    if (totalItem <= MAX_AMOUNT_ALLOW_GENERATE) {
                      const result = Array.from({ length: totalItem })
                        .map(() => generateUUID(uuidVersion))
                        .join("\n");
                      setResult(result);
                      setAmount(Number(parseInt(e.target.value)));
                    }
                  }
                }}
              />
            </div>
            <Select
              defaultValue={SupportUUIDVersion.V4}
              onValueChange={(v: SupportUUIDVersion) => {
                setUUidVersion(v);
                const totalItem = amount;
                if (totalItem <= MAX_AMOUNT_ALLOW_GENERATE) {
                  const result = Array.from({ length: totalItem })
                    .map(() => generateUUID(uuidVersion))
                    .join("\n");
                  setResult(result);
                }
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue
                  placeholder={`Support Version: ${SupportUUIDVersion.V1} | ${SupportUUIDVersion.V4} | ${SupportUUIDVersion.V6} | ${SupportUUIDVersion.V7}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SupportUUIDVersion.V1}>V1</SelectItem>
                <SelectItem value={SupportUUIDVersion.V4}>V4</SelectItem>
                <SelectItem value={SupportUUIDVersion.V6}>V6</SelectItem>
                <SelectItem value={SupportUUIDVersion.V7}>V7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 gap-4">
            <Textarea
              placeholder="paste here"
              id="result-field"
              value={result}
              className="max-h-96 h-32"
              readOnly
            />
          </div>

          <div className="flex flex-1">
            <Button
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(result);
                toast.success("Copied to clipboard!");
              }}
            >
              Copied
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UUIDGeneratorScreen;
