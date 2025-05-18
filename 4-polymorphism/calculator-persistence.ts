import { z } from "zod";
import {
  BaseCalculatorSubscriber,
  type CalculatorSubscriber,
  type BiOperatorCalculatedEvent,
  type UnOperatorCalculatedEvent,
} from "./calculator-subscriber";
import { LocalStoragePersistence } from "./local-storage-persistence";
import type { BiOperator, UnOperator } from "./operator";
import { BiOperatorFactory } from "./operators/operator-factory";

const SerializableBiOperatorSchema = z.object({
  kind: z.literal("bi"),
  key: z.string(),
});

// const SerializableUnOperatorSchema = z.object({
//   kind: z.literal("un"),
//   key: z.string(),
// });

// z.object({
//   type: z.literal("UnOperatorCalculatedEvent"),
//   operator: SerializableUnOperatorSchema,
//   operand: z.number(),
//   result: z.number(),
// })

const CalculatorSerializableStateSchema = z.object({
  firstOperand: z.number().nullable(),
  operator: SerializableBiOperatorSchema.nullable(),
  secondOperand: z.number().nullable(),
  events: z
    .discriminatedUnion("type", [
      z.object({
        type: z.literal("BiOperatorCalculatedEvent"),
        operator: SerializableBiOperatorSchema,
        firstOperand: z.number(),
        secondOperand: z.number(),
        result: z.number(),
      }),
    ])
    .array(),
});

class CalculatorPersistence
  extends BaseCalculatorSubscriber
  implements CalculatorSubscriber
{
  public subscriber = new CalculatorPersistenceSubscriber(this);
  public storage = new LocalStoragePersistence(
    "calculator_state",
    CalculatorSerializableStateSchema,
    { firstOperand: null, operator: null, secondOperand: null, events: [] },
    "1",
  );
}

type CalculatorPersistedState = {
  firstOperand: number | null;
  operator: BiOperator | null;
  secondOperand: number | null;
  events: BiOperatorCalculatedEvent[];
};

export class CalculatorPersistenceFacade {
  private persistence = new CalculatorPersistence();

  get subscriber() {
    return this.persistence.subscriber;
  }

  public load(): CalculatorPersistedState | null {
    try {
      const serializableState = this.persistence.storage.safeLoad();

      if (!serializableState) {
        return null;
      }

      return {
        ...serializableState,
        operator: serializableState.operator
          ? BiOperatorFactory.fromSerializable(serializableState.operator)
          : null,
        events: serializableState.events.map((event) => {
          switch (event.type) {
            case "BiOperatorCalculatedEvent": {
              const operator = BiOperatorFactory.fromSerializable(
                event.operator,
              );

              if (!operator) {
                throw new Error(
                  `Unsupported operator ${JSON.stringify(event.operator)}`,
                );
              }

              return {
                ...event,
                operator,
              };
            }

            default: {
              throw new Error(`Unsupported event type  ${event.type}`);
            }
          }
        }),
      };
    } catch {
      return null;
    }
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
      operator: null,
      secondOperand: null,
      events: [
        ...prevState.events,
        {
          ...event,
          operator: BiOperatorFactory.toSerializable(event.operator),
        },
      ],
    }));
  }

  public unOperatorCalculated(event: UnOperatorCalculatedEvent): void {
    this.persistence.storage.update((prevState) => ({
      ...prevState,
      firstOperand: event.result,
      secondOperand: null,
      operator: null,
      events: [...prevState.events],
    }));
  }

  public cleared(): void {
    this.persistence.storage.update((prevState) => ({
      ...prevState,
      firstOperand: null,
      operator: null,
      secondOperand: null,
    }));
  }

  public historyCleared() {
    this.persistence.storage.update((prevState) => ({
      ...prevState,
      events: [],
    }));
  }
}
