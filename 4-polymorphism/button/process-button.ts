import type { CalculatorModel } from "../calculator-model";
import { injectCss } from "../utils";
import { CalculatorButton } from "./calculator-button";

export class ProcessButton extends CalculatorButton {
  constructor(private model: CalculatorModel) {
    super("=");
    this.addClass("process_calculator_button");
  }

  onClick() {
    if (!this.model.canProcess()) {
      throw new Error("Can not process");
    }

    this.model.processCalculation();
  }

  protected initCss(): void {
    super.initCss();
    injectCss(
      /*css*/ `
      .process_calculator_button {
        background: red;
      }
      `,
      "process_calculator_button",
    );
  }
}
