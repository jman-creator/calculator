const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

const operate = (x, y, operator, maxDecimalPlaces=4) => {

    const precision = 10**maxDecimalPlaces;
    let result;

    switch (operator) {
        case "+":
            result = add(x, y);
            break;
        case "-":
            result = subtract(x, y);
            break;
        case "*":
            result = multiply(x, y);
            break;
        case "/":
            if (y === 0) {
                alert("No, you cannot divide by zero.");
                return 0;
            }

            result = divide(x, y);
            break;
    }

    // Limit decimal places
    return Math.round(result * precision) / precision;
};

export const exists = value => {

    return Boolean(value || value === 0);
}

export const operatorRegex = /[\+\-\*\/]/;

export default operate;