/** Design token constants — mirror CSS variables in app/globals.css */

export const colorTokens = [
  { name: "Ink", token: "ink", hex: "#0A0A0A" },
  { name: "Ink Muted", token: "ink-muted", hex: "#3D3D3D" },
  { name: "Ink Subtle", token: "ink-subtle", hex: "#6B6B6B" },
  { name: "Canvas", token: "canvas", hex: "#F5F5F0" },
  { name: "Surface", token: "surface", hex: "#FFFFFF" },
  { name: "Border", token: "border", hex: "#E5E5DF" },
  { name: "Accent", token: "accent", hex: "#B8922A" },
  { name: "Accent Muted", token: "accent-muted", hex: "#F4ECD8" },
  { name: "Success", token: "success", hex: "#1A6B45" },
  { name: "Warning", token: "warning", hex: "#9A6B00" },
  { name: "Error", token: "error", hex: "#9B2222" },
  { name: "Info", token: "info", hex: "#1A4A6B" },
] as const;

export const spacingTokens = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;

export const designSystemNavItems = [
  "colors",
  "typography",
  "spacing",
  "buttons",
  "forms",
  "badges",
  "product",
  "layout",
  "feedback",
  "dashboard",
] as const;

export type DesignSystemSection = (typeof designSystemNavItems)[number];
