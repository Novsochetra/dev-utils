import { useState, type FormEvent } from "react";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useParams } from "react-router";
import { toast } from "sonner";

import { Button } from "@/vendor/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/vendor/shadcn/components/ui/dialog";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { isMac } from "@/utils/is-desktop-mode";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";
import { useBookmarkStore } from "../../state/state";

export const BookmarkForm = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const addBookmark = useBookmarkStore((s) => s.addBookmark);
  const setSearchBookmarkQuery = useBookmarkStore(
    (s) => s.setSearchBookmarkQuery
  );
  const setSearchBookmarkResult = useBookmarkStore(
    (s) => s.setSearchBookmarkResult
  );
  const params = useParams();

  const keyShortCut = isMac ? "meta+n" : "ctrl+n";

  useHotkeys(
    keyShortCut,
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setOpen(true);
    },
    { enableOnFormTags: true }
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    if (params["id"]) {
      await addBookmark({
        name: formData.get("name") as string,
        url: formData.get("url") as string,
        folderId: params["id"],
        description: formData.get("description") as string,
      });

      // INFO: small ux after add form we might need to auto clear the search
      // since on search result empty we told user to press cmd + n to add bookmark
      setSearchBookmarkQuery("");
      setSearchBookmarkResult([]);
    } else {
      toast.error("Something went wrong");
    }
    setOpen(false);
    setIsLoading(false);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" tabIndex={-1}>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onCloseAutoFocus={e => e.preventDefault()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogDescription>
              Give it a clear name and paste the URL you want to save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue="Untitled"
                autoCorrect="false"
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off" 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                defaultValue=""
                required
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off" 
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Note</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue=""
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off" 
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose
              asChild
              onClick={() => {
                setIsLoading(false);
              }}
            >
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2Icon className="animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
