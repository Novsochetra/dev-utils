// this working as expected the input => output
// the only problem is don't have animation yet

import React, { useEffect, useState } from "react";
import { Parser, Language } from "web-tree-sitter";

interface AnimateSlideProps {
  code: string;
  prevCode?: string;
}

export default function AnimateSlide({ code, prevCode }: AnimateSlideProps) {
  const [htmlOutput, setHtmlOutput] = useState("");

  useEffect(() => {
    (async () => {
      await Parser.init({ locateFile: () => "/tree-sitter.wasm" });
      const parser = new Parser();

      const Lang = await Language.load("/tree-sitter-html.wasm");

      if (Lang.version) {
        parser.setLanguage(Lang);

        const tree = parser.parse(`<div><p>Hello</p></div>`);
        console.log(tree.rootNode.toString());

        // 5️⃣ Slice original source using rootNode indices
        const exactHTML = code.slice(
          tree.rootNode.startIndex,
          tree.rootNode.endIndex,
        );

        // 6️⃣ Set state to render
        setHtmlOutput(exactHTML);
      }
    })();
  }, [code]); // re-run effect when code changes

  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
        padding: "16px",
        background: "#1e1e1e",
        color: "#d4d4d4",
        borderRadius: "8px",
      }}
    >
      {htmlOutput}
    </pre>
  );
}
