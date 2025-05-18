import type { BiOperator } from "../operator";
import type { CalculatorModel } from "../calculator-model";
import { CalculatorButton } from "../button/calculator-button";

class DivideOperator implements BiOperator {
  calculate(firstOperand: number, secondOperand: number): number {
    if (secondOperand === 0) {
      throw new Error("Деление на ноль");
    }

    return firstOperand / secondOperand;
  }
  getExpression(firstOperand: number): string {
    return `${firstOperand} /`;
  }
  getHistoryText(firstOperand: number, secondOperand: number): string {
    return `${firstOperand} / ${secondOperand} = ${this.calculate(
      firstOperand,
      secondOperand,
    )}`;
  }
  getHistoryClass(): string {
    return `divide`;
  }
}

export class DivideButton extends CalculatorButton {
  constructor(private model: CalculatorModel) {
    super("/");
  }

  onClick() {
    this.model.addBiOperator(new DivideOperator());
  }
}
