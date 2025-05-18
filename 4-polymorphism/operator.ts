export type BiOperatorKey = "+" | "-" | "*" | "/" | "^";

export type UnOperatorKey = "sin" | "cos" | "log10" | "n!";

export class AbstractOperator<K extends BiOperatorKey | UnOperatorKey> {
  constructor(private key: K) {}

  public getKey(): K {
    return this.key;
  }
}

export interface BiOperator {
  getKey(): BiOperatorKey;
  calculate(firstOperand: number, secondOperand: number): number;
  getExpression(firstOperand: number): string;
  getHistoryText(firstOperand: number, secondOperand: number): string;
  getHistoryClass(): string;
}

export interface UnOperator {
  getKey(): UnOperatorKey;
  calculate(firstOperand: number): number;
  getHistoryText(firstOperand: number): string;
  getHistoryClass(): string;
}
