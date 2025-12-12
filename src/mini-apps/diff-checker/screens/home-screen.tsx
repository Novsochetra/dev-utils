import { useEffect, useRef, useState, type RefObject } from "react";
import { diffLines, diffWords, diffChars } from "diff";
import { AnimatePresence } from "framer-motion";

import { AnimatedPage } from "@/vendor/components/animate-page";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/vendor/shadcn/components/ui/tabs";

import { APP_ID } from "../utils/constant";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/vendor/shadcn/components/ui/resizable";
import { type PanelGroupProps } from "react-resizable-panels";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";

const HomeScreen = () => {
  return (
    <div className="flex flex-1 min-h-0 overflow-auto">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col min-w-0">
          <DiffChecker />
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};

// --- build diff lines aligned to real editor lines ---
const buildDiffLinesArray = (
  leftText: string,
  rightText: string,
  mode: "lines" | "words" | "chars",
) => {
  const leftLines = leftText.split("\n");
  const rightLines = rightText.split("\n");
  const max = Math.max(leftLines.length, rightLines.length);
  const lines: {
    parts: { text: string; added?: boolean; removed?: boolean }[];
  }[] = [];

  for (let i = 0; i < max; i++) {
    const l = leftLines[i] ?? "";
    const r = rightLines[i] ?? "";
    let parts: { text: string; added?: boolean; removed?: boolean }[] = [];

    if (mode === "lines") {
      // line-level: if equal, single unchanged part; otherwise diff by lines for that single line
      if (l === r) {
        parts = [{ text: l }];
      } else {
        const raw = diffLines(l, r);
        parts = raw.map((p) => ({
          text: p.value,
          added: !!p.added,
          removed: !!p.removed,
        }));
      }
    } else if (mode === "words") {
      const raw = diffWords(l, r);
      parts = raw.map((p) => ({
        text: p.value,
        added: !!p.added,
        removed: !!p.removed,
      }));
    } else {
      const raw = diffChars(l, r);
      parts = raw.map((p) => ({
        text: p.value,
        added: !!p.added,
        removed: !!p.removed,
      }));
    }

    lines.push({ parts });
  }

  return lines;
};

type SupportDiffMode = "lines" | "words" | "chars";

const DiffChecker = () => {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [mode, setMode] = useState<SupportDiffMode>("chars");
  const [mainDirection, setMainDirection] =
    useState<PanelGroupProps["direction"]>("horizontal");

  useEffect(() => {
    const func = () => {
      const isMd = window.innerWidth <= 768;
      if (isMd) {
        setMainDirection("vertical");
      } else {
        setMainDirection("horizontal");
      }
    };

    window.addEventListener("resize", func);

    return () => {
      window.removeEventListener("resize", func);
    };
  }, []);

  const diffLinesArray = buildDiffLinesArray(left, right, mode);

  return (
    <div className="flex flex-1 flex-col p-4 min-w-0 gap-4">
      <div className="flex justify-center">
        <Tabs
          className="w-full sm:w-fit"
          value={mode}
          onValueChange={(v) => setMode(v as SupportDiffMode)}
        >
          <TabsList className="w-full">
            <TabsTrigger className="truncate" value="chars">
              <span className="truncate max-w-[80px] overflow-hidden text-ellipsis">
                Char Diff
              </span>
            </TabsTrigger>
            <TabsTrigger className="truncate" value="words">
              <span className="truncate max-w-[80px] overflow-hidden text-ellipsis">
                Word Diff
              </span>
            </TabsTrigger>
            <TabsTrigger className="truncate" value="lines">
              <span className="truncate max-w-[80px] overflow-hidden text-ellipsis">
                Line Diff
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ResizablePanelGroup
        direction="vertical"
        className="flex flex-col gap-3 flex-1 text-sm min-w-0"
      >
        <ResizablePanel
          className="flex flex-1 min-w-0"
          defaultSize={
            localStorage.getItem("dev-utils::diff-checker::resize-panel-1")
              ? Number(
                  localStorage.getItem(
                    "dev-utils::diff-checker::resize-panel-1",
                  ),
                )
              : undefined
          }
          onResize={(size) => {
            localStorage.setItem(
              "dev-utils::diff-checker::resize-panel-1",
              size.toString(),
            );
          }}
        >
          <ResizablePanelGroup
            direction={mainDirection}
            className="flex flex-col md:flex-row gap-3 flex-1"
          >
            {/* LEFT EDITOR */}
            <ResizablePanel
              className="flex flex-1 relative overflow-scroll"
              defaultSize={
                localStorage.getItem(
                  "dev-utils::diff-checker::resize-panel-1-1",
                )
                  ? Number(
                      localStorage.getItem(
                        "dev-utils::diff-checker::resize-panel-1-1",
                      ),
                    )
                  : undefined
              }
              onResize={(size) => {
                localStorage.setItem(
                  "dev-utils::diff-checker::resize-panel-1-1",
                  size.toString(),
                );
              }}
            >
              <AutoHeightTextArea
                value={left}
                onChange={(e) => setLeft(e.target.value)}
              />
            </ResizablePanel>
            <ResizableHandle
              className="w-0 data-[panel-group-direction=vertical]:h-0"
              withHandle
            />

            {/* RIGHT EDITOR */}
            <ResizablePanel
              className="flex flex-1 rounded-md relative"
              defaultSize={
                localStorage.getItem(
                  "dev-utils::diff-checker::resize-panel-1-2",
                )
                  ? Number(
                      localStorage.getItem(
                        "dev-utils::diff-checker::resize-panel-1-2",
                      ),
                    )
                  : undefined
              }
              onResize={(size) => {
                localStorage.setItem(
                  "dev-utils::diff-checker::resize-panel-1-2",
                  size.toString(),
                );
              }}
            >
              <AutoHeightTextArea
                value={right}
                onChange={(e) => setRight(e.target.value)}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle
          className="w-0 data-[panel-group-direction=vertical]:h-0"
          withHandle
        />

        <ResizablePanel
          className="flex flex-1 border rounded-md"
          defaultSize={
            localStorage.getItem("dev-utils::diff-checker::resize-panel-2")
              ? Number(
                  localStorage.getItem(
                    "dev-utils::diff-checker::resize-panel-2",
                  ),
                )
              : undefined
          }
          onResize={(size) => {
            localStorage.setItem(
              "dev-utils::diff-checker::resize-panel-2",
              size.toString(),
            );
          }}
        >
          <div className="h-full w-full flex overflow-scroll">
            <div className="w-8 text-center py-4 bg-slate-100 select-none">
              {diffLinesArray.map((_, idx) => (
                <p
                  key={`line-number-diff-${idx}`}
                  style={{ fontSize: "14px", lineHeight: "20px" }}
                >
                  {idx + 1}
                </p>
              ))}
            </div>

            <div className="w-px h-full bg-border" />

            <pre className="p-4 w-full whitespace-pre-wrap">
              {diffLinesArray.map((lineObj, idx) => (
                <p
                  style={{ fontSize: "14px", lineHeight: "20px" }}
                  key={`diff-line-${idx}`}
                >
                  {lineObj.parts.map((part, pIdx) => {
                    let styles = "";
                    if (part.added) styles = "bg-green-700/40";
                    else if (part.removed) styles = "bg-red-700/40";

                    return (
                      <span key={`part-${idx}-${pIdx}`} className={styles}>
                        {part.text}
                      </span>
                    );
                  })}
                </p>
              ))}
            </pre>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

const useAutosizeTextArea = (
  textAreaRef: RefObject<HTMLTextAreaElement | null>,
  gutterRef: RefObject<HTMLDivElement | null>,
  value: string,
) => {
  useEffect(() => {
    if (textAreaRef.current && gutterRef.current) {
      // 1. Reset the height to 'auto' to ensure it shrinks when text is deleted
      textAreaRef.current.style.height = "auto";
      // gutterRef.current.style.height = "100%";

      // 2. Set the height to the scrollHeight (minimum height needed for all content)
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
      // gutterRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }, [textAreaRef, gutterRef, value]); // Rerun whenever the textarea reference or value changes
};

export const AutoHeightTextArea = ({
  value,
  onChange,
  readonly,
}: {
  value: string;
  readonly?: boolean;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);

  // Call the custom hook
  useAutosizeTextArea(textAreaRef, gutterRef, value);

  const lineNumbers = Array.from(
    { length: value.split("\n").length },
    (_, i) => i + 1,
  );

  const baseFontSize = 14;
  const padding = 8;
  const gutterWidth =
    lineNumbers.length.toString().length * baseFontSize + padding * 2;

  return (
    <div className="w-full h-full relative overflow-auto border rounded-md">
      <div
        className={`absolute bg-slate-100 min-h-full h-max left-0 z-50 py-[8.24px] border-r text-center`}
        style={{
          width: `${gutterWidth}px`,
          paddingLeft: padding,
          paddingRight: padding,
          boxSizing: "border-box",
        }}
      >
        {lineNumbers.map((n, idx) => (
          <p
            key={idx}
            className=""
            style={{
              fontSize: baseFontSize,
              lineHeight: "20px",
            }}
          >
            {n}
          </p>
        ))}
      </div>

      <Textarea
        ref={textAreaRef}
        className={`w-full h-full outline-none shadow-none border-none resize-none overflow-hidden focus-visible:ring-0`}
        value={value}
        style={{
          fontSize: baseFontSize,
          lineHeight: "20px",
          paddingLeft: `${gutterWidth + 12}px`,
        }}
        onChange={onChange}
        readOnly={readonly}
      ></Textarea>
    </div>
  );
};

export default HomeScreen;
