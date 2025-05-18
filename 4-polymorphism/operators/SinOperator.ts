import { CalculatorButton } from "../button/calculator-button";
import type { CalculatorModel } from "../calculator-model";
import { AbstractOperator, type UnOperator } from "../operator";

export class SinOperator extends AbstractOperator implements UnOperator {
  constructor() {
    super("sin");
  }

  calculate(firstOperand: number): number {
    return Math.sin(firstOperand);
  }

  getHistoryText(firstOperand: number): string {
    return `sin(${firstOperand}) = ${this.calculate(firstOperand)}`;
  }

  getHistoryClass(): string {
    return ``;
  }
}

export class SinButton extends CalculatorButton {
  constructor(private model: CalculatorModel) {
    super("sin");
  }

  onClick() {
    this.model.addUnOperator(new SinOperator());
  }
}
