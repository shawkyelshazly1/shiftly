import axios, { AxiosError } from "axios";
import {
  ApiError,
  ApiErrorCode,
  ApiErrorResponse,
  API_ERROR_CODES,
  ValidationFieldError,
} from "@/types/api-error.types";

/**
 * Zod error issue structure
 */
type ZodIssue = {
  path: (string | number)[];
  message: string;
  code?: string;
};

/**
 * Check if error message contains Zod validation errors
 */
function isZodErrorMessage(message: string): boolean {
  try {
    const parsed = JSON.parse(message);
    return (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      "path" in parsed[0] &&
      "message" in parsed[0]
    );
  } catch {
    return false;
  }
}

/**
 * Parse Zod error message into validation field errors
 */
function parseZodErrors(message: string): ValidationFieldError[] {
  try {
    const issues: ZodIssue[] = JSON.parse(message);
    return issues.map((issue) => ({
      field: issue.path.join(".") || "input",
      message: formatValidationMessage(issue),
    }));
  } catch {
    return [];
  }
}

/**
 * Format validation message to be more user-friendly
 */
function formatValidationMessage(issue: ZodIssue): string {
  const fieldName = issue.path[issue.path.length - 1] || "Field";
  const formattedField =
    typeof fieldName === "string"
      ? fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      : fieldName;

  // Make common Zod messages more readable
  if (issue.message.includes("Too small")) {
    const match = issue.message.match(/>=(\d+)/);
    if (match) {
      return `${formattedField} must be at least ${match[1]} characters`;
    }
  }
  if (issue.message.includes("Too big")) {
    const match = issue.message.match(/<=(\d+)/);
    if (match) {
      return `${formattedField} must be at most ${match[1]} characters`;
    }
  }
  if (issue.message === "Required") {
    return `${formattedField} is required`;
  }
  if (issue.message.includes("Invalid email")) {
    return `Please enter a valid email address`;
  }

  return issue.message;
}

/**
 * Determines the error code based on HTTP status and response
 */
function determineErrorCode(
  status: number,
  responseCode?: string
): ApiErrorCode {
  if (
    responseCode &&
    Object.values(API_ERROR_CODES).includes(responseCode as ApiErrorCode)
  ) {
    return responseCode as ApiErrorCode;
  }

  switch (status) {
    case 401:
      return API_ERROR_CODES.UNAUTHORIZED;
    case 403:
      return API_ERROR_CODES.INSUFFICIENT_PERMISSIONS;
    case 404:
      return API_ERROR_CODES.NOT_FOUND;
    case 400:
      return API_ERROR_CODES.BAD_REQUEST;
    default:
      return API_ERROR_CODES.INTERNAL_ERROR;
  }
}

/**
 * Parse any error into a typed ApiError
 */
export function parseAxiosError(error: unknown): ApiError {
  // Handle axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status ?? 500;
    const data = axiosError.response?.data;

    // Network error (no response)
    if (!axiosError.response) {
      return new ApiError(
        "Network error. Please check your connection.",
        API_ERROR_CODES.NETWORK_ERROR,
        0
      );
    }

    const message = data?.error ?? "An unexpected error occurred";
    const code = determineErrorCode(status, data?.code);

    return new ApiError(message, code, status, {
      required: data?.required,
      requiredAny: data?.requiredAny,
    });
  }

  // Handle ApiError pass-through
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Zod validation errors (thrown from inputValidator)
  if (error instanceof Error) {
    // Check if error message contains Zod validation JSON
    if (isZodErrorMessage(error.message)) {
      const validationErrors = parseZodErrors(error.message);
      const firstError = validationErrors[0];
      const message = firstError?.message ?? "Validation failed";

      return new ApiError(message, API_ERROR_CODES.VALIDATION_ERROR, 400, {
        validationErrors,
      });
    }

    // Generic error
    return new ApiError(error.message, API_ERROR_CODES.INTERNAL_ERROR, 500);
  }

  // Fallback for unknown errors
  return new ApiError(
    "An unexpected error occurred",
    API_ERROR_CODES.INTERNAL_ERROR,
    500
  );
}
