import type { BiOperator, UnOperator } from "./operator";
import type { AngleUnit } from "./angle-unit";

type InitializedModelState = {
  firstOperand: number | null;
  operator: BiOperator | null;
  secondOperand: number | null;
  angleUnit: AngleUnit;
};

export interface CalculatorSubscriber {
  currentOperandUpdated(operand: number, type: "first" | "second"): void;
  biOperatorAdded(operator: BiOperator, firstOperand: number): void;
  unOperatorCalculated(e: UnOperatorCalculatedEvent): void;
  biOperatorCalculated(e: BiOperatorCalculatedEvent): void;
  cleared(): void;
  historyCleared(): void;
  angleUnitUpdated(angleUnit: AngleUnit): void;
  modelInitialized(state: InitializedModelState): void;
}

export type UnOperatorCalculatedEvent = {
  type: "UnOperatorCalculatedEvent";
  operator: UnOperator;
  operand: number;
  angleUnit: AngleUnit;
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
  angleUnitUpdated(_: AngleUnit): void {}
  modelInitialized(_: InitializedModelState): void {}
}
