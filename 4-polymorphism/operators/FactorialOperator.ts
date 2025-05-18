import { CalculatorButton } from "../button/calculator-button";
import type { CalculatorModel } from "../calculator-model";
import { AbstractOperator, type UnOperator } from "../operator";

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

export class FactorialOperator extends AbstractOperator implements UnOperator {
  constructor() {
    super("n!");
  }

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
    super("<i>n</i>!", { serif: true });
  }

  onClick() {
    this.model.addUnOperator(new FactorialOperator());
  }
}
