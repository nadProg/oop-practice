import { CalculatorButton } from "../button/calculator-button";
import type { CalculatorModel } from "../calculator-model";
import { AbstractOperator, type UnOperator } from "../operator";

export class LogOperator extends AbstractOperator implements UnOperator {
  constructor() {
    super("log10");
  }

  calculate(firstOperand: number): number {
    if (firstOperand <= 0) {
      throw new Error(
        "Логарифм определен только для положительных числе больше 0",
      );
    }

    return Math.log10(firstOperand);
  }

  getHistoryText(firstOperand: number): string {
    return `log<sub>10</sub>(${firstOperand}) = ${this.calculate(firstOperand)}`;
  }

  getHistoryClass(): string {
    return ``;
  }
}

export class LogButton extends CalculatorButton {
  constructor(private model: CalculatorModel) {
    super("log<sub>10</sub>");
  }

  onClick() {
    this.model.addUnOperator(new LogOperator());
  }
}
