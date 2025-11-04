export const isApplePlatform = () => {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
};

export function measureFontMetrics(
  fontSize: number,
  fontFamily = "'JetBrains Mono', monospace",
) {
  const span = document.createElement("span");
  span.style.fontFamily = fontFamily;
  span.style.fontSize = `${fontSize}px`;
  span.style.position = "absolute";
  span.style.visibility = "hidden";
  span.textContent = "M"; // wide character
  document.body.appendChild(span);

  // INFO: kinda hack value to make the font spacing a bit better
  const fontMetricCorrection = 0.4;

  const charWidth = span.offsetWidth + fontMetricCorrection;
  const lineHeight = span.offsetHeight;
  document.body.removeChild(span);
  return { charWidth, lineHeight };
}
