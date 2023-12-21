class ApiResponse {
  statusCode: number;
  result?: unknown;
  message: string;
  success: boolean;

  constructor(statusCode: number, message = "Success", result?: unknown) {
    this.statusCode = statusCode;
    this.result = result;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
