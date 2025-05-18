import { CalculatorButton } from "../button/calculator-button";
import type { CalculatorModel } from "../calculator-model";
import { AbstractOperator, type UnOperator } from "../operator";

export class CosOperator extends AbstractOperator implements UnOperator {
  constructor() {
    super("cos");
  }

  calculate(firstOperand: number): number {
    return Math.cos(firstOperand);
  }

  getHistoryText(firstOperand: number): string {
    return `cos(${firstOperand}) = ${this.calculate(firstOperand)}`;
  }

  getHistoryClass(): string {
    return ``;
  }
}

export class CosButton extends CalculatorButton {
  constructor(private model: CalculatorModel) {
    super("cos");
  }

  onClick() {
    this.model.addUnOperator(new CosOperator());
  }
}
