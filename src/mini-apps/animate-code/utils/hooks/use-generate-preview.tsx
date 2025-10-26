import("highlight.js/lib/common");
import "highlight.js/styles/atom-one-dark.css"; // any theme
import { useEffect, useState } from "react";
import hljs from "highlight.js/lib/core";
import html2canvas from "html2canvas-pro";

type Props = {
  slides: { id: string; data: string }[];
};

export const useGeneratePreview = ({ slides }: Props) => {
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    async function generateAllPreviews() {
      const hiddenContainer = document.createElement("div");
      hiddenContainer.style.position = "fixed";
      hiddenContainer.style.top = "-9999px";
      hiddenContainer.style.left = "-9999px";
      hiddenContainer.style.width = "400px";
      hiddenContainer.style.height = "225px";
      hiddenContainer.style.pointerEvents = "none";

      document.body.appendChild(hiddenContainer);

      for (let i = 0; i < slides.length; i++) {
        const div = document.createElement("div");

        div.classList.add("hljs");
        div.style.width = "600px";
        div.style.height = "337.5px";

        const highlighted = hljs.highlight(slides[i].data || "", {
          language: "javascript",
        });

        // Dynamically render your CodeEditorWithHighlight inside the offscreen div
        const preTagNode = `<pre
        ref={preRef}
        aria-hidden="true"
        className="relative w-[600px] h-[337.5px] inset-0 text-base font-mono hljs border-2 border-red-500 rounded-lg p-3 overflow-auto"
        style={{
          fontSize: 12,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <code>
          ${highlighted.value}
        </code>
      </pre>
        `;

        div.innerHTML = preTagNode;

        hiddenContainer.appendChild(div);

        const canvasWidth = 600;
        const canvas = await html2canvas(div, {});
        const tempCanvas = document.createElement("canvas");

        const resizedCanvasWidth = 200;
        tempCanvas.width = resizedCanvasWidth;
        tempCanvas.height = (9 * canvasWidth) / 16;
        const ctx = tempCanvas.getContext("2d");

        ctx?.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

        const base64Image = tempCanvas.toDataURL("image/jpeg");
        setImagePreviews((prev) => ({ ...prev, [`${i}`]: base64Image }));
      }

      document.body.removeChild(hiddenContainer);
    }

    generateAllPreviews();
  }, []);

  return {
    imagePreviews,
    setImagePreviews,
  };
};
