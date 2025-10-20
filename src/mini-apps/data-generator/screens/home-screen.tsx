import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  useForm,
  useFieldArray,
  Controller,
  type Control,
  type UseFormReturn,
} from "react-hook-form";
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
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/vendor/shadcn/components/ui/resizable";

type FieldConfig = FieldConfigString | FieldConfigArray | FieldConfigMap;

type FieldConfigString = {
  key: string;
  type:
    | typeof SupportDataType.String
    | typeof SupportDataType.Number
    | typeof SupportDataType.Date;
  value: string;
};

type FieldConfigArray = {
  key: string;
  type: typeof SupportDataType.Array;
  amount: number;
  children: FieldConfig[];
};

type FieldConfigMap = {
  key: string;
  type: typeof SupportDataType.Map;
  amount: number;
  children: Record<string, FieldConfig>;
};

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
        <div className="h-screen w-full flex flex-col">
          <Navbar showBack title={APP_NAME} showSearchBar={false} />
          <div className="flex flex-1 flex-col p-8 h-full bg-red-400 overflow-auto">
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full bg-white rounded-lg"
            >
              <ResizablePanel className="p-6">
                <div className="flex flex-1">
                  <RecursiveFieldArray
                    control={control}
                    name="fields"
                    setValue={setValue}
                    isRoot={true}
                  />
                </div>
                <Button
                  className="mt-4 self-start"
                  onClick={handleSubmit(handleGenerate)}
                >
                  Generate Data
                </Button>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel className="flex-1 p-6">
                <pre className="w-full p-6 bg-gray-200 rounded-lg h-full overflow-auto">
                  {JSON.stringify(generatedData, null, 2)}
                </pre>
              </ResizablePanel>
            </ResizablePanelGroup>

            {/* <ResizablePanelGroup */}
            {/*   direction="horizontal" */}
            {/*   className="w-full flex flex-row flex-1 rounded-xl border bg-white" */}
            {/* > */}
            {/*   <ResizablePanel className="flex flex-col flex-1 p-6"> */}
            {/*     <div className="flex flex-1"> */}
            {/*       <RecursiveFieldArray */}
            {/*         control={control} */}
            {/*         name="fields" */}
            {/*         setValue={setValue} */}
            {/*         isRoot={true} */}
            {/*       /> */}
            {/*     </div> */}
            {/*     <Button */}
            {/*       className="mt-4 self-start" */}
            {/*       onClick={handleSubmit(handleGenerate)} */}
            {/*     > */}
            {/*       Generate Data */}
            {/*     </Button> */}
            {/*   </ResizablePanel> */}
            {/*   <ResizableHandle withHandle /> */}
            {/*   <ResizablePanel className="flex flex-1 p-6"> */}
            {/*     <div className="flex-1 bg-gray-100 text-sm p-4 rounded overflow-auto h-full"> */}
            {/*       <pre className="min-w-full"> */}
            {/*         {JSON.stringify(generatedData, null, 2)} */}
            {/*       </pre> */}
            {/*     </div> */}
            {/*   </ResizablePanel> */}
            {/* </ResizablePanelGroup> */}
          </div>
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

function generateFromSchema(
  field: FieldConfig,
): null | string | (string | null)[] | Record<string, string | null> {
  switch (field.type) {
    case SupportDataType.String:
    case SupportDataType.Number:
    case SupportDataType.Date: {
      return field.value ? callFakerPath(field.value) : null;
    }

    case SupportDataType.Array: {
      const f = field as FieldConfigArray;
      const firstChild = f.children?.[0];
      if (!firstChild) {
        return [];
      }

      return Array.from({ length: field.amount || 1 }, () => {
        return generateFromSchema(firstChild) as string | null;
      });
    }

    case SupportDataType.Map: {
      const obj: Record<string, string | null> = {};
      const f = field as FieldConfigMap;
      for (const key of Object.keys(f.children || {})) {
        const child = f.children?.[key];

        if (child) {
          const res = generateFromSchema(child) as string | null;
          obj[child.key] = res;
        }
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
  control: Control<FormValues>;
  name: string;
  depth?: number;
  parentDataType?: SupportDataType;
  setValue: UseFormReturn<FormValues>["setValue"];
  isRoot: boolean;
}) => {
  const { fields, append, remove } = useFieldArray<FormValues, "fields">({
    control,
    // @ts-expect-error: Dynamic nested field array path
    name,
  });

  return (
    <div
      className={clsx(
        "relative flex flex-col gap-3",
        depth > 0 && "border-l-1 border-muted/90 pl-4",
      )}
    >
      {fields.map((_, index) => (
        <div key={`fields-${index}`} className="relative flex flex-col gap-2">
          {/* Field name + type */}
          <div className="flex items-center gap-4">
            <Controller
              control={control}
              // @ts-expect-error: Dynamic nested field array path
              name={`${name}.${index}.key`}
              render={({ field }) => {
                return (
                  <InputWithSuggestion
                    {...field}
                    value={
                      parentDataType === SupportDataType.Array
                        ? "0"
                        : (field.value as string)
                    }
                    placeholder="Field name"
                    disabled={parentDataType === SupportDataType.Array}
                  />
                );
              }}
            />

            <Controller
              control={control}
              // @ts-expect-error: Dynamic nested field array path
              name={`${name}.${index}.type`}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value as string}
                >
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
              // @ts-expect-error: Dynamic nested field array path
              name={`${name}.${index}.type`}
              render={({ field }) => {
                const type = field.value;

                if (type === SupportDataType.Array) {
                  return (
                    <Controller
                      control={control}
                      // @ts-expect-error: Dynamic nested field array path
                      name={`${name}.${index}.amount`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value as string}
                          placeholder={`Amount of field value to be generate`}
                          className="w-60"
                        />
                      )}
                    />
                  );
                }

                return <></>;
              }}
            />

            {isRoot ? null : (
              <Controller
                control={control}
                // @ts-expect-error: Dynamic nested field array path
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
            // @ts-expect-error: Dynamic nested field array path
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
                    // @ts-expect-error: Dynamic nested field array path
                    name={`${name}.${index}.value`}
                    render={({ field }) => {
                      return (
                        <InputWithSuggestion
                          {...field}
                          value={field.value as string}
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
                      name={`${name}.${index}.children` as string}
                      depth={depth + 1}
                      parentDataType={type}
                      setValue={setValue}
                      isRoot={false}
                    />
                  </div>
                );
              }

              return <></>;
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
          onClick={() =>
            append({
              key: "",
              type: SupportDataType.String,
            } as FieldConfigString)
          }
          className="w-fit text-muted-foreground hover:text-foreground"
        >
          <Plus className="mr-1 h-4 w-4" /> Add Field
        </Button>
      )}
    </div>
  );
};

export default DataGeneratorScreen;
