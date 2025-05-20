import { CalculatorButton } from "../button/calculator-button";
import type { CalculatorModel } from "../calculator-model";
import { AbstractOperator, type UnOperator, type AngleUnit } from "../operator";

export class CosOperator extends AbstractOperator<"cos"> implements UnOperator {
  constructor() {
    super("cos");
  }

  calculate(firstOperand: number, angleUnit: AngleUnit): number {
    return Math.cos(angleUnit.getRadians(firstOperand));
  }

  getHistoryText(firstOperand: number, angleUnit: AngleUnit): string {
    return `cos<sub>${angleUnit.getFunctionIndex()}</sub>(${firstOperand}) = ${this.calculate(firstOperand, angleUnit)}`;
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
