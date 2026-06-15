import type { OrderStatus } from "@/_components/shared/inclusive/status-badge";

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  href?: string;
}

export interface ActionQueueItem {
  id: string;
  title: string;
  description: string;
  count: number;
  href: string;
  priority: "high" | "medium" | "low";
}

export interface DashboardOrder {
  id: string;
  customer: string;
  total: string;
  status: OrderStatus;
  date: string;
  href: string;
}

export interface LowStockItem {
  sku: string;
  product: string;
  quantity: number;
  threshold: number;
  href: string;
}

export interface ProductionItem {
  id: string;
  orderId: string;
  product: string;
  dueDate: string;
  status: OrderStatus;
  href: string;
}

export interface QuickAction {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
}

export const dashboardKpis: DashboardKpi[] = [
  {
    id: "revenue",
    label: "Revenue today",
    value: "۴۲.۵M",
    change: "+12% vs yesterday",
    trend: "up",
  },
  {
    id: "orders",
    label: "New orders",
    value: "18",
    change: "+3 pending payment",
    trend: "up",
    href: "/admin/orders",
  },
  {
    id: "returns",
    label: "Pending returns",
    value: "5",
    change: "2 submitted today",
    trend: "down",
    href: "/admin/returns",
  },
  {
    id: "reviews",
    label: "Reviews to moderate",
    value: "8",
    change: "Oldest: 2 days ago",
    trend: "neutral",
    href: "/admin/reviews",
  },
  {
    id: "production",
    label: "In production",
    value: "7",
    change: "2 due this week",
    trend: "neutral",
    href: "/admin/orders?status=in_production",
  },
  {
    id: "inventory",
    label: "Low stock SKUs",
    value: "4",
    change: "Threshold ≤ 3 units",
    trend: "down",
    href: "/admin/inventory",
  },
];

export const actionQueue: ActionQueueItem[] = [
  {
    id: "confirm-orders",
    title: "Confirm paid orders",
    description: "Payment received — awaiting staff review",
    count: 3,
    href: "/admin/orders?status=paid",
    priority: "high",
  },
  {
    id: "returns",
    title: "Review return requests",
    description: "Customer-initiated returns in queue",
    count: 5,
    href: "/admin/returns",
    priority: "high",
  },
  {
    id: "reviews",
    title: "Moderate reviews",
    description: "Pending approval before PDP publish",
    count: 8,
    href: "/admin/reviews",
    priority: "medium",
  },
  {
    id: "inventory",
    title: "Restock low inventory",
    description: "SKUs at or below alert threshold",
    count: 4,
    href: "/admin/inventory",
    priority: "medium",
  },
];

export const recentOrders: DashboardOrder[] = [
  {
    id: "RG-2026-001234",
    customer: "Sara M.",
    total: "۱۲۵٬۰۰۰٬۰۰۰",
    status: "paid",
    date: "Today, 14:32",
    href: "/admin/orders/RG-2026-001234",
  },
  {
    id: "RG-2026-001233",
    customer: "Ali R.",
    total: "۶۲٬۰۰۰٬۰۰۰",
    status: "in_production",
    date: "Today, 11:05",
    href: "/admin/orders/RG-2026-001233",
  },
  {
    id: "RG-2026-001232",
    customer: "Neda K.",
    total: "۴۵٬۰۰۰٬۰۰۰",
    status: "shipped",
    date: "Yesterday",
    href: "/admin/orders/RG-2026-001232",
  },
  {
    id: "RG-2026-001231",
    customer: "Reza H.",
    total: "۸۹٬۵۰۰٬۰۰۰",
    status: "confirmed",
    date: "Yesterday",
    href: "/admin/orders/RG-2026-001231",
  },
  {
    id: "RG-2026-001230",
    customer: "Maryam T.",
    total: "۳۲٬۰۰۰٬۰۰۰",
    status: "return_requested",
    date: "Jun 4",
    href: "/admin/orders/RG-2026-001230",
  },
];

export const lowStockItems: LowStockItem[] = [
  {
    sku: "RNG-18K-YG-054",
    product: "Solitaire ring · 18K yellow gold",
    quantity: 1,
    threshold: 3,
    href: "/admin/inventory",
  },
  {
    sku: "NCK-LIENS-45",
    product: "Liens pendant · 45 cm chain",
    quantity: 2,
    threshold: 3,
    href: "/admin/inventory",
  },
  {
    sku: "ER-STUD-0.5",
    product: "Diamond stud earrings · 0.5 ct",
    quantity: 0,
    threshold: 3,
    href: "/admin/inventory",
  },
  {
    sku: "BRC-CHAIN-17",
    product: "Chain bracelet · adjustable",
    quantity: 3,
    threshold: 3,
    href: "/admin/inventory",
  },
];

export const productionDue: ProductionItem[] = [
  {
    id: "prod-1",
    orderId: "RG-2026-001228",
    product: "Custom engagement ring · 1 ct diamond",
    dueDate: "Jun 10",
    status: "in_production",
    href: "/admin/orders/RG-2026-001228",
  },
  {
    id: "prod-2",
    orderId: "RG-2026-001225",
    product: "Liens set · made to order",
    dueDate: "Jun 12",
    status: "quality_check",
    href: "/admin/orders/RG-2026-001225",
  },
];

export const quickActions: QuickAction[] = [
  { label: "Add product", href: "/admin/products/new", variant: "primary" },
  { label: "Review returns", href: "/admin/returns", variant: "secondary" },
  { label: "Moderate reviews", href: "/admin/reviews", variant: "secondary" },
  { label: "View analytics", href: "/admin/analytics", variant: "ghost" },
];
