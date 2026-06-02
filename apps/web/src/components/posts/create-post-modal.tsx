"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, Instagram, Twitter, ImageIcon, Video, Loader2, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { createPost, type Platform } from "@/lib/posts";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

const PLATFORMS: { id: Platform; label: string; color: string }[] = [
  { id: "instagram", label: "Instagram", color: "border-pink-500/50 bg-pink-500/10 text-pink-400" },
  { id: "tiktok", label: "TikTok", color: "border-gray-600 bg-gray-800 text-gray-300" },
  { id: "twitter", label: "Twitter / X", color: "border-sky-500/50 bg-sky-500/10 text-sky-400" },
];

const DEMO_USER_ID = "demo-user-001";

export function CreatePostModal({ onClose, onCreated }: Props) {
  const [caption, setCaption] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(["instagram"]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleFile = (file: File) => {
    setMediaFile(file);
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const submit = async (postStatus: "draft" | "scheduled") => {
    if (!caption.trim()) { setError("Caption is required"); return; }
    if (platforms.length === 0) { setError("Select at least one platform"); return; }

    setStatus("uploading");
    setError("");

    try {
      await createPost({
        userId: DEMO_USER_ID,
        platforms,
        caption,
        mediaFile: mediaFile ?? undefined,
        scheduledAt: new Date(scheduledAt),
        status: postStatus,
      });
      setStatus("success");
      setTimeout(() => { onCreated?.(); onClose(); }, 1200);
    } catch (err) {
      setError(String(err));
      setStatus("error");
    }
  };

  const isLoading = status === "uploading";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-lg">New Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Platform selector */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">Platforms</label>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={clsx(
                    "flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all",
                    platforms.includes(p.id) ? p.color : "border-gray-700 bg-gray-800 text-gray-500"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Media upload */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">Media</label>
            {mediaPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-700">
                {mediaFile?.type.startsWith("video") ? (
                  <video src={mediaPreview} className="w-full max-h-48 object-cover" muted />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="w-full max-h-48 object-cover" />
                )}
                <button
                  onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={clsx(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                  isDragging ? "border-prism-500 bg-prism-500/5" : "border-gray-700 hover:border-gray-600"
                )}
              >
                <div className="flex justify-center gap-3 mb-2 text-gray-600">
                  <ImageIcon size={20} />
                  <Video size={20} />
                </div>
                <p className="text-sm text-gray-500">Drop image or video here</p>
                <p className="text-xs text-gray-700 mt-1">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your caption..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-prism-500 transition-colors"
            />
            <p className="text-xs text-gray-600 mt-1 text-right">{caption.length} chars</p>
          </div>

          {/* Schedule */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 block">Schedule</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-prism-500 transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-sm">
              <CheckCircle2 size={15} />
              Post saved successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => submit("draft")}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => submit("scheduled")}
            disabled={isLoading || platforms.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-prism-500 hover:bg-prism-600 text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : null}
            {isLoading ? "Saving..." : "Schedule Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
