import { injectCss } from "../utils";
import type { CalculatorModel } from "../calculator-model";

export class AngleUnitButton {
  private root: HTMLButtonElement;

  constructor(private model: CalculatorModel) {
    this.root = this.createRoot();
    this.initCss();
    this.updateLabel();
  }

  public renderTo(container: Element) {
    container.append(this.root);
  }

  public setLabel(label: string): void {
    this.root.innerHTML = label;
  }

  private createRoot() {
    const button = document.createElement("button");
    button.classList.add("angle_mode_button");
    button.addEventListener("click", () => {
      console.log("Angle mode click");
      this.model.toggleAngleUnit();
      this.updateLabel();
    });
    return button;
  }

  private updateLabel() {
    this.setLabel(this.model.getAngleUnit().getLabel());
  }

  private initCss() {
    injectCss(
      /* css*/ `
      .angle_mode_button {
        padding: 6px 14px;
        font-size: 16px;
        font-family: monospace;
        background: #e0e0e0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
        min-width: 60px;
      }
      .angle_mode_button:hover {
        background: #d0d0d0;
      }
      `,
      "angle_mode_button",
    );
  }
}
