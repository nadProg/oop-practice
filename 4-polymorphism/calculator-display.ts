import type { CalculatorSubscriber } from "./calculator-subscriber";
import { injectCss } from "./utils";

export class CalculatorDisplay {
  private root: HTMLDivElement;

  public readonly subscriber = new DisplaySubscriber(this);

  constructor() {
    this.root = this.createRoot();
  }

  public renderTo(container: Element) {
    this.initCss();
    container.append(this.root);
  }

  public setNumber(num: number) {
    this.root.innerText = num.toString();
  }

  public clear() {
    this.root.innerText = "0";
  }

  private createRoot() {
    const root = document.createElement("div");
    root.classList.add("calculator_display");
    root.innerText = "0";
    return root;
  }

  private initCss() {
    injectCss(
      /* css*/ `
    .calculator_display {
        font-size: 24px;
        margin-bottom: 10px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 3px;
    }
          `,
      "calculator_display"
    );
  }
}

class DisplaySubscriber implements CalculatorSubscriber {
  constructor(private display: CalculatorDisplay) {}

  currentOperandUpdated(operand: number): void {
    this.display.setNumber(operand);
  }

  biOperatorAdded(): void {
    this.display.clear();
  }

  unOperatorCalculated(e: { result: number }): void {
    this.display.setNumber(e.result);
  }

  biOperatorCalculated(e: { result: number }): void {
    this.display.setNumber(e.result);
  }

  cleared(): void {
    this.display.clear();
  }
}
