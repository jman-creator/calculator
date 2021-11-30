import operate, { exists, operatorRegex } from "./utilities.js";

const displayValueLength = 13;

let displayValue = "";

let firstOperand = null;
let secondOperand = null;
let operator = null;
let result = null;

const buttons = document.querySelectorAll(".btn");

buttons.forEach(button => {

    button.addEventListener("click", e => handleClick(e));
});

const display = document.querySelector(".display");
updateDisplay();

function updateDisplay(value="0") {

    if (value.length <= displayValueLength) {

        displayValue = value;
        display.textContent = displayValue;
    }
    else {

        displayValue = value.slice(0, displayValueLength + 1);
        alert("Maximum length reached!");
    }
}

// Called per input change
function parseDisplay() {
    
    // Store first operand and operator once an operator is entered
    if (!exists(firstOperand) && operatorRegex.test(displayValue)) {
        
        // The operator is the last character whenever this condition is met
        firstOperand = parseFloat(displayValue.slice(0, -1));
        // Store operator
        operator = displayValue.slice(-1);
        // Defer rest of function to next calls
        return;
    }

    // Handle second operator entry
    if (operatorRegex.test(displayValue.slice(-1))) {    
        
        // If operators are side-by-side
        if (operatorRegex.test(displayValue.slice(-2, -1))) {
            
            // Allow '-' that comes after '*' or '/'
            if(/[\/\*]/.test(displayValue.slice(-2, -1)) && displayValue.slice(-1) === "-") {
                return;
            }
            
            // Otherwise, show and store newly entered operator instead
            updateDisplay(displayValue.slice(0, -2) + displayValue.slice(-1));
            operator = displayValue.slice(-1);
            return;
        }

        // This part of the code is reached if:
        // 1. An operator is entered after a second operand, or
        // 2. An operator is entered after a result that was evaluated by the equals button
        // In the case of (2.), firstOperand already has the value of the last result
        // In the case of (1.), we evaluate the expression and store the value in firstOperand
        if (exists(secondOperand)) {
            
            firstOperand = operate(firstOperand, secondOperand, operator);
            secondOperand = null;
        }

        operator = displayValue.slice(-1);
        updateDisplay(`${firstOperand}${operator}`);
        return;
    }

    // Store second operand
    if (exists(firstOperand) && operator) {
        secondOperand = parseFloat(displayValue.slice(displayValue.indexOf(operator) + 1));
    }
}

function handleClick(e) {

    const button = e.target;
    const classes = button.classList;

    // Update display and variables
    if (classes.contains("number")) {

        // If result is on the display
        if (displayValue == result) {

            firstOperand = null;
            updateDisplay("");
        }
        else if (displayValue === "0") {
            
            updateDisplay("");
        }

        updateDisplay(displayValue + button.textContent);
    }
    else if (classes.contains("point")){

        // If no decimal point already or if there's an operator,
        // then allow decimal point
        if (displayValue.indexOf(".") === -1 || exists(operator)) {

            // Add decimal point
            updateDisplay(displayValue + button.textContent);
        }
    }
    else if (classes.contains("operator")) {

        updateDisplay(displayValue + button.textContent);
    }
    else if (classes.contains("del")) {

        // If result is on the display
        if (displayValue == result) {

            updateDisplay();
        }
        else if (displayValue != "0") {

            // Delete last character if length is greater than 1
            // Otherwise diplay 0
            if (displayValue.length === 1) {

                updateDisplay();
            }
            else {

                updateDisplay(displayValue.slice(0, -1));
            }
        }
    }
    else if (classes.contains("clear")) {

        // Display 0 and reset data
        updateDisplay();
        firstOperand = secondOperand = operator = result = null;
    }
    else if (classes.contains("equal")) {

        if (exists(firstOperand) && exists(secondOperand) && exists(operator)) {

            result = operate(firstOperand, secondOperand, operator);
            updateDisplay(`${result}`);
            firstOperand = result;
            secondOperand = operator = null;
        }
    }

    // Extract data from display
    parseDisplay();
}