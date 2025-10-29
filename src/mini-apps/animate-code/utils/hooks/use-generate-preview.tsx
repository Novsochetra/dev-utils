import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import html2canvas from "html2canvas-pro";

import { AppState, store } from "../../state/state";

const generateSlidePreview = async (slideData: string) => {
  const div = document.createElement("div");
  div.classList.add("hljs");
  div.style.width = "300px";
  div.style.height = `${(9 * 300) / 16}px`;
  div.innerHTML = `
    <pre style="font-size:12px;white-space:pre-wrap;word-break:break-word;">
      <code>${hljs.highlight(slideData || "", { language: "javascript" }).value}</code>
    </pre>
  `;

  document.body.appendChild(div);
  const canvas = await html2canvas(div, {
    width: 300,
    height: (9 * 300) / 16,
  });
  const base64 = canvas.toDataURL("image/jpeg");
  document.body.removeChild(div);
  return base64;
};

export const useGlobalLazyPreview = (slides: { id: string }[]) => {
  const elementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    console.log("HI");
    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (!id) continue;

            const index = slides.findIndex((s) => s.id === id);
            if (index === -1) continue; // slide removed

            const slideData = store.get(AppState.slides)[index]?.data;
            if (!slideData) continue;

            const base64Preview = await generateSlidePreview(
              store.get(slideData),
            );
            const imagePreviews = store.get(AppState.imagePreviews);
            const imageAtom = imagePreviews[id];
            if (imageAtom) store.set(imageAtom, base64Preview);

            observer.unobserve(entry.target);
            elementsRef.current.delete(id); // remove from map
          }
        }
      },
      { root: null, threshold: 0.1 },
    );

    elementsRef.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [slides]);

  // register and unregister
  const register = (id: string, el: HTMLDivElement | null) => {
    if (el) {
      el.setAttribute("data-id", id);
      elementsRef.current.set(id, el);
    } else {
      elementsRef.current.delete(id); // unmount → remove reference
    }
  };

  return { register };
};
