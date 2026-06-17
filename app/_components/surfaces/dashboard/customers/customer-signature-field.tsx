"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/_components/core/primitive/button";
import { validateSignatureFile } from "@/lib/api/customers/signature";
import { isSignatureImage, signatureImageSrc } from "@/lib/signature-url";
import { useAdminT } from "../layout/admin-locale-provider";

const ACCEPT = "image/png,image/jpeg,image/webp";

export interface CustomerSignatureFieldProps {
  signatureUrl?: string;
  pendingFile?: File | null;
  onSignatureUrlChange?: (url: string | undefined) => void;
  onPendingFileChange?: (file: File | null) => void;
  onRemove?: () => void;
  idPrefix?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomerSignatureField({
  signatureUrl,
  pendingFile,
  onSignatureUrlChange,
  onPendingFileChange,
  onRemove,
  idPrefix = "signature",
  disabled = false,
  className,
}: CustomerSignatureFieldProps) {
  const { t } = useAdminT();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pendingFile) {
      const objectUrl = URL.createObjectURL(pendingFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (signatureUrl && isSignatureImage(signatureUrl)) {
      setPreviewUrl(signatureImageSrc(signatureUrl) ?? null);
      return;
    }

    setPreviewUrl(null);
  }, [pendingFile, signatureUrl]);

  function handleFileSelect(file: File | null) {
    setError(null);
    if (!file) return;

    const validationCode = validateSignatureFile(file);
    if (validationCode === "INVALID_TYPE") {
      setError(t("customers.import.signatureInvalidType"));
      return;
    }
    if (validationCode === "TOO_LARGE") {
      setError(t("customers.import.signatureTooLarge"));
      return;
    }

    onPendingFileChange?.(file);
    onSignatureUrlChange?.(undefined);
  }

  function handleRemove() {
    setError(null);
    onPendingFileChange?.(null);
    onSignatureUrlChange?.(undefined);
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const hasPreview = Boolean(previewUrl);
  const showLegacyText =
    Boolean(signatureUrl?.trim()) &&
    !pendingFile &&
    !isSignatureImage(signatureUrl);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "relative flex min-h-32 flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-border bg-surface-elevated/40 p-4",
          hasPreview && "border-solid",
        )}
      >
        {hasPreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- same-origin uploaded signatures
          <img
            src={previewUrl!}
            alt={t("customers.fields.signature")}
            className="max-h-28 max-w-full object-contain"
          />
        ) : showLegacyText ? (
          <p className="text-center text-sm font-serif italic text-ink-muted">
            {signatureUrl}
          </p>
        ) : (
          <p className="text-center text-xs text-ink-muted">
            {t("customers.import.signatureUploadHint")}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          id={`${idPrefix}-${inputId}`}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            handleFileSelect(file);
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          {hasPreview || showLegacyText
            ? t("customers.import.signatureChange")
            : t("customers.import.signatureUpload")}
        </Button>
        {(hasPreview || showLegacyText || pendingFile) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={handleRemove}
          >
            {t("customers.import.signatureRemove")}
          </Button>
        )}
      </div>

      {error && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
