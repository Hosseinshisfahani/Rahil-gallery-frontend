export interface PaginationMeta {
  page: number;
  perPage: number;
  /** Omitted when `includeTotal=false` */
  total?: number;
  /** Omitted when `includeTotal=false` */
  totalPages?: number;
  /** Present when `includeTotal=false` — more rows exist after this page */
  hasMore?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export function paginationHasExactTotal(meta: PaginationMeta): boolean {
  return meta.total !== undefined && meta.totalPages !== undefined;
}
