// node --watch demo.js
console.log('Hello SDEV2150');

// Variable declaration
let result;
const pi = 3.14159;

console.log(result, pi);

result = add(1, 2);
console.log(`The result is now ${result}`);

// Hoisting of functions is done with this syntax
function add(a, b) {
    return a + b;
}

// To make sure your function isn't "hijacked"
// you can declare it as a const
const multiply = function(a, b) {
    return a * b;
}

// We also have Arrow Functions (which is a shorthand way of writing functions)
const subtract = (a, b) => a - b;
//               \____/    \___/
//                  |         |
//    Function Params       Return result
const subtractV2 = (a, b) => {
    return a - b;
}


console.clear();

// Arrays
const students = [
    { firstName: "Stewart", lastName: "Dent" },
    { firstName: "Annabelle", lastName: "Lyst" },
];

console.log(students);
console.table(students);

const daysOfWeek = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

for(let index = 0; index < daysOfWeek.length; index ++) {
    console.log(daysOfWeek[index]);
}

const truncate = (text) => text.substring(0, 3);

result = daysOfWeek.map(truncate);
console.log(result);

// Build our own mapping function
const transform = function(callback) {
    console.clear();
    // console.log("Making my own map function");
    // console.log(this);
    for(let i = 0; i < this.length; i++) {
        console.log(callback(this[i]));
    }
}

daysOfWeek.transform = transform;
// Call the function
daysOfWeek.transform(truncate);
