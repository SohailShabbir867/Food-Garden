import React, { useRef, useEffect, useMemo } from "react";
import {
  RiSendPlaneLine,
  RiLoader4Line,
  RiImageAddLine,
  RiCloseCircleLine,
} from "react-icons/ri";
import { toast } from "react-toastify";

const DK = "#3A0519";
const ACC = "#e21b70";
const CR = "#F7F4EF";

const ChatInput = ({
  value,
  onChange,
  onSend,
  onTyping,
  selectedImage = null,
  onImageSelect,
  onImageClear,
  sending = false,
  disabled = false,
  placeholder = "Type a message…",
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedImagePreview = useMemo(() => {
    if (!selectedImage) return "";
    if (typeof selectedImage === "string") return selectedImage;
    return URL.createObjectURL(selectedImage);
  }, [selectedImage]);

  /* Auto-resize the textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  useEffect(() => {
    return () => {
      if (selectedImagePreview && typeof selectedImage !== "string") {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview, selectedImage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || selectedImage) && !sending && !disabled) {
        onSend(e);
      }
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    if (onTyping) onTyping();
  };

  return (
    <form
      onSubmit={onSend}
      className="flex flex-col gap-2 border-t px-4 py-3 bg-white"
      style={{ borderColor: "#E8E2D9" }}
    >
      {/* Image preview */}
      {selectedImagePreview && (
        <div
          className="relative w-24 h-20 rounded-xl border overflow-hidden"
          style={{ borderColor: "#E8E2D9" }}
        >
          <img
            src={selectedImagePreview}
            alt="Selected"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onImageClear}
            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-black transition-colors"
            aria-label="Remove selected image"
          >
            <RiCloseCircleLine className="text-base" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size > 10 * 1024 * 1024) {
              toast.error("Image size should be less than 10MB");
              e.target.value = "";
              return;
            }
            onImageSelect?.(file || null);
          }}
        />

        {/* Square Attach image button (Matching Image 2) */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || sending}
          aria-label="Attach image"
          className="flex items-center justify-center w-10 h-10 rounded-xl border transition-all disabled:opacity-50 shrink-0"
          style={{ borderColor: "#E8E2D9", color: "#9CA3AF" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACC;
            e.currentTarget.style.color = ACC;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E8E2D9";
            e.currentTarget.style.color = "#9CA3AF";
          }}
        >
          <RiImageAddLine className="text-lg" />
        </button>

        {/* Textarea Input Pill (Matching Image 2) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || sending}
          rows={1}
          aria-label="Message input"
          className="flex-1 resize-none rounded-full border px-5 py-2.5 text-xs sm:text-sm outline-none transition-all overflow-hidden disabled:opacity-60 leading-relaxed"
          style={{
            backgroundColor: CR,
            borderColor: "#E8E2D9",
            color: DK,
            minHeight: 42,
            maxHeight: 120,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = DK;
            e.target.style.boxShadow = `0 0 0 2px ${DK}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E8E2D9";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Circular Send button (Matching Image 2) */}
        <button
          type="submit"
          disabled={(!value.trim() && !selectedImage) || sending || disabled}
          aria-label="Send message"
          className="flex items-center justify-center w-10 h-10 rounded-full text-white transition-all disabled:opacity-50 shrink-0 hover:opacity-90 shadow-sm"
          style={{ backgroundColor: DK }}
        >
          {sending ? (
            <RiLoader4Line className="animate-spin text-base" />
          ) : (
            <RiSendPlaneLine className="text-base ml-0.5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
