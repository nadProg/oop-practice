import { z } from "zod";
import {
  BaseCalculatorSubscriber,
  type CalculatorSubscriber,
  type BiOperatorCalculatedEvent,
  type UnOperatorCalculatedEvent,
} from "./calculator-subscriber";
import { LocalStoragePersistence } from "./local-storage-persistence";

const CalculatorStateSchema = z.object({
  firstOperand: z.number().nullable(),
  secondOperand: z.number().nullable(),
});

export class CalculatorPersistence extends BaseCalculatorSubscriber
  implements CalculatorSubscriber {
  public subscriber = new CalculatorPersistenceSubscriber(this);
  public storage = new LocalStoragePersistence(
    "calculator_state",
    CalculatorStateSchema,
    {firstOperand: null, secondOperand: null},
    "1"
  )

  constructor() {
    super();
  }
}

class CalculatorPersistenceSubscriber extends BaseCalculatorSubscriber
  implements CalculatorSubscriber {
  constructor(private persistence: CalculatorPersistence) {
    super();
  }

  public currentOperandUpdated(operand: number, type: "first" | "second") {
    if (type === 'first') {
      this.persistence.storage.update((prevState) => ({
        ...prevState,
        firstOperand: operand,
      }));
      return;
    }

    if (type === 'second') {
      this.persistence.storage.update((prevState) => ({
        ...prevState,
        secondOperand: operand,
      }));
    }
  }

  public biOperatorAdded(): void {
    return;
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
      secondOperand: null,
    }));
  }
}
