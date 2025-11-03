import { memo } from "react";

export const ShortCuts = memo(
  ({ keys, label }: { keys: string[]; label?: string }) => {
    return (
      <div className="flex flex-1 items-center justify-center gap-8">
        <div className="flex items-center space-x-1 text-xs shrink grow-0 overflow-hidden">
          {keys.map((key, i) => (
            <kbd
              key={i}
              className="px-1 py-0.5 rounded border bg-gray-100 flex-shrink-0"
            >
              {key}
            </kbd>
          ))}
          {label ? <span className="truncate">{label}</span> : null}
        </div>
      </div>
    );
  },
);
