export const BrowserPreview = ({ code }: { code: string }) => {
  return (
    <div className="flex flex-1 rounded-lg select-none border-2 border-zinc-500 max-h-full aspect-video">
      <iframe
        className="w-full h-full bg-white"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={code}
      />
    </div>
  );
};
