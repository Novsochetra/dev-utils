export const createPreviewImage = async (slideData: string) => {
  if (!document) {
    return;
  }

  const previewWidth = 300;
  const previewHeight = (9 * previewWidth) / 16;

  const div = document.createElement("div");
  div.classList.add("hljs");
  div.style.width = `${previewWidth}px`;
  div.style.height = `${previewHeight}px`;

  const highlighted = hljs.highlight(slideData || "", {
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

  document.body.appendChild(div);

  const canvas = await html2canvas(div, {
    width: previewWidth,
    height: previewHeight,
  });

  const res = canvas.toDataURL("image/jpeg");
  document.body.removeChild(div);

  return res;
};
