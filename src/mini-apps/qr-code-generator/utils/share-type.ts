export const QrDotOptionColorType = {
  Single: "single-color",
  Gradient: "gradient-color",
} as const;

export type QrDotOptionColorType =
  (typeof QrDotOptionColorType)[keyof typeof QrDotOptionColorType];

export const GradientType = {
  Linear: "linear",
  Radial: "radial",
} as const;

export type GradientType = (typeof GradientType)[keyof typeof GradientType];
