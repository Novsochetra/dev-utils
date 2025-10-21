import { Ref } from "react";
import { EyeClosed, EyeIcon, PlusIcon, Trash2Icon } from "lucide-react";
import CodeEditorWithHighlight from "./code-editor";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { Mode } from "./home-screen";

type SliderProps = {
  mode: Mode;
  slidersContentRef: Ref<string[]>;
  activeIdx: number;
  slides: string[];
  onAddSlide: () => void;
  onRemoveSlide: (index: number) => void;
  onSelecteSlide: (index: number) => void;
  onUpdateContentRef: (index: number, value: string) => void;
  onToggleMode: () => void;
};

export const Slider = ({
  mode,
  slidersContentRef,
  activeIdx,
  slides,
  onAddSlide,
  onRemoveSlide,
  onSelecteSlide,
  onUpdateContentRef,
  onToggleMode,
}: SliderProps) => {
  return (
    <div className="flex flex-1 bg-green-500 overflow-hidden">
      <div className="flex flex-col bg-purple-50 h-[600px] relative">
        <div className=" flex flex-col h-full overflow-y-scroll gap-4 p-4 pb-28">
          {slides.map((_, idx) => {
            return (
              <SliderItem
                key={`slider-item-${idx}`}
                index={idx}
                onSelecteSlide={onSelecteSlide}
                onRemoveSlide={onRemoveSlide}
              />
            );
          })}
        </div>
        <div className="px-4 pb-4 absolute bottom-0">
          <AddSliderButton onPress={onAddSlide} />
        </div>
      </div>
      <div className="flex flex-1 bg-green-50">
        <div className="p-8 flex flex-1 flex-col items-center justify-center bg-red-500 gap-4">
          <div className="flex w-full justify-end">
            <Button className="" size="icon" onClick={onToggleMode}>
              {mode === Mode.Edit ? (
                <EyeIcon size={12} />
              ) : (
                <EyeClosed size={12} />
              )}
            </Button>
          </div>

          <CodeEditorWithHighlight
            value={slidersContentRef?.current?.[activeIdx] || ""}
            onChange={(v) => onUpdateContentRef(activeIdx, v)}
          />
        </div>
      </div>
    </div>
  );
};

type SliderItemProps = {
  index: number;
  onSelecteSlide: (index: number) => void;
  onRemoveSlide: (index: number) => void;
};

const SliderItem = ({
  index,
  onRemoveSlide,
  onSelecteSlide,
}: SliderItemProps) => {
  return (
    <div
      className="group w-32 rounded-md overflow-hidden border min-h-20 relative"
      onClick={() => onSelecteSlide(index)}
    >
      <div className="w-full h-full bg-gray-50"></div>
      <Button
        variant="link"
        size="icon"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-white bg-zinc-600 transition-opacity hover:bg-none"
        onClick={() => onRemoveSlide(index)}
      >
        <Trash2Icon size={12} />
      </Button>
    </div>
  );
};

type AddSliderButtonProps = {
  onPress: () => void;
};

const AddSliderButton = ({ onPress }: AddSliderButtonProps) => {
  return (
    <div
      className="w-32 rounded-md border h-20 bg-white z-100 flex items-center justify-center"
      onClick={() => onPress()}
    >
      <PlusIcon size={24} className="text-slate-800" />
    </div>
  );
};
