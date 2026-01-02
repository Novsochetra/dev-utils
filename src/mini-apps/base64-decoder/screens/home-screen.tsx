import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { Label } from "@/vendor/shadcn/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/vendor/shadcn/components/ui/tabs";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { useAppStore } from "@/main-app/state";

import { Base64DecoderEncoderLeftToolbar } from "./components/toolbar/left-toolbar";
import { decoder } from "../utils/decoder";
import { encoder } from "../utils/encoder";
import { APP_ID } from "../utils/constant";


export const Base64EncoderDecoderScreen = () => {
  const setRightMenubar = useAppStore((state) => state.setRightMenubar);
  const setLeftMenubar = useAppStore((state) => state.setLeftMenubar);
  const navigate = useNavigate();

  useHotkeys(
    "Escape",
    () => {
      navigate("/");
    },
    { enableOnFormTags: true }
  );

  useEffect(() => {
    setRightMenubar(null);
    setLeftMenubar(<Base64DecoderEncoderLeftToolbar />);

    return () => {
      setRightMenubar(null);
      setLeftMenubar(null);
    };
  }, []);
  
  return (
    <div className="flex flex-1 min-h-0 overflow-auto">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col">
          <div className="p-4">
            <Tabs
              defaultValue="decoder"
              className="flex w-full rounded-xl items-center"
            >
              <TabsList className="w-full sm:w-80 flex justify-center">
                <TabsTrigger value="decoder">Decoder</TabsTrigger>
                <TabsTrigger value="encoder">Encoder</TabsTrigger>
              </TabsList>
              <TabsContent className="w-full" value="decoder">
                <DecodedTabContent />
              </TabsContent>
              <TabsContent className="w-full" value="encoder">
                <EncodedTabContent />
              </TabsContent>
            </Tabs>
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};

export const DecodedTabContent = () => {
  const [base64Text, setBase64Text] = useState("");

  return (
    <Fragment>
      <Label className="my-4" htmlFor="base64Input">
        Base64
      </Label>
      <Textarea
        placeholder="paste here"
        id="base64Input"
        value={base64Text}
        onChange={(e) => setBase64Text(e.target.value)}
        className="h-32"
      />
      <Label className="my-4" htmlFor="base64Input">
        Result
      </Label>
      <Textarea
        placeholder=""
        id="base64Input"
        value={decoder(base64Text)}
        readOnly
        className="h-32"
      />

      <Button
        className="mt-4 w-full"
        onClick={() => {
          navigator.clipboard.writeText(decoder(base64Text));
          toast.success("Copied to clipboard!");
        }}
      >
        Copy
      </Button>
    </Fragment>
  );
};

export const EncodedTabContent = () => {
  const [text, setText] = useState("");

  return (
    <Fragment>
      <Label className="my-4" htmlFor="base64Input">
        Text to encode
      </Label>
      <Textarea
        className="h-32"
        placeholder="paste here"
        id="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Label className="my-4">Result</Label>
      <Textarea className="h-32" value={encoder(text)} readOnly />

      <Button
        className="mt-4 w-full"
        onClick={() => {
          navigator.clipboard.writeText(encoder(text));
          toast.success("Copied to clipboard!");
        }}
      >
        Copy
      </Button>
    </Fragment>
  );
};

export default Base64EncoderDecoderScreen;
