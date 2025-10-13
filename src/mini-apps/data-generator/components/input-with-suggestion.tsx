// MARK: refactor this file
import React, { useState, useRef, useEffect, useMemo, Fragment } from "react";
import Fuse from "fuse.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/vendor/shadcn/components/ui/popover";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import { availableFakerPaths } from "../utils/faker";

type SectionData = {
  label: string;
  value: string;
  data: Array<{ label: string; value: string }>;
}[];

type GroupSectionDataByKey = Record<
  string,
  {
    label: string;
    value: string;
    data: Array<{ label: string; value: string }>;
  }
>;

const data: SectionData = [];
const groups: {
  [key: string]: string[];
} = {};

availableFakerPaths.forEach((v) => {
  const key = v.split(".")[0];
  if (!groups[key]?.length) groups[key] = [];

  groups[key].push(v);
});

Object.entries(groups).map(([groupHeader, fieldValues], index) => {
  data[index] = {
    label: groupHeader as string,
    value: groupHeader as string,
    data: fieldValues.map((v) => ({ label: v, value: v })),
  };
});

export const InputWithSuggestion = ({
  placeholder,
  onChange,
  value,
  onBlur,
  ref,
  className,
  disabled,
}: {
  value: string;
  ref: React.Ref<HTMLInputElement>;
  onChange: (value: string) => void;
} & Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "disabled" | "placeholder" | "onBlur" | "className"
>) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Flatten data for Fuse.js
  const items = useMemo(
    () =>
      data.flatMap((section) =>
        section.data.map((item) => ({
          ...item,
          sectionLabel: section.label,
          sectionValue: section.value,
        })),
      ),
    [],
  );

  // Fuse search
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ["label", "value"],
      threshold: 0.3,
    });
  }, [items]);

  // Filtered items grouped by section
  const filtered = useMemo(() => {
    if (!query) return data;

    const results = fuse.search(query).map((r) => r.item);

    // group back into sections
    const groupedResults = results.reduce((acc, item) => {
      const sectionKey = item.sectionValue as string;
      if (!acc[sectionKey]) {
        acc[sectionKey] = {
          label: item.sectionLabel,
          value: item.sectionValue,
          data: [],
        };
      }

      acc[sectionKey].data.push(item);

      return acc;
    }, {} as GroupSectionDataByKey);

    return Object.values(groupedResults);
  }, [query, fuse]);

  // Flatten visible items for navigation
  const visibleItems = useMemo(
    () => filtered.flatMap((section) => section.data ?? []),
    [filtered],
  );

  // Scroll active item into view
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    if (itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex, filtered]);

  // Arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!visibleItems.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % visibleItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? visibleItems.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        const item = visibleItems[activeIndex];
        setQuery(item.label);
        setActiveIndex(-1);
        onChange?.(item.label);
        setOpen(false);
      }
    }
  };

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <div className="w-[320px]">
          <Input
            ref={ref}
            placeholder={placeholder}
            className={className}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              console.log("V: ", e.target.value);
              onChange?.(e.target.value);
            }}
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
            onBlur={(e) => {
              setOpen(false);
              onBlur?.(e);
            }}
            disabled={disabled}
            onKeyDown={handleKeyDown}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[320px] mt-2 p-2 border-2 rounded-xl overflow-hidden"
      >
        <div className="h-40 overflow-y-scroll">
          {filtered.map((section, index) => {
            return (
              <Fragment key={`section-${index}`}>
                <div>
                  <div className="text-muted-foreground overflow-hidden p-1 px-2 py-1.5 text-xs font-medium">
                    {section.label}
                  </div>

                  {section.data?.map((item, itemIdx: number) => {
                    const flatIndex = visibleItems.findIndex(
                      (i) => i.value === item.value,
                    );

                    return (
                      <div
                        ref={(el) => {
                          itemRefs.current[flatIndex] = el;
                        }}
                        key={`section-item-${index}-${itemIdx}`}
                        className={`h-8 px-4 flex items-center text-sm cursor-pointer outline-none rounded-md ${
                          flatIndex === activeIndex
                            ? "bg-accent text-accent-foreground"
                            : ""
                        } hover:bg-slate-100`}
                        onKeyDown={() => {
                          onChange?.(item.label);

                          setQuery(item.label);
                          setOpen(false);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onChange?.(item.label);
                          setQuery(item.label);
                          setOpen(false);
                        }}
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
                {index < filtered.length - 1 ? (
                  <Separator className="mt-2" />
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
