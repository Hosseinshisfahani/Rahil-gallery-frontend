/** Visible placeholder text for admin form fields (replaces separate labels). */
export function fieldPlaceholder(label: string, required?: boolean): string {
  const text = label.trim();
  return required ? `${text} *` : text;
}
