import {
  BaseCalculatorSubscriber,
  type BiOperatorCalculatedEvent,
  type UnOperatorCalculatedEvent,
} from "./calculator-subscriber";
import { type CalculatorSubscriber } from "./calculator-subscriber";
import type { BiOperator, UnOperator } from "./operator";
import { createElementFromHTML, injectCss } from "./utils";

export class CalculatorHistory {
  private root: HTMLDivElement;
  public subscriber = new HistorySubscriber(this);

  constructor() {
    this.root = this.createRoot();
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

  public addUnOperation(firstOperand: number, operator: UnOperator) {
    const historyItem = createElementFromHTML(/*html*/ `
      <div class="calculator_history-item ${operator.getHistoryClass()}">
        ${operator.getHistoryText(firstOperand)}
      </div>
      `);

    this.root.append(historyItem);
  }

  private createRoot() {
    const root = document.createElement("div");
    root.classList.add("calculator_history");
    root.innerText = "";
    return root;
  }

  private initCss() {
    injectCss(
      /* css*/ `
      .calculator_history {
        margin-top: 20px;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 3px;
        min-height: 100px;
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
    this.history.addUnOperation(event.operand, event.operator);
  }
}
