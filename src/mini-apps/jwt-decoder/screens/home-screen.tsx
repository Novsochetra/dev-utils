import { useContext, useState } from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { CopyIcon } from "lucide-react";
import { clsx } from "clsx";
import {
  base64url,
  SignJWT,
  type CompactJWEHeaderParameters,
  type JWTPayload,
} from "jose";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Navbar } from "@/vendor/components/navbar";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/vendor/shadcn/components/ui/tabs";
import { JWTHomeScreenContext } from "../components/jwt-home-screen-context";

const defaultPlaceHolderJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

export const JwtDecoderEncoderScreen = () => {
  const [encoderResult, setEncoderResult] = useState(JSON.stringify({}));
  const [secretValue, setSecretValue] = useState<string>("");
  const [jwtHeader, setJWTHeader] = useState("");
  const [jwtPayload, setJwtPayload] = useState("");

  const [jwtTokenValue, setJwtTokenValue] = useState("");
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [decodedResult, setDecodedResult] = useState(JSON.stringify({}));
  const [resultDecodedHeader, setDecodedResultHeader] = useState("");

  return (
    <JWTHomeScreenContext.Provider
      value={{
        encoderResult,
        secretValue,
        jwtHeader,
        jwtPayload,
        setEncoderResult,
        setSecretValue,
        setJWTHeader,
        setJwtPayload,
        // decoded
        jwtTokenValue,
        isValidToken,
        decodedResult,
        resultDecodedHeader,
        setDecodedResult,
        setDecodedResultHeader,
        setIsValidToken,
        setJwtTokenValue,
      }}
    >
      <div className="min-h-screen w-full flex flex-col">
        <Navbar showBack title="JWT Decoder / Encoder" showSearchBar={false} />

        <div className="flex flex-col items-center justify-center p-8 ">
          <Tabs
            defaultValue="decoder"
            className="w-8/12 p-6 rounded-xl bg-white border"
          >
            <TabsList className="w-full">
              <TabsTrigger value="decoder">Decoder</TabsTrigger>
              <TabsTrigger value="encoder">Encoder</TabsTrigger>
            </TabsList>
            <TabsContent value="decoder" className="pt-4">
              <JwtDecoderTabContent />
            </TabsContent>
            <TabsContent value="encoder" className="pt-4">
              <JwtEncoderTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </JWTHomeScreenContext.Provider>
  );
};

function isValidJSON(input: string) {
  try {
    JSON.parse(input);
    return true;
  } catch (_e) {
    return false;
  }
}

export const JwtEncoderTabContent = () => {
  const {
    encoderResult,
    secretValue,
    jwtHeader,
    jwtPayload,
    setEncoderResult,
    setSecretValue,
    setJWTHeader,
    setJwtPayload,
  } = useContext(JWTHomeScreenContext);

  const processEncryptJWT = async ({
    secret,
    header,
    payload,
  }: {
    secret: string;
    header: string;
    payload: string;
  }) => {
    let formattedHeader: CompactJWEHeaderParameters;
    let formattedPayload: JWTPayload;

    if (isValidJSON(header) && isValidJSON(payload)) {
      formattedHeader = JSON.parse(header) as CompactJWEHeaderParameters;
      formattedPayload = JSON.parse(payload) as JWTPayload;
      const decodedSecret = base64url.decode(secret);

      const jwt = await new SignJWT(formattedPayload)
        .setProtectedHeader(formattedHeader)
        .sign(decodedSecret);

      setEncoderResult(jwt);
    }
  };

  return (
    <div className="flex flex-1 flex-row gap-4">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <Label htmlFor="encoded-tab-header-input">Header</Label>
          <Textarea
            id="encoded-tab-header-input"
            value={jwtHeader}
            className="h-32"
            onChange={(e) => {
              setJWTHeader(e.target.value);
              processEncryptJWT({
                secret: secretValue,
                header: e.target.value,
                payload: jwtPayload,
              });
            }}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Label htmlFor="encoded-tab-payload-input">Payload</Label>
          <Textarea
            id="encoded-tab-payload-input"
            value={jwtPayload}
            className="h-32"
            onChange={(e) => {
              setJwtPayload(e.target.value);
              processEncryptJWT({
                secret: secretValue,
                header: jwtHeader,
                payload: jwtPayload,
              });
            }}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Label htmlFor="encoded-tab-secret-input">Secret</Label>
          <Textarea
            placeholder={"a-string-secret-at-least-256-bits-long"}
            id="encoded-tab-secret-input"
            value={secretValue}
            className="h-full"
            onChange={(e) => {
              setSecretValue(e.target.value);
              processEncryptJWT({
                secret: e.target.value,
                header: jwtHeader,
                payload: jwtPayload,
              });
            }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <Label htmlFor="jwt-input-field">Json Web Token (JWT)</Label>

        <Textarea
          id="jwt-input-field"
          className={clsx("h-full")}
          value={encoderResult ? encoderResult : ""}
          autoFocus
          readOnly
        />
      </div>
    </div>
  );
};

export const JwtDecoderTabContent = () => {
  const {
    jwtTokenValue,
    isValidToken,
    decodedResult,
    resultDecodedHeader,
    setDecodedResult,
    setDecodedResultHeader,
    setIsValidToken,
    setJwtTokenValue,
  } = useContext(JWTHomeScreenContext);

  return (
    <div className="flex flex-1 flex-row gap-4">
      <div className="flex flex-1 flex-col gap-4">
        <Label htmlFor="jwt-input-field">Json Web Token (JWT)</Label>

        <Textarea
          placeholder={defaultPlaceHolderJWT}
          id="jwt-input-field"
          className={clsx(
            "h-full",
            !isValidToken && jwtTokenValue
              ? "border-red-500 focus-visible:ring-red-500/20"
              : "",
            isValidToken && jwtTokenValue
              ? "border-green-500 focus-visible:ring-green-500/20"
              : "",
          )}
          value={jwtTokenValue}
          autoFocus
          onChange={(e) => {
            try {
              const decodedValue = jwtDecode(e.target.value);
              const decodedHeaderValue = jwtDecode(e.target.value, {
                header: true,
              });

              setDecodedResult(JSON.stringify(decodedValue, null, 2));
              setDecodedResultHeader(
                JSON.stringify(decodedHeaderValue, null, 2),
              );
              setIsValidToken(true);
            } catch (_e) {
              console.log("Invalid Token");
              setIsValidToken(false);
            } finally {
              setJwtTokenValue(e.target.value);
            }
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <Label htmlFor="decoded-tab-decoded-header-input">
            Decoded Header
          </Label>
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => {
                navigator.clipboard.writeText(resultDecodedHeader);
                toast.success("Copied to clipboard!");
              }}
            >
              <CopyIcon className="w-4" />
            </Button>
            <Textarea
              id="decoded-tab-decoded-header-input"
              value={jwtTokenValue ? resultDecodedHeader : ""}
              className="h-32"
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Label htmlFor="decoded-tab-decoded-payload-input">
            Decoded Payload
          </Label>
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => {
                navigator.clipboard.writeText(decodedResult);
                toast.success("Copied to clipboard!");
              }}
            >
              <CopyIcon className="w-4" />
            </Button>
            <Textarea
              id="decoded-tab-decoded-payload-input"
              value={jwtTokenValue ? decodedResult : ""}
              className="h-96"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtDecoderEncoderScreen;
