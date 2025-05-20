import { CalculatorButton } from "../button/calculator-button";
import type { AngleUnit } from "../angle-unit";
import type { CalculatorModel } from "../calculator-model";
import { AbstractOperator, type UnOperator } from "../operator";

export class SinOperator extends AbstractOperator<"sin"> implements UnOperator {
  constructor() {
    super("sin");
  }

  calculate(firstOperand: number, angleUnit: AngleUnit): number {
    return Math.sin(angleUnit.getRadians(firstOperand));
  }

  getHistoryText(firstOperand: number, angleUnit: AngleUnit): string {
    return `sin<sub>${angleUnit.getFunctionIndex()}</sub>(${firstOperand}) = ${this.calculate(firstOperand, angleUnit)}`;
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
