// Variable Declarations
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promiseMySql = require("promise-mysql");

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

// View all employees
function viewAllEmp() {
  let query =
    "SELECT emp.id, emp.first_name, emp.last_name, role.title, department.name AS department, role.salary, concat(man.first_name, ' ' ,  man.last_name) AS manager FROM employee e LEFT JOIN employee m ON emp.manager_id = man.id INNER JOIN role ON emp.role_id = role.id INNER JOIN department ON role.department_id = dep.id ORDER BY ID ASC";

  connection.query(query, function (err, res) {
    if (err) return err;
    console.log("\n");

    console.table(res);

    //Returns to main menu
    mainMenu();
  });
}

// View employees by department
function viewAllEmpByDept() {
  let deptArr = [];
  //Promise Mysql
  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      return conn.query("SELECT name FROM department");
    })
    .then(function (value) {
      deptQuery = value;
      for (i = 0; i < value.length; i++) {
        deptArr.push(value[i].name);
      }
    })
    .then(() => {
      inquirer
        .prompt({
          name: "department",
          type: "list",
          message: "Which department would you like to search?",
          choices: deptArr,
        })
        .then((answer) => {
          const query = `SELECT emp.id AS ID, emp.first_name AS 'First Name', emp.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(man.first_name, ' ' ,  man.last_name) AS Manager FROM employee e LEFT JOIN employee m ON emp.manager_id = man.id INNER JOIN role ON emp.role_id = role.id INNER JOIN department ON role.department_id = dep.id WHERE dep.name = '${answer.department}' ORDER BY ID ASC`;
          connection.query(query, (err, res) => {
            if (err) return err;

            console.log("\n");
            console.table(res);

            // Returns to main menu
            mainMenu();
          });
        });
    });
}

// view employees by role
function viewAllEmpByRole() {
  let roleArr = [];

  //Promise Mysql

  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      return conn.query("SELECT title FROM role");
    })
    .then(function (roles) {
      for (i = 0; i < roles.length; i++) {
        roleArr.push(roles[i].title);
      }
    })
    .then(() => {
      inquirer
        .prompt({
          name: "role",
          type: "list",
          message: "Which role would you like to search?",
          choices: roleArr,
        })
        .then((answer) => {
          const query = `SELECT emp.id AS ID, emp.first_name AS 'First Name', emp.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(man.first_name, ' ' ,  man.last_name) AS Manager FROM employee e LEFT JOIN employee m ON emp.manager_id = man.id INNER JOIN role ON emp.role_id = role.id INNER JOIN department ON role.department_id = dep.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
          connection.query(query, (err, res) => {
            if (err) return err;

            console.log("\n");
            console.table(res);
            mainMenu();
          });
        });
    });
}
