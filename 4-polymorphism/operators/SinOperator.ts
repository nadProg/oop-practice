import { CalculatorButton } from "../button/calculator-button";
import type { CalculatorModel } from "../calculator-model";
import type { UnOperator } from "../operator";

class SinOperator implements UnOperator {
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
