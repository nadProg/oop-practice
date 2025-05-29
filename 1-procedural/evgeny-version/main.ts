// Процедурный калькулятор
let display: HTMLElement | null = null;
let expressionElement: HTMLElement | null = null;
let historyElement: HTMLElement | null = null;
let currentNumber: string = "0";
let firstOperand: number | null = null;
let operator: string | null = null;

// Обновление отображения
function updateDisplay() {
  if (display) {
    display.textContent = currentNumber;
  }
}

// Обновление выражения
function updateExpression() {
  if (expressionElement) {
    if (firstOperand !== null && operator !== null) {
      expressionElement.textContent = `${firstOperand} ${operator}`;
    } else {
      expressionElement.textContent = "";
    }
  }
}

// Добавление цифры
function appendNumber(num: string) {
  if (currentNumber === "0") {
    currentNumber = num;
  } else {
    currentNumber += num;
  }
  updateDisplay();
}

// Очистка калькулятора
function clear() {
  currentNumber = "0";
  firstOperand = null;
  operator = null;
  updateDisplay();
  updateExpression();
}

// Выполнение операции
function performOperation(isOperator: boolean = false) {
  if (firstOperand === null || operator === null) return;

  const secondOperand = parseFloat(currentNumber);
  let result: number;
  let historyItemClass: string;

  switch (operator) {
    case "+":
      result = firstOperand + secondOperand;
      historyItemClass = "add";
      break;
    case "-":
      result = firstOperand - secondOperand;
      historyItemClass = "subtract";
      break;
    case "*":
      result = firstOperand * secondOperand;
      historyItemClass = "multiply";
      break;
    case "/":
      if (secondOperand === 0) {
        alert("Ошибка: деление на ноль");
        historyItemClass = "error";
        clear();
        return;
      }
      result = firstOperand / secondOperand;
      historyItemClass = "divide";
      break;
    default:
      return;
  }

  if (historyElement) {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");
    historyItem.classList.add(historyItemClass);
    historyItem.textContent = `${firstOperand} ${operator} ${secondOperand} = ${result}`;
    historyElement.append(historyItem);
  }

  if (!isOperator) {
    currentNumber = result.toString();
    firstOperand = null;
    operator = null;
    updateDisplay();
    updateExpression();
  } else {
    firstOperand = result;
    currentNumber = "0";
  }
}

// Установка оператора
function setOperator(op: string) {
  if (firstOperand === null) {
    firstOperand = parseFloat(currentNumber);
    currentNumber = "0";
  } else if (operator !== null && currentNumber !== "0") {
    performOperation(true);
  }
  operator = op;
  updateDisplay();
  updateExpression();
}

// Инициализация калькулятора
function initCalculator() {
  display = document.getElementById("display");
  expressionElement = document.getElementById("expression");
  historyElement = document.getElementById("history");
  clear();

  // Добавляем обработчики для цифровых кнопок
  for (let i = 0; i <= 9; i++) {
    document
      .getElementById(`num${i}`)
      ?.addEventListener("click", () => appendNumber(i.toString()));
  }

  // Добавляем обработчики для операторов
  document
    .getElementById("addButton")
    ?.addEventListener("click", () => setOperator("+"));
  document
    .getElementById("subtractButton")
    ?.addEventListener("click", () => setOperator("-"));
  document
    .getElementById("divideButton")
    ?.addEventListener("click", () => setOperator("/"));
  document
    .getElementById("multiplyButton")
    ?.addEventListener("click", () => setOperator("*"));

  // Добавляем обработчики для специальных кнопок
  document.getElementById("clearButton")?.addEventListener("click", clear);
  document
    .getElementById("equalsButton")
    ?.addEventListener("click", () => performOperation());
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", initCalculator);
