export class ErrorHandler {
    message: string ;
    statusCode: number;
  
    constructor(message: string , statusCode: number) {
      this.message = message;
      this.statusCode = statusCode;
    }
  }