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
function mainMenu() {
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
        "View department budgets",
      ],
    })
    .then((answer) => {
      // Case and Switches
      switch (answer.action) {
        case "View all employees":
          viewAllEmp();
          break;

        case "View employees by department":
          viewAllEmpByDept();
          break;

        case "View employees by role":
          viewAllEmpByRole();
          break;

        case "Add employee":
          addEmp();
          break;

        case "Add department":
          addDept();
          break;
        case "Add role":
          addRole();
          break;
        case "Update employee role":
          updateEmpRole();
          break;
        case "Update employee manager":
          updateEmpMngr();
          break;
        case "View employees by manager":
          viewAllEmpByMngr();
          break;
        case "Delete employee":
          deleteEmp();
          break;
        case "View department budgets":
          viewDeptBudget();
          break;
        case "Delete role":
          deleteRole();
          break;
        case "Delete department":
          deleteDept();
          break;
      }
    });
}
