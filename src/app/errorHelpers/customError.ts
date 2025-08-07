class AppError extends Error {
  public statusCode: number;

  constructor(statuscode: number, message: string) {
    super(message);
    this.statusCode = statuscode;
  }
}

export default AppError;
