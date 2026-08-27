"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalShell } from "@/components/admin/ui/modal-shell";
import { useAdminT } from "../layout/admin-locale-provider";

const MAX_NOTE_CHARS = 4000;

export interface SellerNoteModalProps {
  initialNote: string | null;
  onClose: () => void;
  onSubmit: (note: string) => Promise<void>;
}

export function SellerNoteModal({
  initialNote,
  onClose,
  onSubmit,
}: SellerNoteModalProps) {
  const { t } = useAdminT();
  const [note, setNote] = useState(initialNote ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if ([...note].length > MAX_NOTE_CHARS) {
      setError(t("sms.modals.note.error"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(note.trim());
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("sms.modals.note.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={t("sms.modals.note.title")}
      description={t("sms.modals.note.description")}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button variant="default" onClick={handleConfirm} disabled={submitting}>
            {submitting ? t("common.saving") : t("common.saveNote")}
          </Button>
        </>
      }
    >
      <label className="block text-sm font-medium text-ink">
        {t("sms.modals.note.label")}
        <textarea
          className="mt-2 w-full min-h-28 rounded-[var(--radius-md)] border border-border bg-surface p-3 text-sm"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("sms.modals.note.placeholder")}
          disabled={submitting}
          maxLength={MAX_NOTE_CHARS}
        />
      </label>
      {error && (
        <p className="mt-3 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </ModalShell>
  );
}
