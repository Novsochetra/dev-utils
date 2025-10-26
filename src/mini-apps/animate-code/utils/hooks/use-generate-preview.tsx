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
      hiddenContainer.style.pointerEvents = "none";
      document.body.appendChild(hiddenContainer);

      const previewWidth = 300;
      const previewHeight = (9 * previewWidth) / 16; // 16:9 aspect ratio

      for (const slide of slides) {
        const div = document.createElement("div");
        div.classList.add("hljs");
        div.style.width = `${previewWidth}px`;
        div.style.height = `${previewHeight}px`;

        const highlighted = hljs.highlight(slide.data || "", {
          language: "javascript",
        });

        div.innerHTML = `
      <pre
        class="relative w-[${previewWidth}px] h-[${previewHeight}px] inset-0 text-base font-mono hljs rounded-lg p-3 overflow-auto"
        style="font-size:12px;white-space:pre-wrap;word-break:break-word;"
      >
        <code>${highlighted.value}</code>
      </pre>
    `;

        hiddenContainer.appendChild(div);

        const canvas = await html2canvas(div, {
          width: previewWidth,
          height: previewHeight,
        });

        const base64Image = canvas.toDataURL("image/jpeg");
        setImagePreviews((prev) => ({ ...prev, [slide.id]: base64Image }));
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
