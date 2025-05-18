import type { BiOperator, UnOperator } from "./operator";

export interface CalculatorSubscriber {
  currentOperandUpdated(operand: number, type: "first" | "second"): void;
  biOperatorAdded(operator: BiOperator, firstOperand: number): void;
  unOperatorCalculated(event: UnOperatorCalculatedEvent): void;
  biOperatorCalculated(event: BiOperatorCalculatedEvent): void;
  cleared(): void;
  historyCleared(): void;
}

export type UnOperatorCalculatedEvent = {
  type: "UnOperatorCalculatedEvent";
  operator: UnOperator;
  operand: number;
  result: number;
};

export type BiOperatorCalculatedEvent = {
  type: "BiOperatorCalculatedEvent";
  operator: BiOperator;
  firstOperand: number;
  secondOperand: number;
  result: number;
};

export class BaseCalculatorSubscriber implements CalculatorSubscriber {
  currentOperandUpdated(_: number, __: "first" | "second"): void {}
  biOperatorAdded(_: BiOperator, __: number): void {}
  biOperatorCalculated(_: BiOperatorCalculatedEvent): void {}
  unOperatorCalculated(_: UnOperatorCalculatedEvent): void {}
  cleared(): void {}
  historyCleared(): void {}
}
