import Color from "colorjs.io";

export function convertColor(input: string) {
  try {
    // Fix "none" in hsl if present
    const fixed = input.replace("none", "0");

    const color = new Color(fixed);
    const typeColor = getTypeColor(fixed);

    return {
      hex:
        typeColor === "hex"
          ? ""
          : color.to("sRGB").toString({ format: "hex", precision: 6 }),
      rgb:
        typeColor === "rgb"
          ? ""
          : color.to("sRGB").toString({ format: "rgb", precision: 6 }),
      hsl:
        typeColor === "hsl"
          ? ""
          : color.to("hsl").toString({ format: "hsl", precision: 6 }),
      oklch:
        typeColor === "oklch"
          ? ""
          : color.to("oklch").toString({ precision: 6 }),
      lch:
        typeColor === "lch" ? "" : color.to("lch").toString({ precision: 6 }),
    };
  } catch (_e) {
    return {
      hex: "",
      rgb: "",
      hsl: "",
      oklch: "",
      lch: "",
    };
  }
}

export function getTypeColor(input: string) {
  try {
    let inputFormat = null;
    if (input.trim().startsWith("#")) inputFormat = "hex";
    else if (input.toLowerCase().startsWith("rgb")) inputFormat = "rgb";
    else if (input.toLowerCase().startsWith("hsl")) inputFormat = "hsl";
    else if (input.toLowerCase().startsWith("oklch")) inputFormat = "oklch";
    else if (input.toLowerCase().startsWith("lch")) inputFormat = "lch";

    return inputFormat;
  } catch (e) {
    return null;
  }
}
