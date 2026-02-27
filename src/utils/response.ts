import { Response } from "express";

interface ApiResponseData {
  success: boolean;
  message?: string;
  data?: any;
  error?: any;
  errors?: any[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ApiResponse {
  /**
   * Send a success response
   */
  static success(
    res: Response,
    data: any = null,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    const response: ApiResponseData = {
      success: true,
      message,
      data,
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    message: string = "Error",
    statusCode: number = 500,
    error: any = null
  ): Response {
    const response: ApiResponseData = {
      success: false,
      message,
      error,
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send a validation error response
   */
  static validationError(
    res: Response,
    errors: any[],
    message: string = "Validation failed"
  ): Response {
    const response: ApiResponseData = {
      success: false,
      message,
      errors,
    };

    return res.status(422).json(response);
  }

  /**
   * Send a paginated response
   */
  static paginated(
    res: Response,
    data: any[],
    page: number,
    limit: number,
    total: number,
    message: string = "Success"
  ): Response {
    const response: ApiResponseData = {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return res.status(200).json(response);
  }

  /**
   * Send a created response
   */
  static created(
    res: Response,
    data: any = null,
    message: string = "Resource created successfully"
  ): Response {
    return this.success(res, data, message, 201);
  }

  /**
   * Send a no content response
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}

export default ApiResponse;
