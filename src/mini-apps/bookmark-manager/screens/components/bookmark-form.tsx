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
import { useState, type FormEvent } from "react";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { PlusIcon } from "lucide-react";
import { useBookmarkStore } from "../../state/state";
import { useParams } from "react-router";
import { toast } from "sonner";

export const BookmarkForm = () => {
  const [open, setOpen] = useState(false);
  const addBookmark = useBookmarkStore(s => s.addBookmark)
  const params = useParams()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);

    if(params["id"]) {
      addBookmark({
        name: formData.get("name") as string,
        url: formData.get("url") as string,
        folderId: params["id"]
      })
    } else {
      toast.error("Folder not found")
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <PlusIcon size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
              <Input id="name" name="name" defaultValue="Untitled" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" defaultValue="" required />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
