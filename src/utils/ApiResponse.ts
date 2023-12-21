class ApiResponse {
  statusCode: number;
  data?: unknown;
  message: string;
  success: boolean;

  constructor(statusCode: number, message = "Success", data?: unknown) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
