import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";

import { useAppStore } from "@/main-app/state";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/vendor/shadcn/components/ui/table";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";
import { Separator } from "@/vendor/shadcn/components/ui/separator";

import { APP_ID } from "../utils/constant";
import { CssColorConverterLeftToolbar } from "../components/toolbar/left-toolbar";

export const CssColorConverterScreen = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g"); // default global
  const [testString, setTestString] = useState("");

  const matchData = useMemo(() => {
    try {
      const effectiveFlags = flags.includes("g") ? flags : flags + "g";
      const regex = new RegExp(pattern, effectiveFlags);
      const matches = [...testString.matchAll(regex)];

      const res = matches
        .map((match, matchIndex) => ({
          matchNumber: matchIndex + 1,
          fullMatch: match[0],
          groups: match.slice(1).map((value, groupIndex) => ({
            number: groupIndex + 1,
            value: value || "(empty)",
          })),
        }))
        ?.filter((m) => m.groups?.length);

      return res;
    } catch (e) {
      return [];
    }
  }, [pattern, flags, testString]);

  const highlightedText = useMemo(() => {
    try {
      // INFO: matchAll REQUIRES the "g" flag.
      // If it's missing, we need to add it or use a different method.
      const effectiveFlags = flags.includes("g") ? flags : flags + "g";
      const regex = new RegExp(pattern, effectiveFlags);

      let lastIndex = 0;
      const segments = [];
      const matches = [...testString.matchAll(regex)];

      matches.forEach((match, i) => {
        const matchIndex = match.index;
        const matchText = match[0];

        if (matchIndex > lastIndex) {
          segments.push({
            text: testString.slice(lastIndex, matchIndex),
            isMatch: false,
          });
        }

        segments.push({
          text: matchText,
          isMatch: true,
          index: i,
        });

        lastIndex = matchIndex + matchText.length;
      });

      if (lastIndex < testString.length) {
        segments.push({
          text: testString.slice(lastIndex),
          isMatch: false,
        });
      }

      return segments?.filter((s) => s.text);
    } catch (error) {
      return [{ text: testString, isMatch: false }];
    }
  }, [pattern, flags, testString]);

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

    setLeftMenubar(<CssColorConverterLeftToolbar />);

    return () => {
      setRightMenubar(null);
      setLeftMenubar(null);
    };
  }, []);

  return (
    <div className="flex flex-1 min-h-0">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 flex-col min-h-0 min-w-0 p-4 overflow-y-auto gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Regex pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                autoCapitalize="off"
                spellCheck="false"
                autoCorrect="off"
              />
              <Input
                type="text"
                placeholder="Flags (e.g., g, i, m)"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                autoCapitalize="off"
                spellCheck="false"
                autoCorrect="off"
              />
            </div>

            <div>
              <Textarea
                placeholder="Test string"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                rows={6}
                autoCapitalize="off"
                spellCheck="false"
                autoCorrect="off"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md min-h-[100px] whitespace-pre-wrap break-all">
                <div className="h-9 flex items-center px-3">
                  <h4 className="font-semibold">Matches</h4>
                </div>
                <Separator />

                <div className="p-3">
                  {highlightedText.map((segment, i) =>
                    segment.isMatch ? (
                      <mark
                        key={i}
                        className="bg-yellow-300 rounded px-0.5 border border-yellow-500"
                      >
                        {segment.text}
                      </mark>
                    ) : (
                      <span key={i}>{segment.text}</span>
                    )
                  )}
                </div>
              </div>

              <div className="border rounded-md min-h-[100px]">
                <div className="h-9 flex items-center px-3">
                  <h4 className="font-semibold">Matches</h4>
                </div>

                <Separator />

                <div className="p-3">
                  {matchData.length === 0 ? (
                    <p className="text-gray-400">No matches found</p>
                  ) : (
                    <div className="space-y-4">
                      {matchData?.map((m) => (
                        <div
                          key={m.matchNumber}
                          className="bg-white border rounded p-2 shadow-sm"
                        >
                          <div className="text-xs font-bold text-blue-500 uppercase mb-1">
                            Match {m.matchNumber}
                          </div>

                          {m.groups.length === 0 ? (
                            <p className="text-xs text-gray-400">
                              No groups in this match
                            </p>
                          ) : (
                            <ul className="space-y-1">
                              {m.groups
                                ?.filter((g) => g.value)
                                ?.map((g) => (
                                  <li
                                    key={g.number}
                                    className="text-sm flex gap-2"
                                  >
                                    <span className="text-gray-500">
                                      {g.number}:
                                    </span>
                                    <span className="text-foreground px-1 rounded">
                                      {g.value}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <FlagsReference />

            <Reference />
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};

export const Reference = () => {
  const regexHelp = [
    ["[abc]", "A single character of: a, b, or c"],
    ["[^abc]", "Any single character except: a, b, or c"],
    ["[a-z]", "Any single character in the range a-z"],
    ["[a-zA-Z]", "Any single character in the range a-z or A-Z"],
    ["^", "Start of line"],
    ["$", "End of line"],
    ["\\A", "Start of string"],
    ["\\z", "End of string"],
    [".", "Any single character"],
    ["\\s", "Any whitespace character"],
    ["\\S", "Any non-whitespace character"],
    ["\\d", "Any digit"],
    ["\\D", "Any non-digit"],
    ["\\w", "Any word character (letter, number, underscore)"],
    ["\\W", "Any non-word character"],
    ["\\b", "Any word boundary"],
    ["(...)", "Capture everything enclosed"],
    ["(a|b)", "a or b"],
    ["a?", "Zero or one of a"],
    ["a*", "Zero or more of a"],
    ["a+", "One or more of a"],
    ["a{3}", "Exactly 3 of a"],
    ["a{3,}", "3 or more of a"],
    ["a{3,6}", "Between 3 and 6 of a"],
  ];

  return (
    <div className="">
      <h4 className="font-semibold mb-4">Regex Reference</h4>
      <div className="overflow-x-auto border rounded-lg">
        <Table className="border-collapse overflow-hidden border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="border font-bold">Pattern</TableHead>
              <TableHead className="border font-bold">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regexHelp.map(([p, desc], i) => (
              <TableRow key={i}>
                <TableCell className="border">{p}</TableCell>
                <TableCell className="border">{desc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const FlagsReference = () => {
  const flagsData = [
    ["g", "global", "Global search. Finds all matches rather than stopping after the first."],
    ["m", "multiline", "Makes ^ and $ match the start/end of each line."],
    ["i", "ignoreCase", "Case-insensitive search (e.g., /A/i matches 'a')."],
    ["s", "dotAll", "Allows . to match newline characters."],
    ["d", "hasIndices", "Generate indices for substring matches (match.indices)."],
    ["u", "unicode", "Treats pattern as a sequence of Unicode code points."],
    ["v", "unicodeSets", "An upgrade to 'u' mode with more Unicode features."],
    ["y", "sticky", "Matches only from the index indicated by lastIndex."],
  ];

  return (
    <div className="">
      <h4 className="font-semibold mb-4">Flags Reference</h4>
      <div className="overflow-x-auto border rounded-lg">
        <Table className="border-collapse overflow-hidden border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="border font-bold w-[80px]">Flag</TableHead>
              <TableHead className="border font-bold">Property</TableHead>
              <TableHead className="border font-bold">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flagsData.map(([flag, prop, desc], i) => (
              <TableRow key={i}>
                <TableCell className="border font-mono text-blue-600 font-bold">
                  {flag}
                </TableCell>
                <TableCell className="border text-gray-500 italic">
                  {prop}
                </TableCell>
                <TableCell className="border">{desc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CssColorConverterScreen;
