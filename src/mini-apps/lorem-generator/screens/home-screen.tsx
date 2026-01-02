import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";

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
import { useAppStore } from "@/main-app/state";

import { makeParagraph, makeSentence, makeWord } from "../utils/generator";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { APP_ID } from "../utils/constant";
import { LoremGeneratorLeftToolbar } from "./components/toolbar/left-toolbar";

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
  const setRightMenubar = useAppStore((state) => state.setRightMenubar);
  const setLeftMenubar = useAppStore((state) => state.setLeftMenubar);
  const navigate = useNavigate();

  useHotkeys(
    "Escape",
    () => {
      navigate("/");
    },
    { enableOnFormTags: true }
  );

  useEffect(() => {
    setRightMenubar(null);
    setLeftMenubar(<LoremGeneratorLeftToolbar />);

    return () => {
      setRightMenubar(null);
      setLeftMenubar(null);
    };
  }, []);

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
    <div className="flex flex-1 min-h-0 overflow-auto">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col">
          <div className="p-8 flex flex-1">
            <div className="flex flex-col flex-1 border rounded-xl p-8">
              <div className="flex flex-wrap gap-4">
                <Input
                  className="flex flex-1 min-w-20"
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
                  <SelectTrigger className="flex flex-1">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GenerateMode.Paragraph}>
                      Paragraph
                    </SelectItem>
                    <SelectItem value={GenerateMode.Sentence}>
                      Sentence
                    </SelectItem>
                    <SelectItem value={GenerateMode.Word}>Word</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex pt-4">
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
              <Textarea
                placeholder=""
                value={result}
                className="h-full"
                readOnly
              />

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
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};

export default LoremGeneratorScreen;
