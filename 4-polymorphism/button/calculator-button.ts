import { formatError, injectCss } from "../utils";

export abstract class CalculatorButton {
  private root: HTMLButtonElement;

  constructor(innerHtml: string, {serif}: {serif?: boolean} = {}) {
    this.root = this.createRoot(innerHtml, {serif});

    this.clickListener = this.clickListener.bind(this);
    this.root.addEventListener("click", this.clickListener);
  }

  public addClass(className: string) {
    this.root.classList.add(className);
    return this;
  }

  abstract onClick(): void;

  private clickListener() {
    try {
      this.onClick()
    } catch (error) {
      alert(formatError(error));
    }
  }

  public renderTo(container: Element) {
    this.initCss();
    container.append(this.root);
  }

  private createRoot(innerHtml: string, {serif}: {serif: boolean | undefined}) {
    const root = document.createElement("button");
    root.classList.add("calculator_button");
    if (serif) {
      root.classList.add("calculator_button--serif");
    }
    root.innerHTML = innerHtml;
    return root;
  }

  protected initCss() {
    injectCss(
      /* css*/ `
    .calculator_button {
      padding: 10px;
      font-size: 18px;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
      cursor: pointer;
    }
    .calculator_button:hover {
      opacity: 0.9;
    }
    .calculator_button--serif {
      font-family: serif;
    }
          `,
      "calculator_button"
    );
  }
}
