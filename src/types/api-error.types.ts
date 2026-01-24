/**
 * Error codes that match the backend API responses
 */
export const API_ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  NO_ROLE: "NO_ROLE",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  NOT_FOUND: "NOT_FOUND",
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

/**
 * Structure of error responses from the backend API
 */
export type ApiErrorResponse = {
  error: string;
  code?: ApiErrorCode;
  required?: string[];
  requiredAny?: string[];
};

/**
 * Validation error for a specific field
 */
export type ValidationFieldError = {
  field: string;
  message: string;
};

/**
 * Custom error class for API errors with typed properties
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly required?: string[];
  readonly requiredAny?: string[];
  readonly validationErrors?: ValidationFieldError[];

  constructor(
    message: string,
    code: ApiErrorCode,
    status: number,
    options?: {
      required?: string[];
      requiredAny?: string[];
      validationErrors?: ValidationFieldError[];
    }
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.required = options?.required;
    this.requiredAny = options?.requiredAny;
    this.validationErrors = options?.validationErrors;
  }

  isAuthError(): boolean {
    return this.code === API_ERROR_CODES.UNAUTHORIZED;
  }

  isPermissionError(): boolean {
    return (
      this.code === API_ERROR_CODES.INSUFFICIENT_PERMISSIONS ||
      this.code === API_ERROR_CODES.NO_ROLE
    );
  }

  isNotFoundError(): boolean {
    return this.code === API_ERROR_CODES.NOT_FOUND;
  }

  isValidationError(): boolean {
    return this.code === API_ERROR_CODES.VALIDATION_ERROR;
  }
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
