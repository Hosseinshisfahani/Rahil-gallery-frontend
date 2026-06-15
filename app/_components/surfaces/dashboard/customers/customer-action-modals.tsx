"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/_components/core/primitive/button";
import { Input } from "@/_components/core/primitive/input";
import { DashboardSelect, DashboardSelectOption } from "../abstract/dashboard-select";
import { Textarea } from "@/_components/core/primitive/textarea";
import { useCustomerEnumLabels } from "@/lib/i18n/admin/use-customer-labels";
import {
  CUSTOMER_TAGS,
  type BlockReasonCode,
  type CustomerDetail,
  type CustomerTag,
} from "../data/mock-customers";
import { useAdminT } from "../layout/admin-locale-provider";
import { ModalShell } from "./modal-shell";

const BLOCK_REASON_CODES: BlockReasonCode[] = [
  "fraud_suspicion",
  "payment_issues",
  "return_abuse",
  "system_misuse",
];

export interface BlockCustomerModalProps {
  onConfirm: (reason: BlockReasonCode, note: string) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export function BlockCustomerModal({
  onConfirm,
  onClose,
  loading = false,
}: BlockCustomerModalProps) {
  const { t } = useAdminT();
  const { blockReason } = useCustomerEnumLabels();
  const [reason, setReason] = useState<BlockReasonCode>("fraud_suspicion");
  const [note, setNote] = useState("");

  return (
    <ModalShell
      title={t("customers.modals.block.title")}
      description={t("customers.modals.block.description")}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            className="bg-error hover:bg-error/90"
            disabled={loading}
            onClick={() => onConfirm(reason, note)}
          >
            {loading ? t("common.blocking") : t("customers.modals.block.confirm")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="block-reason" className="mb-1.5 block text-sm font-medium">
            {t("customers.modals.block.reasonCode")}{" "}
            <span className="text-error">*</span>
          </label>
          <DashboardSelect
            id="block-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as BlockReasonCode)}
          >
            {BLOCK_REASON_CODES.map((code) => (
              <DashboardSelectOption key={code} value={code}>
                {blockReason(code)}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </div>
        <div>
          <label htmlFor="block-note" className="mb-1.5 block text-sm font-medium">
            {t("customers.modals.block.internalNote")}
          </label>
          <Textarea
            id="block-note"
            rows={3}
            placeholder={t("customers.modals.block.notePlaceholder")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </ModalShell>
  );
}

export interface UnblockCustomerModalProps {
  onConfirm: (justification: string) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export function UnblockCustomerModal({
  onConfirm,
  onClose,
  loading = false,
}: UnblockCustomerModalProps) {
  const { t } = useAdminT();
  const [justification, setJustification] = useState("");

  return (
    <ModalShell
      title={t("customers.modals.unblock.title")}
      description={t("customers.modals.unblock.description")}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={!justification.trim() || loading}
            onClick={() => onConfirm(justification)}
          >
            {loading ? t("common.unblocking") : t("customers.modals.unblock.confirm")}
          </Button>
        </>
      }
    >
      <div>
        <label htmlFor="unblock-note" className="mb-1.5 block text-sm font-medium">
          {t("customers.modals.unblock.justification")}{" "}
          <span className="text-error">*</span>
        </label>
        <Textarea
          id="unblock-note"
          rows={3}
          placeholder={t("customers.modals.unblock.justificationPlaceholder")}
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
        />
      </div>
    </ModalShell>
  );
}

export interface AddNoteModalProps {
  onConfirm: (body: string) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export function AddNoteModal({ onConfirm, onClose, loading = false }: AddNoteModalProps) {
  const { t } = useAdminT();
  const [body, setBody] = useState("");

  return (
    <ModalShell
      title={t("customers.modals.addNote.title")}
      description={t("customers.modals.addNote.description")}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={!body.trim() || loading}
            onClick={() => onConfirm(body)}
          >
            {loading ? t("common.saving") : t("customers.modals.addNote.confirm")}
          </Button>
        </>
      }
    >
      <Textarea
        rows={4}
        placeholder={t("customers.modals.addNote.placeholder")}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        aria-label={t("customers.modals.addNote.noteAria")}
      />
    </ModalShell>
  );
}

export interface ExportConfirmModalProps {
  count: number;
  onConfirm: () => void;
  onClose: () => void;
}

export function ExportConfirmModal({
  count,
  onConfirm,
  onClose,
}: ExportConfirmModalProps) {
  const { t } = useAdminT();

  return (
    <ModalShell
      title={t("customers.modals.export.title")}
      description={t("customers.modals.export.description", { count })}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {t("common.downloadCsv")}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-muted">
        {t("customers.modals.export.compliance")}
      </p>
    </ModalShell>
  );
}

export interface SaveFiltersModalProps {
  filterSummary: string[];
  onConfirm: (name: string, isShared: boolean) => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}

export function SaveFiltersModal({
  filterSummary,
  onConfirm,
  onClose,
  loading = false,
  error = null,
}: SaveFiltersModalProps) {
  const { t } = useAdminT();
  const [name, setName] = useState("");
  const [isShared, setIsShared] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await onConfirm(trimmed, isShared);
  }

  return (
    <ModalShell
      title={t("customers.modals.saveFilters.title")}
      description={t("customers.modals.saveFilters.description")}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            disabled={loading || !name.trim()}
            onClick={handleSubmit}
          >
            {loading ? t("common.saving") : t("common.saveFilters")}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="saved-view-name" className="mb-1.5 block text-sm font-medium">
            {t("customers.modals.saveFilters.presetName")}{" "}
            <span className="text-error">*</span>
          </label>
          <Input
            id="saved-view-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("customers.modals.saveFilters.presetPlaceholder")}
            autoFocus
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className="size-4 rounded border-border accent-primary"
          />
          {t("customers.modals.saveFilters.shareStaff")}
        </label>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">
            {t("customers.modals.saveFilters.includedFilters")}
          </p>
          <ul className="max-h-32 space-y-1 overflow-y-auto rounded-[var(--radius-md)] border border-border/60 bg-surface-elevated/40 px-3 py-2 text-sm text-ink-muted">
            {filterSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        {error && (
          <p className="rounded-[var(--radius-md)] bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
      </form>
    </ModalShell>
  );
}

export interface CustomerActionsPanelProps {
  customer: CustomerDetail;
  onBlock: (reason: BlockReasonCode, note: string) => void | Promise<void>;
  onUnblock: (justification: string) => void | Promise<void>;
  onToggleVip: () => void | Promise<void>;
  onToggleTag: (tag: CustomerTag) => void | Promise<void>;
  onAddNote: (body: string) => void | Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
  busy?: boolean;
  className?: string;
}

export function CustomerActionsPanel({
  customer,
  onBlock,
  onUnblock,
  onToggleVip,
  onToggleTag,
  onAddNote,
  onEdit,
  onDelete,
  busy = false,
  className,
}: CustomerActionsPanelProps) {
  const { t } = useAdminT();
  const { tag: tagLabel } = useCustomerEnumLabels();
  const [modal, setModal] = useState<
    "block" | "unblock" | "note" | null
  >(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function runAction(action: () => void | Promise<void>) {
    setActionLoading(true);
    try {
      await action();
    } finally {
      setActionLoading(false);
    }
  }

  const disabled = busy || actionLoading;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">
          {t("customers.actions.panelTitle")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {onEdit && (
            <Button variant="primary" size="sm" disabled={disabled} onClick={onEdit}>
              {t("customers.actions.editProfile")}
            </Button>
          )}
          {customer.status === "active" ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={disabled}
              onClick={() => setModal("block")}
            >
              {t("customers.actions.blockAccount")}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled={disabled}
              onClick={() => setModal("unblock")}
            >
              {t("customers.actions.unblockAccount")}
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={() => runAction(onToggleVip)}
          >
            {customer.isVip
              ? t("customers.actions.removeVip")
              : t("customers.actions.assignVip")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => setModal("note")}
          >
            {t("customers.actions.addNote")}
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              className="text-error hover:text-error"
              onClick={onDelete}
            >
              {t("customers.actions.deleteAccount")}
            </Button>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">
          {t("customers.actions.tags")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {CUSTOMER_TAGS.map((tag) => {
            const active = customer.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                disabled={disabled}
                onClick={() => runAction(() => onToggleTag(tag))}
                className={cn(
                  "rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface text-ink-muted hover:border-ink-muted",
                )}
              >
                {tagLabel(tag)}
              </button>
            );
          })}
        </div>
      </div>

      {modal === "block" && (
        <BlockCustomerModal
          onClose={() => setModal(null)}
          loading={actionLoading}
          onConfirm={async (reason, note) => {
            await runAction(() => onBlock(reason, note));
            setModal(null);
          }}
        />
      )}
      {modal === "unblock" && (
        <UnblockCustomerModal
          onClose={() => setModal(null)}
          loading={actionLoading}
          onConfirm={async (justification) => {
            await runAction(() => onUnblock(justification));
            setModal(null);
          }}
        />
      )}
      {modal === "note" && (
        <AddNoteModal
          onClose={() => setModal(null)}
          loading={actionLoading}
          onConfirm={async (body) => {
            await runAction(() => onAddNote(body));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
