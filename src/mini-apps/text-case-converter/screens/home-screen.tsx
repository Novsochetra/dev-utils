import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";

import { Label } from "@/vendor/shadcn/components/ui/label";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";
import { Checkbox } from "@/vendor/shadcn/components/ui/checkbox";
import { Badge } from "@/vendor/shadcn/components/ui/badge";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { useAppStore } from "@/main-app/state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/vendor/shadcn/components/ui/select";

import {
  detectTextCase,
  transformTextCase,
} from "../utils/text-case-converter";
import {
  SupportedTextCase,
  SupportedTextCaseLabel,
  APP_ID,
} from "../utils/constants";
import { TextCaseConverterLeftToolbar } from "./components/toolbar/left-toolbar";

export const TextCaseConverterScreen = () => {
  const [text, setText] = useState("");
  const [analyzeTextCase, setAnalyzeTextCase] = useState<
    SupportedTextCase | "Unknown"
  >("Unknown");
  const [mode, setMode] = useState<SupportedTextCase>(
    SupportedTextCase.LowerCase,
  );
  const [smartCaseDetectionMode, setSmartCaseDetectionMode] = useState(true);
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
    setLeftMenubar(<TextCaseConverterLeftToolbar />);

    return () => {
      setRightMenubar(null);
      setLeftMenubar(null);
    };
  }, []);

  return (
    <div className="flex flex-1 min-h-0 overflow-auto">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col">
          <div className="p-8">
            <div className="w-full p-6 flex flex-col gap-4 rounded-xl bg-white border">
              <div className="flex flex-col gap-4 relative">
                <Label htmlFor="input-text">Text</Label>
                <Textarea
                  id="input-text"
                  value={text}
                  className="h-32"
                  onChange={(e) => {
                    setText(e.target.value);
                    setAnalyzeTextCase(detectTextCase(e.target.value));
                  }}
                />
                {smartCaseDetectionMode && analyzeTextCase !== "Unknown" ? (
                  <Badge className="absolute bottom-4 right-4 select-none">
                    {SupportedTextCaseLabel[analyzeTextCase]}
                  </Badge>
                ) : null}
              </div>
              <div className="flex gap-4">
                <Checkbox
                  id="smart-case-detection-checkbox"
                  defaultChecked={smartCaseDetectionMode}
                  onCheckedChange={(value: boolean) => {
                    setSmartCaseDetectionMode(value);
                  }}
                />
                <Label htmlFor="smart-case-detection-checkbox">
                  Smart Case Detection Mode
                </Label>
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="encoded-tab-header-input">Text Case</Label>

                <Select
                  defaultValue={SupportedTextCase.LowerCase}
                  onValueChange={(v: SupportedTextCase) => {
                    setMode(v);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SupportedTextCase.LowerCase}>
                      lower case
                    </SelectItem>
                    <SelectItem value={SupportedTextCase.UpperCase}>
                      UPPER CASE
                    </SelectItem>
                    <SelectItem value={SupportedTextCase.TitleCase}>
                      Title Case
                    </SelectItem>
                    <SelectItem value={SupportedTextCase.CamelCase}>
                      camelCase
                    </SelectItem>
                    <SelectItem value={SupportedTextCase.PascalCase}>
                      PascalCase
                    </SelectItem>
                    <SelectItem value={SupportedTextCase.SnakeCase}>
                      snake_case
                    </SelectItem>
                    <SelectItem value={SupportedTextCase.KebabCase}>
                      kebab-case
                    </SelectItem>
                    <SelectItem value={SupportedTextCase.ConstantCase}>
                      CONSTANT_CASE
                    </SelectItem>
                    <SelectItem value={SupportedTextCase.DotCase}>
                      dot.case
                    </SelectItem>
                    <SelectItem value={SupportedTextCase.PathCase}>
                      path/case
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="result-text-input">Result</Label>
                <Textarea
                  id="result-text-input"
                  value={transformTextCase(text, mode, smartCaseDetectionMode)}
                  className="h-32"
                  readOnly
                />
              </div>
            </div>
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};

export default TextCaseConverterScreen;
