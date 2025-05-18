import type { CalculatorModel } from "../calculator-model";
import { injectCss } from "../utils";
import { CalculatorButton } from "./calculator-button";

export class ClearButton extends CalculatorButton {
  constructor(private model: CalculatorModel) {
    super("C");
    this.addClass("clear_calculator_button");
  }

  onClick(): void {
    const isConfirm = confirm("Вы действительно?*");

    if (isConfirm) {
      this.model.clear();
    }
  }

  protected initCss(): void {
    super.initCss();
    injectCss(
      /*css*/ `
      .clear_calculator_button {
        background: gray;
      }
      `,
      "clear_calculator_button"
    );
  }
}
