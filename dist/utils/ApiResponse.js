"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(statusCode, message = "Success", result) {
        this.statusCode = statusCode;
        this.result = result;
        this.message = message;
        this.success = statusCode < 400;
    }
}
exports.default = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map