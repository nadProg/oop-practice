import type { CalculatorModel } from "../calculator-model";
import { injectCss } from "../utils";
import { CalculatorButton } from "./calculator-button";

export class ProcessButton extends CalculatorButton {
  constructor(private model: CalculatorModel) {
    super("=");
    super.addClass("process_calculator_button");
  }

  onClick() {
    if (this.model.canProcess()) {
      this.model.processCalculation();
    } else {
      alert("Can not process");
    }
  }

  protected initCss(): void {
    super.initCss();
    injectCss(
      /*css*/ `
      .process_calculator_button {
        background: red;
      }
      `,
      "process_calculator_button"
    );
  }
}
