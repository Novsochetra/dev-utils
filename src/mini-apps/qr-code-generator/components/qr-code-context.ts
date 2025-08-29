import { createContext } from "react";
import type { Options } from "qr-code-styling";

export const QRCodeContext = createContext<{
  options: Options;
  setOptions: React.Dispatch<React.SetStateAction<Options>>;
}>({
  options: {
    type: "svg",
    width: 200,
    height: 200,
    data: "QR Code Generator",
    image: undefined,
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
      color: "red",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "red",
    },
    cornersDotOptions: {
      color: "red",
    },
    backgroundOptions: {
      color: "white",
    },
  },
  setOptions: () => {},
});
