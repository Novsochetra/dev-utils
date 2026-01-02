import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";
import { AnimatePresence } from "framer-motion";

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
import { APP_BASE_PATH } from "../utils/constants";
import { URLEncoderDecoderLeftToolbar } from "./components/toolbar/left-toolbar";

export const UrlEncoderDecoderScreen = () => {
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
    setLeftMenubar(<URLEncoderDecoderLeftToolbar />);

    return () => {
      setRightMenubar(null);
      setLeftMenubar(null);
    };
  }, []);

  return (
    <div className="flex flex-1 min-h-0 overflow-auto">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_BASE_PATH} classname="flex flex-1 flex-col">
          <div className="p-8">
            <Tabs
              defaultValue="decoder"
              className="w-full p-6 rounded-xl bg-white border"
            >
              <TabsList className="w-full">
                <TabsTrigger value="decoder">Decoder</TabsTrigger>
                <TabsTrigger value="encoder">Encoder</TabsTrigger>
              </TabsList>
              <TabsContent value="decoder">
                <DecodedTabContent />
              </TabsContent>
              <TabsContent value="encoder">
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
  const [urlText, setURLText] = useState("");

  return (
    <Fragment>
      <Label className="my-4" htmlFor="urlTextInput">
        URL
      </Label>
      <Textarea
        placeholder="paste here"
        id="urlTextInput"
        value={urlText}
        onChange={(e) => setURLText(e.target.value)}
        className="h-32"
      />
      <Label className="my-4">Result</Label>
      <Textarea
        placeholder=""
        value={decodeURIComponent(urlText)}
        readOnly
        className="h-32"
      />

      <Button
        className="mt-4 w-full"
        onClick={() => {
          navigator.clipboard.writeText(decodeURIComponent(urlText));
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
      <Label className="my-4" htmlFor="urlEncodedText">
        URL to encode
      </Label>
      <Textarea
        className="h-32"
        placeholder="paste here"
        id="urlEncodedText"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Label className="my-4">Result</Label>
      <Textarea className="h-32" value={encodeURIComponent(text)} readOnly />

      <Button
        className="mt-4 w-full"
        onClick={() => {
          navigator.clipboard.writeText(encodeURIComponent(text));
          toast.success("Copied to clipboard!");
        }}
      >
        Copy
      </Button>
    </Fragment>
  );
};

export default UrlEncoderDecoderScreen;
