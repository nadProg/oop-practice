import { injectCss } from "../utils";
import type { CalculatorModel } from "../calculator-model";
import {
  BaseCalculatorSubscriber,
  type CalculatorSubscriber,
} from "../calculator-subscriber.ts";

type AngleUnit = {
  getLabel: () => string;
};

export class AngleUnitButton {
  private root: HTMLButtonElement;

  public readonly subscriber = new AngleUnitButtonSubscriber(this);

  constructor(private model: CalculatorModel) {
    this.root = this.createRoot();
    this.initCss();
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
      this.model.toggleAngleUnit();
    });
    return button;
  }

  public updateLabel(angleUnit: AngleUnit): void {
    this.setLabel(angleUnit.getLabel());
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

class AngleUnitButtonSubscriber
  extends BaseCalculatorSubscriber
  implements CalculatorSubscriber
{
  constructor(private angleUnitButton: AngleUnitButton) {
    super();
  }

  modelInitialized({ angleUnit }: { angleUnit: AngleUnit }) {
    this.angleUnitButton.updateLabel(angleUnit);
  }

  angleUnitUpdated(angleUnit: AngleUnit) {
    this.angleUnitButton.updateLabel(angleUnit);
  }
}
