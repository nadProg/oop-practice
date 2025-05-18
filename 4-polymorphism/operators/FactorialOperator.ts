import { CalculatorButton } from "../button/calculator-button";
import type { CalculatorModel } from "../calculator-model";
import type { UnOperator } from "../operator";

function factorial(n: number): number {
  if (n < 0) {
    throw new Error("Факториал отрицательного числа не определен");
  }

  if (n % 1 !== 0) {
    throw new Error("Факториал определен только для целых чисел");
  }

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

class FactorialOperator implements UnOperator {
  calculate(firstOperand: number): number {
    return factorial(firstOperand);
  }

  getHistoryText(firstOperand: number): string {
    return `${firstOperand}! = ${this.calculate(firstOperand)}`;
  }

  getHistoryClass(): string {
    return ``;
  }
}

export class FactorialButton extends CalculatorButton {
  constructor(private model: CalculatorModel) {
    super("n!");
  }

  onClick() {
    this.model.addUnOperator(new FactorialOperator());
  }
}
