"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import Typography from "@/components/ui/Typography";

const ACCEPT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILES = 20;

function isImageFile(file: File): boolean {
  return ACCEPT_TYPES.includes(file.type.toLowerCase());
}

type ImageUploadDropzoneProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  className?: string;
};

export default function ImageUploadDropzone({
  files,
  onFilesChange,
  className,
}: ImageUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  const addFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles?.length) return;

      const allowed = Array.from(newFiles).filter(isImageFile);
      if (allowed.length === 0) {
        setError("Solo se permiten imágenes JPG, PNG o WebP.");
        return;
      }

      const total = files.length + allowed.length;
      if (total > MAX_FILES) {
        setError(`Máximo ${MAX_FILES} imágenes.`);
        return;
      }

      setError("");
      onFilesChange([...files, ...allowed]);
    },
    [files, onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center border-2 border-dashed p-4 transition-colors outline-none",
          isDragging && "border-primary bg-muted",
          !isDragging && "border-input hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          onChange={handleChange}
          className="sr-only"
          aria-hidden
        />
        <Typography variant="body2" color="muted">
          Arrastrá imágenes aquí o hacé clic para elegir
        </Typography>
        <Typography variant="body2" color="muted">
          JPG, PNG o WebP. Máx. {MAX_FILES} imágenes.
        </Typography>
      </div>

      {error && (
        <Typography variant="body2" color="destructive">
          {error}
        </Typography>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <Typography variant="body2" color="muted">
            Vista previa
          </Typography>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 list-none p-0 m-0">
            {previewUrls.map((url, index) => (
              <li
                key={url}
                className="relative aspect-square border border-input overflow-hidden bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  className="w-full h-full object-cover"
                  alt="Vista previa"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80"
                  aria-label="Quitar imagen"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
