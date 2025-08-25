
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { Label } from "@/vendor/shadcn/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/vendor/shadcn/components/ui/tabs";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";
import { Navbar } from "@/vendor/components/navbar";

export const UrlEncoderDecoderScreen = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar showBack title="URL encoder/decoder" showSearchBar={false} />
      <div className="flex flex-col items-center justify-center p-8 ">

        <Tabs
          defaultValue="decoder"
          className="w-[400px] p-6 rounded-xl bg-white border"
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
      <Label className="my-4">
        Result
      </Label>
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
      <Label className="my-4" >Result</Label>
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
