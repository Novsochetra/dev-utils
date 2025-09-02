import { createContext, type Dispatch, type SetStateAction } from "react";

function noob() {}

export const JWTHomeScreenContext = createContext<{
  encoderResult: string;
  secretValue: string;
  jwtHeader: string;
  jwtPayload: string;
  setEncoderResult: Dispatch<SetStateAction<string>>;
  setSecretValue: Dispatch<SetStateAction<string>>;
  setJWTHeader: Dispatch<SetStateAction<string>>;
  setJwtPayload: Dispatch<SetStateAction<string>>;
  // decoded
  jwtTokenValue: string;
  isValidToken: boolean | null;
  decodedResult: string;
  resultDecodedHeader: string;
  setDecodedResult: Dispatch<SetStateAction<string>>;
  setDecodedResultHeader: Dispatch<SetStateAction<string>>;
  setIsValidToken: Dispatch<SetStateAction<boolean | null>>;
  setJwtTokenValue: Dispatch<SetStateAction<string>>;
}>({
  encoderResult: "",
  secretValue: "",
  jwtHeader: "",
  jwtPayload: "",
  setEncoderResult: noob,
  setSecretValue: noob,
  setJWTHeader: noob,
  setJwtPayload: noob,
  // decoded
  jwtTokenValue: "",
  isValidToken: null,
  decodedResult: "",
  resultDecodedHeader: "",
  setDecodedResult: noob,
  setDecodedResultHeader: noob,
  setIsValidToken: noob,
  setJwtTokenValue: noob,
});
