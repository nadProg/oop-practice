import {
  BaseCalculatorSubscriber,
  type BiOperatorCalculatedEvent,
  type UnOperatorCalculatedEvent,
  type CalculatorSubscriber,
} from "./calculator-subscriber";
import type { AngleUnit } from "./angle-unit";
import type { BiOperator, UnOperator } from "./operator";
import type { CalculatorModel } from "./calculator-model";
import { createElementFromHTML, injectCss } from "./utils";

export class CalculatorHistory {
  private root: HTMLDivElement;
  private clearButton: HTMLButtonElement;
  public subscriber = new HistorySubscriber(this);

  constructor(
    private model: CalculatorModel,
    initState?: {
      events: (BiOperatorCalculatedEvent | UnOperatorCalculatedEvent)[];
    } | null,
  ) {
    this.clearButton = this.createClearButton();
    this.root = this.createRoot();
    this.root.append(this.clearButton);
    this.clearButton.addEventListener("click", () => this.model.clearHistory());

    if (initState) {
      this.initEvents(initState.events);
    }
  }

  private initEvents(
    events: (BiOperatorCalculatedEvent | UnOperatorCalculatedEvent)[],
  ) {
    events.forEach((event) => {
      if (event.type === "BiOperatorCalculatedEvent") {
        this.addBiOperation(
          event.firstOperand,
          event.operator,
          event.secondOperand,
        );
      }

      if (event.type === "UnOperatorCalculatedEvent") {
        this.addUnOperation(event.operand, event.operator, event.angleUnit);
      }
    });
  }

  public renderTo(container: Element) {
    this.initCss();
    container.append(this.root);
  }

  public addBiOperation(
    firstOperand: number,
    operator: BiOperator,
    secondOperand: number,
  ) {
    const historyItem = createElementFromHTML(/*html*/ `
      <div class="calculator_history-item ${operator.getHistoryClass()}">
        ${operator.getHistoryText(firstOperand, secondOperand)}
      </div>
      `);

    this.root.append(historyItem);
  }

  public addUnOperation(
    firstOperand: number,
    operator: UnOperator,
    angleUnit: AngleUnit,
  ) {
    const historyItem = createElementFromHTML(/*html*/ `
      <div class="calculator_history-item ${operator.getHistoryClass()}">
        ${operator.getHistoryText(firstOperand, angleUnit)}
      </div>
      `);

    this.root.append(historyItem);
  }

  public clear() {
    this.root
      .querySelectorAll(".calculator_history-item")
      .forEach((element) => {
        element.remove();
      });
  }

  private createRoot() {
    const root = document.createElement("div");
    root.classList.add("calculator_history");
    root.innerText = "";

    return root;
  }

  private createClearButton() {
    const button = document.createElement("button");
    button.classList.add("calculator_history__clear");
    button.textContent = "Clear";
    return button;
  }

  private initCss() {
    injectCss(
      /* css*/ `
      .calculator_history {
        position: relative;
        margin-top: 20px;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 3px;
        min-height: 100px;
      }
      .calculator_history__clear {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
      }
      .calculator_history-item {
        padding: 5px;
        margin: 2px 0;
        border-radius: 3px;
        font-family: monospace;
        font-size: 16px;
      }
      .calculator_history-item.add {
        color: #2ecc71;
      }
      .calculator_history-item.subtract {
        color: #e74c3c;
      }
      .calculator_history-item.multiply {
        color: #3498db;
      }
      .calculator_history-item.divide {
        color: #9b59b6;
      }
      .calculator_history-item.error {
        color: #e74c3c;
        font-weight: bold;
      }
          `,
      "calculator_history",
    );
  }
}

class HistorySubscriber
  extends BaseCalculatorSubscriber
  implements CalculatorSubscriber
{
  constructor(private history: CalculatorHistory) {
    super();
  }

  biOperatorCalculated(event: BiOperatorCalculatedEvent): void {
    this.history.addBiOperation(
      event.firstOperand,
      event.operator,
      event.secondOperand,
    );
  }

  unOperatorCalculated(event: UnOperatorCalculatedEvent): void {
    this.history.addUnOperation(event.operand, event.operator, event.angleUnit);
  }

  historyCleared() {
    this.history.clear();
  }
}
