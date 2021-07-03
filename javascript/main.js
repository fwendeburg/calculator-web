const calculator = {
    add: (a, b) => a+b,
    subtract: (a,b) => a-b,
    multiply: (a, b) => a*b,
    divide: (a, b) => a/b,
    power: (a, b) => a**b,
    chsi: a => -1*a,
}

let currentDispValue = "0";
let operandOne = "";
let operandTwo = "";
let operator = "";


const mainDisplay = document.querySelector(".main-disp");
const secondaryDisplay = document.querySelector(".secondary-disp");
const buttonsNodeList = document.querySelectorAll(".btn");


function operate(a, b = 0, operation) {
    let result = 0;

    switch(operation) {
        case '+': result =  calculator.add(a, b);
                  break;
        case '-': result =  calculator.subtract(a, b);
                  break;
        case '*': result =  calculator.multiply(a, b);
                  break;
        case '/': result =  calculator.divide(a, b);
                  break;
        case '^': result =  calculator.power(a, b);
                  break;
    }

    return result;
}

function populateDisplay(newValue) {
    mainDisplay.textContent = newValue;
    currentDispValue = newValue;
}

function updateSecondaryDisplay(newValue = "") {
    if (newValue) {
        secondaryDisplay.textContent += newValue;
    }
    else {
        if (operator) {
            secondaryDisplay.textContent += mainDisplay.textContent;
        }
    }
}

function clearAll() {
    operandOne = "";
    operandTwo = "";
    operator = "";
    secondaryDisplay.textContent = "";
    mainDisplay.textContent = "";

    populateDisplay("0");
}

function addDecimalPoint() {
    if (currentDispValue.indexOf('.') == -1) {
        currentDispValue += ".";
    }

    populateDisplay(currentDispValue);

    if (operator) {
        operandTwo = currentDispValue;
    }
    else {
        operandOne = currentDispValue;
    }
}

function getOperationResult() {
    let result = operate(parseFloat(operandOne), parseFloat(operandTwo), operator);
    result = parseFloat(result).toString();

    updateSecondaryDisplay(currentDispValue);
    updateSecondaryDisplay(" =");

    if (result.match("e")) {
        result = parseFloat(result).toExponential(4);
    }
    else {
        result = (Math.round(parseFloat(result) * 10000) / 10000).toString();
    }

    populateDisplay(result);

    operandTwo = "";
    operator = "";
    operandOne = result;
}

function deleteDigit() {
    currentDispValue = currentDispValue.slice(0, -1);

    if (currentDispValue.length == 0) {
        currentDispValue = "0";
    }

    populateDisplay(currentDispValue);

    if (operator) {
        operandTwo = currentDispValue;
    }
    else {
        operandOne = currentDispValue;
    }
}

function changeSign() {
    currentDispValue = calculator.chsi(parseFloat(currentDispValue));
    currentDispValue = currentDispValue.toString();

    populateDisplay(currentDispValue);
}

function addDigit(number) {
    if (!operator) {
        if (operandOne.split("").length < 16) {
            if (number == "0") {
                operandOne += number;
            }
            else {
                operandOne = parseFloat(operandOne + number);
                operandOne = operandOne.toString();
            }

            populateDisplay(operandOne);
        }
    }
    else if (operator) {
        if (!isNaN(secondaryDisplay.textContent)) {
            secondaryDisplay.textContent += operator;
        }

        if (operandTwo.split("").length < 16) {
            if (number == "0") {
                operandTwo += number;
            }
            else {
                operandTwo = parseFloat(operandTwo + number);
                operandTwo = operandTwo.toString();
            }

            populateDisplay(operandTwo);
        }
    }
}

function manageOperation(op) {
    if (isNaN(op)) {
        if (op.match(/[\^\/*+-]/g)) {
            if (!isNaN(currentDispValue)) {
                clearSecondaryDisplay();
                operator = op;
                updateSecondaryDisplay();
                populateDisplay(op);
            }
        }
        else if (op == "=") {
            if (!operator || !operandTwo) {
                clearAll();
            }
            else {
                getOperationResult();
            }
        }
        else if (op == "AC") {
            clearAll();
        }
        else if (op == "DEL") {
            deleteDigit();
        }
        else if (op == "CHSI") {
            changeSign();
        }
        else if (op == ".") {
            addDecimalPoint();
        }
    }
    else {
        addDigit(op);
    }
}

function clearSecondaryDisplay() {
    if (isNaN(secondaryDisplay.textContent)) {
        secondaryDisplay.textContent = "";
    }
}

function getBtnValue() {
    manageOperation(this.value);
}

function getKeyValue(e) {
    if (e.key.match(/[0-9\^\/*+=.-]/g)) {
        manageOperation(e.key);
    }
    else if (e.key == "Backspace") {
        manageOperation("DEL");
    }
    else if (e.key == "Escape") {
        manageOperation("AC");
    }
    else if (e.key.toLowerCase() == "i"){
        manageOperation("CHSI")
    }
    else if (e.key == "Enter") {
        manageOperation("=");
    }
}


buttonsNodeList.forEach(btn => btn.addEventListener('click', getBtnValue));
document.addEventListener("keydown", getKeyValue)

