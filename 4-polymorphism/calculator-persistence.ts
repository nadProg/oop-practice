import { z } from "zod";
import {
  BaseCalculatorSubscriber,
  type CalculatorSubscriber,
  type BiOperatorCalculatedEvent,
  type UnOperatorCalculatedEvent,
} from "./calculator-subscriber";
import { LocalStoragePersistence } from "./local-storage-persistence";
import type { BiOperator } from "./operator";
import { type AngleUnit, AngleUnitFactory } from "./angle-unit";
import {
  BiOperatorFactory,
  UnOperatorFactory,
} from "./operators/operator-factory";
import { isNever } from "./utils";

const SerializableBiOperatorSchema = z.object({
  kind: z.literal("bi"),
  key: z.enum(["*", "+", "-", "/", "^"]),
});

const SerializableUnOperatorSchema = z.object({
  kind: z.literal("un"),
  key: z.enum(["sin", "cos", "n!", "log10"]),
});

const SerializableAngleUnitSchema = z.object({
  key: z.enum(["DEG", "RAD"]),
});

const CalculatorSerializableStateSchema = z.object({
  firstOperand: z.number().nullable(),
  operator: SerializableBiOperatorSchema.nullable(),
  secondOperand: z.number().nullable(),
  angleUnit: SerializableAngleUnitSchema.nullable(),
  events: z
    .discriminatedUnion("type", [
      z.object({
        type: z.literal("BiOperatorCalculatedEvent"),
        operator: SerializableBiOperatorSchema,
        firstOperand: z.number(),
        secondOperand: z.number(),
        result: z.number(),
      }),
      z.object({
        type: z.literal("UnOperatorCalculatedEvent"),
        operator: SerializableUnOperatorSchema,
        operand: z.number(),
        result: z.number(),
      }),
    ])
    .array(),
});

class CalculatorPersistence {
  public subscriber = new CalculatorPersistenceSubscriber(this);
  public storage: LocalStoragePersistence<
    typeof CalculatorSerializableStateSchema
  >;

  constructor(key: string, version?: string | number) {
    this.storage = new LocalStoragePersistence(
      key,
      CalculatorSerializableStateSchema,
      {
        firstOperand: null,
        operator: null,
        secondOperand: null,
        angleUnit: null,
        events: [],
      },
      version,
    );
  }
}

type CalculatorPersistedState = {
  firstOperand: number | null;
  operator: BiOperator | null;
  secondOperand: number | null;
  angleUnit: AngleUnit | null;
  events: (BiOperatorCalculatedEvent | UnOperatorCalculatedEvent)[];
};

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
      events: [
        ...prevState.events,
        {
          ...event,
          operator: UnOperatorFactory.toSerializable(event.operator),
        },
      ],
    }));
  }

  public angleUnitUpdated(angleUnit: AngleUnit) {
    this.persistence.storage.update((prevState) => ({
      ...prevState,
      angleUnit: AngleUnitFactory.toSerializable(angleUnit),
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

class CalculatorPersistenceFacade {
  private persistence: CalculatorPersistence;

  constructor(key: string, version?: string | number) {
    this.persistence = new CalculatorPersistence(key, version);
  }

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
        angleUnit: serializableState.angleUnit
          ? AngleUnitFactory.fromSerializable(serializableState.angleUnit)
          : null,
        operator: serializableState.operator
          ? BiOperatorFactory.fromSerializable(serializableState.operator)
          : null,
        events: serializableState.events.map((event) => {
          const { type } = event;

          switch (type) {
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

            case "UnOperatorCalculatedEvent": {
              const operator = UnOperatorFactory.fromSerializable(
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
              isNever(type);
              throw new Error(`Unsupported event type  ${type}`);
            }
          }
        }),
      };
    } catch {
      return null;
    }
  }

  public static getInitialModelState(
    persistedState: CalculatorPersistedState | null,
  ) {
    if (!persistedState) {
      return null;
    }

    return {
      firstOperand: persistedState.firstOperand,
      operator: persistedState.operator,
      secondOperand: persistedState.secondOperand,
      angleUnit: persistedState.angleUnit,
    };
  }

  public static getInitialDisplayState(
    persistedState: CalculatorPersistedState | null,
  ) {
    if (!persistedState) {
      return null;
    }

    const { firstOperand, operator, secondOperand } = persistedState;

    if (operator) {
      if (secondOperand !== null) {
        return { number: secondOperand };
      }

      return null;
    }

    if (firstOperand !== null) {
      return { number: firstOperand };
    }

    return null;
  }

  public static getInitialExpressionState(
    persistedState: CalculatorPersistedState | null,
  ) {
    if (!persistedState) {
      return null;
    }

    const { firstOperand, operator } = persistedState;

    if (operator && firstOperand !== null) {
      return {
        operator,
        firstOperand,
      };
    }

    return null;
  }

  public static getInitialHistoryState(
    persistedState: CalculatorPersistedState | null,
  ) {
    if (!persistedState) {
      return null;
    }

    return {
      events: persistedState.events,
    };
  }

  public static getInitialCalculatorStates(
    persistedState: CalculatorPersistedState | null,
  ) {
    return {
      model: CalculatorPersistenceFacade.getInitialModelState(persistedState),
      display:
        CalculatorPersistenceFacade.getInitialDisplayState(persistedState),
      expression:
        CalculatorPersistenceFacade.getInitialExpressionState(persistedState),
      history:
        CalculatorPersistenceFacade.getInitialHistoryState(persistedState),
    };
  }
}

export { CalculatorPersistenceFacade as CalculatorPersistence };
