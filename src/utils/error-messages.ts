import {
  ApiError,
  ApiErrorCode,
  API_ERROR_CODES,
  isApiError,
  ValidationFieldError,
} from "@/types/api-error.types";
import { toast } from "sonner";
import { parseAxiosError } from "./api-error.utils";

/**
 * User-friendly error messages for each error code
 */
const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  [API_ERROR_CODES.UNAUTHORIZED]: "You need to sign in to continue.",
  [API_ERROR_CODES.NO_ROLE]:
    "Your account doesn't have a role assigned. Please contact an administrator.",
  [API_ERROR_CODES.INSUFFICIENT_PERMISSIONS]:
    "You don't have permission to perform this action.",
  [API_ERROR_CODES.NOT_FOUND]: "The requested resource was not found.",
  [API_ERROR_CODES.BAD_REQUEST]:
    "The request was invalid. Please check your input.",
  [API_ERROR_CODES.VALIDATION_ERROR]: "Please check your input and try again.",
  [API_ERROR_CODES.INTERNAL_ERROR]:
    "Something went wrong. Please try again later.",
  [API_ERROR_CODES.NETWORK_ERROR]:
    "Unable to connect. Please check your internet connection.",
};

/**
 * Get a user-friendly error message from an error
 */
export function getErrorMessage(error: unknown, fallback?: string): string {
  if (isApiError(error)) {
    // For validation errors, use the first error message (already formatted)
    if (error.code === API_ERROR_CODES.VALIDATION_ERROR) {
      return error.message;
    }
    // Use backend message for specific errors
    if (
      error.code === API_ERROR_CODES.BAD_REQUEST ||
      error.code === API_ERROR_CODES.NOT_FOUND ||
      error.code === API_ERROR_CODES.INTERNAL_ERROR
    ) {
      return error.message;
    }
    return ERROR_MESSAGES[error.code] ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback ?? "An unexpected error occurred.";
}

/**
 * Get error message with permission details if available
 */
export function getPermissionErrorMessage(error: unknown): string {
  if (
    isApiError(error) &&
    error.code === API_ERROR_CODES.INSUFFICIENT_PERMISSIONS
  ) {
    const permissions = error.required ?? error.requiredAny;
    if (permissions && permissions.length > 0) {
      return `Missing required permissions: ${permissions.join(", ")}`;
    }
  }
  return getErrorMessage(error);
}

/**
 * Get all validation errors (useful for form field-level errors)
 */
export function getValidationErrors(
  error: unknown
): ValidationFieldError[] | null {
  if (isApiError(error) && error.isValidationError() && error.validationErrors) {
    return error.validationErrors;
  }
  return null;
}

/**
 * Get validation error for a specific field
 */
export function getFieldError(
  error: unknown,
  fieldName: string
): string | null {
  const errors = getValidationErrors(error);
  if (!errors) return null;

  const fieldError = errors.find(
    (e) => e.field === fieldName || e.field.endsWith(`.${fieldName}`)
  );
  return fieldError?.message ?? null;
}

/**
 * Handle error in catch blocks - shows toast and returns typed error
 * Use in client components for consistent error handling
 *
 * @example
 * try {
 *   await createRole(data);
 * } catch (error) {
 *   handleError(error);
 * }
 */
export function handleError(error: unknown, fallbackMessage?: string): ApiError {
  const apiError = isApiError(error) ? error : parseAxiosError(error);
  const message = getErrorMessage(apiError, fallbackMessage);

  toast.error(message);

  return apiError;
}
