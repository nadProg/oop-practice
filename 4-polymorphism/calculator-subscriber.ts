import type { BiOperator, UnOperator } from "./operator";

export interface CalculatorSubscriber {
  currentOperandUpdated(operand: number, type: "first" | "second"): void;
  biOperatorAdded(operator: BiOperator, firstOperand: number): void;
  unOperatorCalculated(event: UnOperatorCalculatedEvent): void;
  biOperatorCalculated(event: BiOperatorCalculatedEvent): void;
  cleared(): void;
}

export type UnOperatorCalculatedEvent = {
  operator: UnOperator;
  operand: number;
  result: number;
};

export type BiOperatorCalculatedEvent = {
  operator: BiOperator;
  firstOperand: number;
  secondOperand: number;
  result: number;
};

export class BaseCalculatorSubscriber implements CalculatorSubscriber {
  currentOperandUpdated(operand: number, type: "first" | "second"): void {}
  biOperatorAdded(operator: BiOperator, firstOperand: number): void {}
  biOperatorCalculated(event: BiOperatorCalculatedEvent): void {}
  unOperatorCalculated(event: UnOperatorCalculatedEvent): void {}
  cleared(): void {}
}
