import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  ALLOWED_PROFILE_IMAGE_TYPES,
  MAX_PROFILE_IMAGE_BYTES,
  PROFILE_QUERY_KEY,
} from "@/constants/profile";
import { uploadProfileImage } from "@/services/profileService";
import { cn } from "@/utils/cn";

function initialsOf(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * Large avatar with an upload trigger — shows a local preview the instant a
 * file is picked (before the network request even starts), then swaps to
 * the server-served URL once the upload succeeds. Falls back to a
 * generated initials badge when no photo has ever been uploaded.
 */
export function AvatarUpload({ imageUrl, fullName, size = 112 }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      toast.success("Profile photo updated.");
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Couldn't upload that photo.");
      setPreviewUrl(null);
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      toast.error("Image must be 2MB or smaller.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    mutation.mutate(file);
  }

  const displaySrc = previewUrl || imageUrl;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-border text-2xl font-semibold text-white",
        )}
        style={
          !displaySrc ? { background: "var(--gradient-brand)" } : undefined
        }
      >
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={fullName ? `${fullName}'s profile photo` : "Profile photo"}
            className="h-full w-full object-cover"
          />
        ) : (
          initialsOf(fullName)
        )}

        {mutation.isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2 className="h-6 w-6 animate-spin text-white" aria-hidden />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={mutation.isPending}
        aria-label="Upload profile photo"
        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Camera className="h-4 w-4" aria-hidden />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_PROFILE_IMAGE_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default AvatarUpload;
