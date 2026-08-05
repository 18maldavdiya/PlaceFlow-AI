/**
 * Standard success envelope so every endpoint returns the same shape
 * (`success`, `message`, `data`) and the client's Axios layer never has to
 * special-case one controller's response format against another's.
 */
export class ApiResponse {
  constructor(statusCode, data = null, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export default ApiResponse;
