import { z } from "zod";
import {
  BaseCalculatorSubscriber,
  type CalculatorSubscriber,
  type BiOperatorCalculatedEvent,
  type UnOperatorCalculatedEvent,
} from "./calculator-subscriber";
import { LocalStoragePersistence } from "./local-storage-persistence";
import type { BiOperator } from "./operator";
import { BiOperatorFactory } from "./operators/operator-factory";

const CalculatorSerializableStateSchema = z.object({
  firstOperand: z.number().nullable(),
  operator: z
    .object({
      kind: z.literal("bi"),
      key: z.string(),
    })
    .nullable(),
  secondOperand: z.number().nullable(),
});

class CalculatorPersistence
  extends BaseCalculatorSubscriber
  implements CalculatorSubscriber
{
  public subscriber = new CalculatorPersistenceSubscriber(this);
  public storage = new LocalStoragePersistence(
    "calculator_state",
    CalculatorSerializableStateSchema,
    { firstOperand: null, operator: null, secondOperand: null },
    "1",
  );
}

type CalculatorPersistedState = {
  firstOperand: number | null;
  operator: BiOperator | null;
  secondOperand: number | null;
};

export class CalculatorPersistenceFacade {
  private persistence = new CalculatorPersistence();

  get subscriber() {
    return this.persistence.subscriber;
  }

  public load(): CalculatorPersistedState | null {
    const serializableState = this.persistence.storage.safeLoad();

    if (!serializableState) {
      return null;
    }

    return {
      ...serializableState,
      operator: serializableState.operator
        ? BiOperatorFactory.fromSerializable(serializableState.operator)
        : null,
    };
  }
}

class CalculatorPersistenceSubscriber
  extends BaseCalculatorSubscriber
  implements CalculatorSubscriber
{
  constructor(private persistence: CalculatorPersistence) {
    super();
  }

  public currentOperandUpdated(operand: number, type: "first" | "second") {
    if (type === "first") {
      this.persistence.storage.update((prevState) => ({
        ...prevState,
        firstOperand: operand,
      }));
      return;
    }

    if (type === "second") {
      this.persistence.storage.update((prevState) => ({
        ...prevState,
        secondOperand: operand,
      }));
    }
  }

  public biOperatorAdded(operator: BiOperator, firstOperand: number): void {
    this.persistence.storage.update((prevState) => ({
      ...prevState,
      firstOperand,
      operator: BiOperatorFactory.toSerializable(operator),
      secondOperand: null,
    }));
  }

  public biOperatorCalculated(event: BiOperatorCalculatedEvent): void {
    this.persistence.storage.update((prevState) => ({
      ...prevState,
      firstOperand: event.result,
      secondOperand: null,
    }));
  }

  public unOperatorCalculated(event: UnOperatorCalculatedEvent): void {
    this.persistence.storage.update((prevState) => ({
      ...prevState,
      firstOperand: event.result,
      secondOperand: null,
    }));
  }

  public cleared(): void {
    this.persistence.storage.update(() => ({
      firstOperand: null,
      operator: null,
      secondOperand: null,
    }));
  }
}
