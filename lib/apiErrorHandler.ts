import { NextResponse } from "next/server";

// Standard API Error Response
export interface ApiError {
  error: string;
  message?: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

// Custom API Error Class
export class ApiException extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = "ApiException";
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Common API Errors
export const ApiErrors = {
  BadRequest: (message: string = "Bad Request", details?: any) =>
    new ApiException(message, 400, details),

  Unauthorized: (message: string = "Unauthorized") => new ApiException(message, 401),

  Forbidden: (message: string = "Forbidden") => new ApiException(message, 403),

  NotFound: (message: string = "Resource not found") => new ApiException(message, 404),

  Conflict: (message: string = "Conflict") => new ApiException(message, 409),

  UnprocessableEntity: (message: string = "Unprocessable Entity", details?: any) =>
    new ApiException(message, 422, details),

  TooManyRequests: (message: string = "Too many requests") => new ApiException(message, 429),

  InternalServerError: (message: string = "Internal Server Error") =>
    new ApiException(message, 500),

  ServiceUnavailable: (message: string = "Service Unavailable") => new ApiException(message, 503),
};

/**
 * Global API Error Handler
 *
 * Wraps API route handlers to catch and format errors consistently
 *
 * Usage:
 * ```ts
 * export const GET = withErrorHandler(async (request) => {
 *   // Your handler code
 *   if (!data) {
 *     throw ApiErrors.NotFound("User not found");
 *   }
 *   return NextResponse.json(data);
 * });
 * ```
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<Response>>(handler: T): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("API Error:", error);

      // Handle ApiException
      if (error instanceof ApiException) {
        const errorResponse: ApiError = {
          error: error.name,
          message: error.message,
          statusCode: error.statusCode,
          timestamp: new Date().toISOString(),
        };

        // Include details in development mode
        if (process.env.NODE_ENV === "development" && error.details) {
          (errorResponse as any).details = error.details;
        }

        return NextResponse.json(errorResponse, { status: error.statusCode });
      }

      // Handle Prisma errors
      if (error && typeof error === "object" && "code" in error) {
        const prismaError = error as any;

        // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference
        switch (prismaError.code) {
          case "P2002": // Unique constraint violation
            return NextResponse.json(
              {
                error: "ConflictError",
                message: "A record with this value already exists",
                statusCode: 409,
                timestamp: new Date().toISOString(),
              },
              { status: 409 }
            );

          case "P2025": // Record not found
            return NextResponse.json(
              {
                error: "NotFoundError",
                message: "Record not found",
                statusCode: 404,
                timestamp: new Date().toISOString(),
              },
              { status: 404 }
            );

          case "P2003": // Foreign key constraint violation
            return NextResponse.json(
              {
                error: "BadRequestError",
                message: "Invalid reference to related record",
                statusCode: 400,
                timestamp: new Date().toISOString(),
              },
              { status: 400 }
            );
        }
      }

      // Handle standard Error
      if (error instanceof Error) {
        const statusCode = 500;
        const errorResponse: ApiError = {
          error: "InternalServerError",
          message:
            process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred",
          statusCode,
          timestamp: new Date().toISOString(),
        };

        // Include stack trace in development
        if (process.env.NODE_ENV === "development") {
          (errorResponse as any).stack = error.stack;
        }

        return NextResponse.json(errorResponse, { status: statusCode });
      }

      // Unknown error
      return NextResponse.json(
        {
          error: "UnknownError",
          message: "An unexpected error occurred",
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  }) as T;
}

/**
 * Validate request body against a schema
 *
 * Usage with Zod:
 * ```ts
 * const data = await validateRequest(request, mySchema);
 * ```
 */
export async function validateRequest<T>(
  request: Request,
  schema: { parse: (data: any) => T }
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error && typeof error === "object" && "issues" in error) {
      // Zod validation error
      throw ApiErrors.UnprocessableEntity("Validation failed", (error as any).issues);
    }
    throw ApiErrors.BadRequest("Invalid request body");
  }
}
