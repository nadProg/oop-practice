export function createElementFromHTML<T extends HTMLElement = HTMLDivElement>(
  htmlString: string,
): T {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild as T;
}

export function injectCss(css: string, id: string) {
  if (
    document.adoptedStyleSheets.find(
      (sheet) => (sheet as unknown as { id: string }).id === id,
    )
  ) {
    return;
  }

  const styleSheet = new CSSStyleSheet();
  Object.assign(styleSheet, {
    id: id,
  });
  styleSheet.replaceSync(css);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
}

export const formatError = (error: unknown) => {
  let message = String(error);

  if (message.startsWith("Error:")) {
    message = message.slice(6);
  }

  return message.trim();
};

export const isNever = (never: never): never => never;
