import { AddOperator } from "./AddOperator";
import { SubtractOperator } from "./SubtractOperator";
import { DivideOperator } from "./DivideOperator";
import { MultiplyOperator } from "./MultiplyOperator";
import { type BiOperator } from "../operator";

type SerializableOperator<K extends string> = {
  kind: K;
  key: string;
};

type SerializableBiOperator = SerializableOperator<"bi">;

export class BiOperatorFactory {
  private static operatorRegistry: { [key: string]: BiOperator } = {
    "+": new AddOperator(),
    "-": new SubtractOperator(),
    "/": new DivideOperator(),
    "*": new MultiplyOperator(),
  };

  static toSerializable(operator: BiOperator): SerializableBiOperator {
    return {
      kind: "bi",
      key: operator.getKey(),
    };
  }

  static fromSerializable(
    serialized: SerializableBiOperator,
  ): BiOperator | null {
    return this.operatorRegistry[serialized.key] || null;
  }
}
