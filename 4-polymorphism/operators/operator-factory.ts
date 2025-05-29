import {
  type BiOperator,
  type BiOperatorKey,
  type UnOperator,
  type UnOperatorKey,
} from "../operator";
import { AddOperator } from "./AddOperator";
import { SubtractOperator } from "./SubtractOperator";
import { DivideOperator } from "./DivideOperator";
import { MultiplyOperator } from "./MultiplyOperator";
import { PowOperator } from "./PowOperator.ts";
import { SinOperator } from "./SinOperator.ts";
import { CosOperator } from "./CosOperator.ts";
import { FactorialOperator } from "./FactorialOperator.ts";
import { LogOperator } from "./LogOperator.ts";

type SerializableOperator<
  Kind extends string,
  Key extends BiOperatorKey | UnOperatorKey,
> = {
  kind: Kind;
  key: Key;
};

type SerializableBiOperator = SerializableOperator<"bi", BiOperatorKey>;

type SerializableUnOperator = SerializableOperator<"un", UnOperatorKey>;

export class BiOperatorFactory {
  private static readonly operatorRegistry: {
    [K in BiOperatorKey]: BiOperator;
  } = {
    "+": new AddOperator(),
    "-": new SubtractOperator(),
    "/": new DivideOperator(),
    "*": new MultiplyOperator(),
    "^": new PowOperator(),
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

export class UnOperatorFactory {
  private static operatorRegistry: { [Key in UnOperatorKey]: UnOperator } = {
    sin: new SinOperator(),
    cos: new CosOperator(),
    log10: new LogOperator(),
    "n!": new FactorialOperator(),
  };

  static toSerializable(operator: UnOperator): SerializableUnOperator {
    return {
      kind: "un",
      key: operator.getKey(),
    };
  }

  static fromSerializable(
    serialized: SerializableUnOperator,
  ): UnOperator | null {
    return this.operatorRegistry[serialized.key] || null;
  }
}
