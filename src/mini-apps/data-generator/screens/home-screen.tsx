import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { clsx } from "clsx";
import { InputWithSuggestion } from "../components/input-with-suggestion";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";
import { APP_ID, APP_NAME } from "../utils/constant";
import { callFakerPath } from "../utils/faker";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { Input } from "@/vendor/shadcn/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/vendor/shadcn/components/ui/select";
import { Plus, TrashIcon } from "lucide-react";

type FieldConfig = {
  key: string;
} & (
  | {
      type:
        | typeof SupportDataType.String
        | typeof SupportDataType.Number
        | typeof SupportDataType.Date;
      value: string; // MARK: need to proper type typeof availableFakerPaths;
    }
  | {
      type: typeof SupportDataType.Array;
      amount: number;
      children?: FieldConfig[];
    }
  | {
      type: typeof SupportDataType.Map;
      amount: number;
      children?: Record<string, FieldConfig>;
    }
);

type FormValues = {
  fields: FieldConfig[];
};

const DataGeneratorScreen = () => {
  const [generatedData, setGeneratedData] = useState({});
  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      fields: [
        {
          key: "",
          type: "string",
        },
      ],
    },
  });

  const handleGenerate = (data: FormValues) => {
    const schema: FieldConfig = data.fields[0];

    const generated = {
      [callFakerPath(schema.key)]: generateFromSchema(schema),
    };

    setGeneratedData(generated);
  };

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="min-h-screen w-full flex flex-col">
          <Navbar showBack title={APP_NAME} showSearchBar={false} />
          <div className="flex flex-1 flex-col items-center justify-center p-8 ">
            <div
              onSubmit={handleSubmit(handleGenerate)}
              className="w-full lg:w-8/12 p-6 rounded-xl bg-white border"
            >
              <RecursiveFieldArray
                control={control}
                name="fields"
                setValue={setValue}
                isRoot={true}
              />
              <Button className="mt-4" onClick={handleSubmit(handleGenerate)}>
                Generate Data
              </Button>
            </div>

            <pre className="bg-gray-100 text-sm p-4 rounded overflow-auto">
              {JSON.stringify(generatedData, null, 2)}
            </pre>
          </div>
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

function generateFromSchema(
  field: FieldConfig,
): Record<string, unknown> | string | null {
  switch (field.type) {
    case SupportDataType.String:
    case SupportDataType.Number:
    case SupportDataType.Date: {
      return field.value ? callFakerPath(field.value) : null;
    }

    case SupportDataType.Array: {
      return Array.from({ length: field.amount || 1 }, () =>
        generateFromSchema({
          key: field.children?.[0]?.key || "",
          type: field.children?.[0]?.type,
          value: field.children?.[0]?.value || "",
          children: field.children?.[0]?.children || [],
        }),
      );
    }

    case SupportDataType.Map: {
      const obj: Record<string, any> = {};
      for (const child of field.children || []) {
        const res = generateFromSchema(child);
        obj[child.key] = res;
      }
      return obj;
    }

    default:
      return null;
  }
}

const SupportDataType = {
  String: "string",
  Number: "number",
  Date: "date",
  Map: "map",
  Array: "array",
} as const;

type SupportDataType = (typeof SupportDataType)[keyof typeof SupportDataType];

const RecursiveFieldArray = ({
  control,
  name,
  depth = 0,
  parentDataType,
  setValue,
  isRoot,
}: {
  control: any;
  name: string;
  depth?: number;
  parentDataType?: SupportDataType;
  setValue: any;
  isRoot: boolean;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Auto update array child names
  useEffect(() => {
    if (parentDataType === SupportDataType.Array) {
      fields.forEach((field, index) => {
        setValue(`${name}.${index}.name`, String(index));
      });
    }
  }, [fields.length, parentDataType, setValue, name, fields]);

  return (
    <div
      className={clsx(
        "relative flex flex-col gap-3",
        depth > 0 && "border-l-1 border-muted/90 pl-4",
      )}
    >
      {fields.map((field, index) => (
        <div key={field.id} className="relative flex flex-col gap-2">
          {/* Field name + type */}
          <div className="flex items-center gap-4">
            <Controller
              control={control}
              name={`${name}.${index}.key`}
              render={({ field }) => {
                console.log("FIELD: ", field);
                return (
                  <InputWithSuggestion
                    {...field}
                    value={
                      parentDataType === SupportDataType.Array
                        ? "0"
                        : field.value
                    }
                    placeholder="Field name"
                    // className="w-60"
                    disabled={parentDataType === SupportDataType.Array}
                  />
                );
              }}
            />

            <Controller
              control={control}
              name={`${name}.${index}.type`}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SupportDataType).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              control={control}
              name={`${name}.${index}.type`}
              render={({ field: { value: type } }) => {
                if (type === SupportDataType.Array) {
                  return (
                    <Controller
                      control={control}
                      name={`${name}.${index}.amount`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={`Amount of field value to be generate`}
                          className="w-60"
                        />
                      )}
                    />
                  );
                }

                return null;
              }}
            />

            {isRoot ? null : (
              <Controller
                control={control}
                name={`${name}.${index}.type`}
                render={() => {
                  return (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      className="w-fit"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  );
                }}
              />
            )}
          </div>

          {/* Field value or nested children */}
          <Controller
            control={control}
            name={`${name}.${index}.type`}
            render={({ field: { value: type } }) => {
              if (
                type === SupportDataType.String ||
                type === SupportDataType.Number ||
                type === SupportDataType.Date
              ) {
                return (
                  <Controller
                    control={control}
                    name={`${name}.${index}.value`}
                    render={({ field }) => {
                      return (
                        <InputWithSuggestion
                          {...field}
                          placeholder={`Enter ${type.toLowerCase()} value`}
                          className="ml-6 mt-2 w-60"
                        />
                      );
                    }}
                  />
                );
              }

              if (
                type === SupportDataType.Array ||
                type === SupportDataType.Map
              ) {
                return (
                  <div className="ml-2 mt-2">
                    <RecursiveFieldArray
                      control={control}
                      name={`${name}.${index}.children`}
                      depth={depth + 1}
                      parentDataType={type}
                      setValue={setValue}
                    />
                  </div>
                );
              }

              return null;
            }}
          />
        </div>
      ))}

      {/* Add Field button */}
      {isRoot ||
      (parentDataType === SupportDataType.Array &&
        fields.length >= 1) ? null : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => append({ key: "", type: SupportDataType.String })}
          className="w-fit text-muted-foreground hover:text-foreground"
        >
          <Plus className="mr-1 h-4 w-4" /> Add Field
        </Button>
      )}
    </div>
  );
};

export default DataGeneratorScreen;
