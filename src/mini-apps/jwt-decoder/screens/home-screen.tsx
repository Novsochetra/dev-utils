import { useState } from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { CopyIcon } from "lucide-react";
import { clsx } from "clsx";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Navbar } from "@/vendor/components/navbar";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";

const defaultPlaceHolderJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

export const JwtDecoderEncoderScreen = () => {
  const [jwtValue, setJwtValue] = useState("");
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [result, setResult] = useState(JSON.stringify({}));
  const [resultHeader, setResultHeader] = useState(JSON.stringify({}));

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar showBack title="JWT Decoder / Encoder" showSearchBar={false} />

      <div className="flex flex-col items-center justify-center p-8 ">
        <div className="flex flex-col w-[600px] h-full p-6 rounded-xl border bg-white gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <Label htmlFor="jwt-input-field">Json Web Token (JWT)</Label>

            <Textarea
              placeholder={defaultPlaceHolderJWT}
              id="jwt-input-field"
              value={jwtValue}
              autoFocus
              onChange={(e) => {
                try {
                  const decodedValue = jwtDecode(e.target.value);
                  const decodedHeaderValue = jwtDecode(e.target.value, {
                    header: true,
                  });

                  setResult(JSON.stringify(decodedValue, null, 2));
                  setResultHeader(JSON.stringify(decodedHeaderValue, null, 2));
                  setIsValidToken(true);
                } catch (_e) {
                  console.log("Invalid Token");
                  setIsValidToken(false);
                } finally {
                  setJwtValue(e.target.value);
                }
              }}
              className={clsx(
                "max-h-96 h-32",
                !isValidToken && jwtValue
                  ? "border-red-500 focus-visible:ring-red-500/20"
                  : "",
                isValidToken && jwtValue
                  ? "border-green-500 focus-visible:ring-green-500/20"
                  : "",
              )}
            />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => {
                  navigator.clipboard.writeText(resultHeader);
                  toast.success("Copied to clipboard!");
                }}
              >
                <CopyIcon className="w-4" />
              </Button>
              <Textarea
                placeholder={result}
                id="result-header-field"
                value={resultHeader}
                className="h-32"
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  toast.success("Copied to clipboard!");
                }}
              >
                <CopyIcon className="w-4" />
              </Button>
              <Textarea
                placeholder={result}
                id="result-field"
                value={result}
                className="h-96"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtDecoderEncoderScreen;
