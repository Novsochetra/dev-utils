import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling, { type Options } from "qr-code-styling";

import { Navbar } from "@/vendor/components/navbar";
import { Separator } from "@/vendor/shadcn/components/ui/separator";

import { BackgroundOptionsView } from "../components/background-options-view";
import { CornerDotOptionsView } from "../components/corner-dots-options-view";
import { CornerSquareOptionsView } from "../components/corner-square-options-view";
import { ImageOptionsView } from "../components/image-options-view";
import { MainOptionsView } from "../components/main-options-view";
import { QRDotOptionsView } from "../components/qr-dot-options-view";
import { QROptionsView } from "../components/qr-options-view";
import { QRCodeContext } from "../components/qr-code-context";
import { DownloadButton } from "../components/download-button";
import { DownloadSelectOptions } from "../components/download-select-options";

import { defaultOptions } from "../utils/constants";

const QRCodeGeneratorScreen = () => {
  const [options, setOptions] = useState<Options>(defaultOptions);
  const ref = useRef<HTMLDivElement | null>(null);
  const [allowedDownloadExtension, setAllowedDownloadExtension] = useState<
    "png" | "svg"
  >("png");
  const qrCodeInstance = useMemo(() => {
    return new QRCodeStyling(defaultOptions);
  }, []);

  const loadQRCode = useCallback(
    async (opt: Options) => {
      qrCodeInstance.update(opt);
      if (ref.current) {
        qrCodeInstance.append(ref.current);
      }
    },
    [qrCodeInstance],
  );

  useEffect(() => {
    const qrCodeDiv = ref.current;

    if (qrCodeDiv) {
      qrCodeDiv.innerHTML = "";
      loadQRCode(options);
    }

    return () => {
      if (qrCodeDiv) {
        qrCodeDiv.innerHTML = "";
      }
    };
  }, [options, qrCodeInstance, loadQRCode]);

  return (
    <QRCodeContext.Provider value={{ options, setOptions }}>
      <div className="min-h-screen w-full flex flex-col">
        <Navbar showBack title="QR Code Generator" showSearchBar={false} />

        <div className="flex flex-col items-center justify-center p-8 ">
          <div className="w-[600px] h-full p-6 rounded-xl border bg-white gap-2">
            <div className="flex flex-1 flex-col items-center justify-center mb-8 p-4 gap-4">
              <div className="rounded-2xl overflow-hidden">
                <div ref={ref} />
              </div>

              <div className="flex flex-1 justify-center gap-2">
                <DownloadButton
                  onClick={() => {
                    qrCodeInstance.download({
                      name: "dev-tools-qr-generator",
                      extension: allowedDownloadExtension,
                    });
                  }}
                />

                <DownloadSelectOptions
                  onValueChange={(v) => setAllowedDownloadExtension(v)}
                />
              </div>
            </div>

            <MainOptionsView />
            <Separator className="my-4" />
            <QRDotOptionsView />
            <Separator className="my-4" />
            <CornerSquareOptionsView />
            <Separator className="my-4" />
            <CornerDotOptionsView />
            <Separator className="my-4" />
            <BackgroundOptionsView />
            <Separator className="my-4" />
            <ImageOptionsView />
            <Separator className="my-4" />
            <QROptionsView />
          </div>
        </div>
      </div>
    </QRCodeContext.Provider>
  );
};

export default QRCodeGeneratorScreen;
