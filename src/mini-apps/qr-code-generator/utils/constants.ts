import type { Gradient, Options } from "qr-code-styling";

export const defaultDotOptionsGradientColor: Gradient = {
  type: "linear",
  rotation: 0,
  colorStops: [
    {
      offset: 0,
      color: "#ec0d0d",
    },
    {
      offset: 1,
      color: "#339b33",
    },
  ],
};

export const defaultImageSize: Options["imageOptions"] = {
  saveAsBlob: true,
  crossOrigin: undefined,
  hideBackgroundDots: true,
  imageSize: 0.4,
  margin: 0,
};

export const defaultOptions: Options = {
  type: "svg",
  width: 200,
  height: 200,
  data: "QR Code Generator",
  image: undefined,
  margin: 8,
  qrOptions: {
    typeNumber: 0,
    mode: "Byte",
    errorCorrectionLevel: "Q",
  },
  imageOptions: {
    saveAsBlob: true,
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
  },
  dotsOptions: {
    type: "extra-rounded",
    color: "#45556c",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#45556c",
  },
  cornersDotOptions: {
    color: "#45556c",
  },
  backgroundOptions: {
    color: "#f1f5f9",
  },
};

export const ALLOW_MAX_LOGO_UPLOAD_SIZE_IN_BYTES = 5 * 1024 * 1024;
