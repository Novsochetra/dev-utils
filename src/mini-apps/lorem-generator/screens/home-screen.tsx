import { useState } from "react";
import { toast } from "sonner";

import { Navbar } from "@/vendor/components/navbar";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";
import { Input } from "@/vendor/shadcn/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/vendor/shadcn/components/ui/select";
import { Checkbox } from "@/vendor/shadcn/components/ui/checkbox";
import { makeParagraph, makeSentence, makeWord } from "../utils/generator";

const GenerateMode = {
  Paragraph: "paragraph",
  Word: "word",
  Sentence: "sentence",
} as const;

type GenerateMode = (typeof GenerateMode)[keyof typeof GenerateMode];

const LoremGeneratorScreen = () => {
  const [mode, setMode] = useState<GenerateMode>(GenerateMode.Paragraph);
  const [result, setResult] = useState(makeParagraph(1));
  const [amount, setAmount] = useState<number>(1);
  const [asHTML, setAsHTML] = useState<boolean>(false);

  const onUpdateResultBaseOnMode = (
    value: GenerateMode,
    amount: number,
    valueAsHTML: boolean = false,
  ) => {
    setMode(value);

    switch (value) {
      case GenerateMode.Paragraph:
        setResult(makeParagraph(amount, valueAsHTML));
        break;
      case GenerateMode.Word:
        setResult(makeWord(amount, valueAsHTML));
        break;
      case GenerateMode.Sentence:
        setResult(makeSentence(amount, valueAsHTML));
        break;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar showBack title="Lorem Generator" showSearchBar={false} />
      <div className="flex flex-col items-center justify-center p-8 ">
        <div className="w-[600px] h-full p-6 rounded-xl border bg-white">
          <div className="flex">
            <Input
              className="flex flex-1 mr-4"
              type="number"
              placeholder="Enter amount"
              value={parseInt(String(amount))}
              onChange={(e) => {
                if (Number.isNaN(e.target.value)) {
                  setAmount(1);
                } else {
                  setAmount(Number(e.target.value));
                  onUpdateResultBaseOnMode(
                    mode,
                    Number(e.target.value),
                    asHTML,
                  );
                }
              }}
              min={1}
            />
            <Select
              defaultValue={GenerateMode.Paragraph}
              onValueChange={(v: GenerateMode) => {
                onUpdateResultBaseOnMode(v, amount, asHTML);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GenerateMode.Paragraph}>
                  Paragraph
                </SelectItem>
                <SelectItem value={GenerateMode.Sentence}>Sentence</SelectItem>
                <SelectItem value={GenerateMode.Word}>Word</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-1 pt-4">
            <Checkbox
              id="asHTML"
              onCheckedChange={(value: boolean) => {
                setAsHTML(value);
                onUpdateResultBaseOnMode(mode, amount, value);
              }}
            />
            <Label htmlFor="asHTML" className="ml-4">
              As HTML
            </Label>
          </div>
          <Label className="my-4">Result</Label>
          <Textarea placeholder="" value={result} readOnly className="h-96" />

          <Button
            className="mt-4 w-full"
            onClick={() => {
              navigator.clipboard.writeText(result);
              toast.success("Copied to clipboard!");
            }}
          >
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoremGeneratorScreen;
