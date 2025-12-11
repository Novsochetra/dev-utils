export function ClipboardItem({ item, onDelete, onPinToggle }) {
  const handleCopy = async () => {
    // if (item.type === "text") await writeText(item.content);
    // if (item.type === "image") await writeImage(item.content);
  };

  return (
    <div className="p-3 flex justify-between items-start">
      <div className="p-0 text-sm text-muted-foreground w-full">
        {item.type === "text" ? (
          <div className="whitespace-pre-wrap">{item.content}</div>
        ) : (
          <img
            src={item.content}
            alt="clipboard"
            className="max-h-40 w-auto rounded"
          />
        )}
        <div className="text-xs text-muted-foreground mt-2">
          {item.createdAt}
        </div>
      </div>
    </div>
  );
}
