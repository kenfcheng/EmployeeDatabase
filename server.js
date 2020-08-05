// Variable Declarations
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promisemysql = require("promise-mysql");

// Connecton Property
const connectionProperties = {
  host: "localhost",
  port: 3301,
  user: "root",
  password: "Kenfacheng1",
  database: "employees_DB",
};

// Connects the Database
const connection = mysql.createConnection(connectionProperties);

connection.connect((err) => {
  if (err) throw err;
  console.log("\n EMPLOYEE TRACKER \n");
  mainMenu();
});


// Main Menu
function mainMenu(){

    // User Chooses an Option
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "MAIN MENU",
      choices: [
        "View all employees",
        "View employees by role",
        "View employees by department",
        "View employees by manager",
        "Add employee",
        "Add role",
        "Add department",
        "Update employee role",
        "Update employee manager",
        "Delete employee",
        "Delete role",
        "Delete department",
        "View department budgets"
      ]
    })
    .then((answer) => {