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
import { decoder } from "../utils/decoder";
import { encoder } from "../utils/encoder";

export const Base64EncoderDecoderScreen = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar showBack title="Base64 encoder/decoder" showSearchBar={false} />
      <div className="flex flex-col items-center justify-center p-8 ">
        <Tabs
          defaultValue="decoder"
          className="w-full lg:w-8/12 p-6 rounded-xl bg-white border"
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
