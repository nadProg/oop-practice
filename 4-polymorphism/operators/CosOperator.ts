import { CalculatorButton } from "../button/calculator-button";
import type { CalculatorModel } from "../calculator-model";
import type { UnOperator } from "../operator";

class CosOperator implements UnOperator {
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
