import { useEffect, useState } from "react";
import { diffLines, diffWords, diffChars } from "diff";
import { AnimatePresence } from "framer-motion";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/vendor/shadcn/components/ui/tabs";

import { APP_ID, APP_NAME } from "../utils/constant";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/vendor/shadcn/components/ui/resizable";
import { type PanelGroupProps } from "react-resizable-panels";

const HomeScreen = () => {
  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="min-h-screen w-full flex flex-col">
          <Navbar showBack title={APP_NAME} showSearchBar={false} />

          <div className="flex flex-1 justify-center p-8">
            <DiffChecker />
          </div>
        </div>
      </AnimatedPage>
    </AnimatePresence>
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
  const [left, setLeft] = useState("abc");
  const [right, setRight] = useState("abcdef");
  const [mode, setMode] = useState<SupportDiffMode>("words");
  const [mainDirection, setMainDirection] =
    useState<PanelGroupProps["direction"]>("horizontal");

  const leftLineNumbers = Array.from(
    { length: left.split("\n").length },
    (_, i) => i + 1,
  );
  const rightLineNumbers = Array.from(
    { length: right.split("\n").length },
    (_, i) => i + 1,
  );

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
    <div className="flex flex-col gap-4 flex-1 text-sm">
      <ResizablePanelGroup
        direction="vertical"
        className="flex flex-col gap-3 flex-1 text-sm"
      >
        {/* MODE TABS */}
        <div className="w-full flex justify-center">
          <Tabs
            className="w-full lg:w-fit"
            value={mode}
            onValueChange={(v) => setMode(v as SupportDiffMode)}
          >
            <TabsList className="w-full border rounded-md">
              <TabsTrigger className="w-full lg:w-80" value="chars">
                Char Diff
              </TabsTrigger>
              <TabsTrigger className="w-full lg:w-80" value="words">
                Word Diff
              </TabsTrigger>
              <TabsTrigger className="w-full lg:w-80" value="lines">
                Line Diff
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* INPUT EDITORS WITH LINE NUMBERS */}
        <ResizablePanel
          className="flex flex-1"
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
              className="flex flex-1 border rounded-md relative"
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
              <div className="w-8 text-center py-4 border-r select-none">
                {leftLineNumbers.map((n) => (
                  <div key={n}>{n}</div>
                ))}
              </div>

              <textarea
                className="flex-1 p-4 outline-none resize-none"
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                placeholder="Original text…"
              />
            </ResizablePanel>
            <ResizableHandle
              className="w-0 data-[panel-group-direction=vertical]:h-0"
              withHandle
            />

            {/* RIGHT EDITOR */}
            <ResizablePanel
              className="flex flex-1 border rounded-md relative"
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
              <div className="w-8 text-center py-4 border-r select-none">
                {rightLineNumbers.map((n) => (
                  <div key={n}>{n}</div>
                ))}
              </div>

              <textarea
                className="flex-1 p-4 outline-none resize-none"
                value={right}
                onChange={(e) => setRight(e.target.value)}
                placeholder="Modified text…"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle
          className="w-0 data-[panel-group-direction=vertical]:h-0"
          withHandle
        />

        {/* DIFF OUTPUT */}
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
          <div className="w-8 text-center py-4 border-r select-none">
            {diffLinesArray.map((_, idx) => (
              <div key={`line-number-diff-${idx}`}>{idx + 1}</div>
            ))}
          </div>

          <pre className="p-4 w-full whitespace-pre-wrap">
            {diffLinesArray.map((lineObj, idx) => (
              <div key={`diff-line-${idx}`}>
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
              </div>
            ))}
          </pre>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default HomeScreen;
