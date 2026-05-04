export class UIError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "UIError";
    this.code = code;
  }
}
