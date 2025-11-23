import { useContext, useState } from "react";

import { Button } from "@/vendor/shadcn/components/ui/button";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";
import { Mode } from "../../utils/constants";
import { ProjectContext } from "./project-context";
import { useStore } from "../../state/state";

export default function FeedbackWidget() {
  const { id: projectId } = useContext(ProjectContext);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", username: "", feedback: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const mode = useStore((state) => state.projectDetail[projectId].mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbwqTa6YF6Ckp-TfV7a9ZVIk2vfHXxpXe2z4oSyOo_IlSrxHA7uUCHWwWks2vyxfO_qHyw/exec",
        {
          method: "POST",
          body: new URLSearchParams({
            username: form.username,
            feedback: form.feedback,
            email: form.email,
          }),
        },
      );
      if (res.ok) {
        setSent(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  if (mode === Mode.Preview) return null;

  return (
    <div>
      {/* Floating Button */}
      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg px-4 py-2 font-medium z-50"
      >
        {open ? "Close" : "Feedback"}
      </Button>

      {/* Popup Form */}
      {open && (
        <div className="fixed bottom-20 right-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-4 w-80 border border-gray-200 dark:border-gray-700 z-50">
          {sent ? (
            <p className="text-green-500 text-center font-medium">
              ✅ Thanks for your feedback!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email (optional)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Textarea
                placeholder="Your feedback..."
                value={form.feedback}
                onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                rows={3}
                required
              />
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
