export class AbstractOperator {
  constructor(private key: string) {}

  public getKey(): string {
    return this.key;
  }
}

export interface BiOperator {
  getKey(): string;
  calculate(firstOperand: number, secondOperand: number): number;
  getExpression(firstOperand: number): string;
  getHistoryText(firstOperand: number, secondOperand: number): string;
  getHistoryClass(): string;
}

export interface UnOperator {
  getKey(): string;
  calculate(firstOperand: number): number;
  getHistoryText(firstOperand: number): string;
  getHistoryClass(): string;
}
