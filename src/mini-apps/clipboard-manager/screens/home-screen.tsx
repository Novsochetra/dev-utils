import { ClipboardItem } from "./clipboard-manager-item";
import { useClipboardStore } from "./clipboard-store";

export default function ClipboardManagerScreen() {
  const items = useClipboardStore((s) => s.items);
  const togglePin = useClipboardStore((s) => s.togglePin);
  const removeItem = useClipboardStore((s) => s.removeItem);

  // Pinned items first
  const sortedItems = [
    ...items.filter((it) => it.pinned),
    ...items.filter((it) => !it.pinned),
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Clipboard History</h1>

      <div className="grid gap-2">
        {sortedItems.length > 0 ? (
          sortedItems.map((it) => (
            <ClipboardItem
              key={it.id}
              item={it}
              onDelete={removeItem}
              onPinToggle={togglePin}
            />
          ))
        ) : (
          <div className="p-4 text-muted-foreground">No history yet</div>
        )}
      </div>
    </div>
  );
}
