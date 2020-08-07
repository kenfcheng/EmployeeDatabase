// Variable Declarations
const mysql = require("mysql");
const inquirer = require("inquirer");
const promiseMySql = require("promise-mysql");
const consoleTable = require("console.table");

// Connecton Property
const connectionProperties = {
  host: "localhost",
  port: 3306,
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
////////////////////////////////////////////////////////////////
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
      }
    });
}
/////////////////////////////////////////////////////
// View all employees
function viewAllEmp() {
  let query =
    "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM eloyee e LEFT JOIN eloyee m ON e.managerager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";

  connection.query(query, (err, res) => {
    if (err) return err;
    console.log("\n");

    console.table(res);

    //Returns to main menu
    mainMenu();
  });
}
/////////////////////////////////////////////////////
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
          const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = man.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE dep.name = '${answer.department}' ORDER BY ID ASC`;
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
////////////////////////////////////////////////////////
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
          const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
          connection.query(query, (err, res) => {
            if (err) return err;

            console.log("\n");
            console.table(res);
            mainMenu();
          });
        });
    });
}
// Add employee
function addEmp() {
  let roleArr = [];
  let managerArr = [];
  //Promise mysql
  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      return Promise.all([
        conn.query("SELECT id, title FROM role ORDER BY title ASC"),
        conn.query(
          "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC"
        ),
      ]);
    })
    .then(([roles, managers]) => {
      for (i = 0; i < roles.length; i++) {
        roleArr.push(roles[i].title);
      }

      for (i = 0; i < managers.length; i++) {
        managerArr.push(managers[i].Employee);
      }

      return Promise.all([roles, managers]);
    })
    .then(([roles, managers]) => {
      // add option for no manager
      managerArr.unshift("--");

      inquirer
        .prompt([
          {
            // Prompt user of their first name
            name: "firstName",
            type: "input",
            message: "First name: ",
            // Validate field is not blank
            validate: function (input) {
              if (input === "") {
                console.log("**FIELD REQUIRED**");
                return false;
              } else {
                return true;
              }
            },
          },
          {
            // Prompt user of their last name
            name: "lastName",
            type: "input",
            message: "Lastname name: ",
            // Validate field is not blank
            validate: function (input) {
              if (input === "") {
                console.log("**FIELD REQUIRED**");
                return false;
              } else {
                return true;
              }
            },
          },
          {
            // User Role
            name: "role",
            type: "list",
            message: "What is their role?",
            choices: roleArr,
          },
          {
            // User Manager
            name: "manager",
            type: "list",
            message: "Who is their manager?",
            choices: managerArr,
          },
        ])
        .then((answer) => {
          // Set variable for IDs
          let roleID;
          // Default Manager
          let managerID = null;

          // Get ID of role selected
          for (i = 0; i < roles.length; i++) {
            if (answer.role == roles[i].title) {
              roleID = roles[i].id;
            }
          }

          // get ID of selected manager
          for (i = 0; i < managers.length; i++) {
            if (answer.manager == managers[i].Employee) {
              managerID = managers[i].id;
            }
          }

          // Add employee
          connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`,
            (err, res) => {
              if (err) return err;

              console.log(
                `\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `
              );
              mainMenu();
            }
          );
        });
    });
}
/////////////////////////////////////////////////////
// Add Role
function addRole() {
  //Dept. Array
  let departmentArr = [];

  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      return conn.query("SELECT id, name FROM department ORDER BY name ASC");
    })
    .then((departments) => {
      for (i = 0; i < departments.length; i++) {
        departmentArr.push(departments[i].name);
      }

      return departments;
    })
    .then((departments) => {
      inquirer
        .prompt([
          {
            // roleTitle prompt
            name: "roleTitle",
            type: "input",
            message: "Role title: ",
          },
          {
            // salary prompt
            name: "salary",
            type: "number",
            message: "Salary: ",
          },
          {
            // department prompt
            name: "dept",
            type: "list",
            message: "Department: ",
            choices: departmentArr,
          },
        ])
        .then((answer) => {
          let deptID;

          for (i = 0; i < departments.length; i++) {
            if (answer.dept == departments[i].name) {
              deptID = departments[i].id;
            }
          }

          // Added role
          connection.query(
            `INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`,
            (err, res) => {
              if (err) return err;
              console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
              mainMenu();
            }
          );
        });
    });
}
/////////////////////////////////////////////////////
// Add Department
function addDept() {
  inquirer
    .prompt({
      // Department Name
      name: "deptName",
      type: "input",
      message: "Department Name: ",
    })
    .then((answer) => {
      // adds department to  table
      connection.query(
        `INSERT INTO department (name)VALUES ("${answer.deptName}");`,
        (err, res) => {
          if (err) return err;
          console.log("\n DEPARTMENT ADDED...\n ");
          mainMenu();
        }
      );
    });
}
/////////////////////////////////////////////////////////////
function updateEmpRole() {
  // create employee and role array
  let employeeArr = [];
  let roleArr = [];

  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      return Promise.all([
        // query all roles and employee
        conn.query("SELECT id, title FROM role ORDER BY title ASC"),
        conn.query(
          "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC"
        ),
      ]);
    })
    .then(([roles, employees]) => {
      for (i = 0; i < roles.length; i++) {
        roleArr.push(roles[i].title);
      }

      for (i = 0; i < employees.length; i++) {
        employeeArr.push(employees[i].Employee);
      }

      return Promise.all([roles, employees]);
    })
    .then(([roles, employees]) => {
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Who would you like to edit?",
            choices: employeeArr,
          },
          {
            name: "role",
            type: "list",
            message: "New Role?",
            choices: roleArr,
          },
        ])
        .then((answer) => {
          let roleID;
          let employeeID;

          for (i = 0; i < roles.length; i++) {
            if (answer.role == roles[i].title) {
              roleID = roles[i].id;
            }
          }

          for (i = 0; i < employees.length; i++) {
            if (answer.employee == employees[i].Employee) {
              employeeID = employees[i].id;
            }
          }

          connection.query(
            `UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`,
            (err, res) => {
              if (err) return err;

              console.log(
                `\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `
              );

              // return to main menu
              mainMenu();
            }
          );
        });
    });
}
//////////////////////////////////////////////////////////////
// Update employee manager
function updateEmpMngr() {
  // set global array for employees
  let employeeArr = [];

  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      return conn.query(
        "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC"
      );
    })
    .then((employees) => {
      // Employee Array
      for (i = 0; i < employees.length; i++) {
        employeeArr.push(employees[i].Employee);
      }

      return employees;
    })
    .then((employees) => {
      inquirer
        .prompt([
          {
            //Selects Employee
            name: "employee",
            type: "list",
            message: "Who would you like to edit?",
            choices: employeeArr,
          },
          {
            // Selects New Manager
            name: "manager",
            type: "list",
            message: "Who is their new Manager?",
            choices: employeeArr,
          },
        ])
        .then((answer) => {
          let employeeID;
          let managerID;

          // Manager ID
          for (i = 0; i < employees.length; i++) {
            if (answer.manager == employees[i].Employee) {
              managerID = employees[i].id;
            }
          }

          // Employee ID
          for (i = 0; i < employees.length; i++) {
            if (answer.employee == employees[i].Employee) {
              employeeID = employees[i].id;
            }
          }

          connection.query(
            `UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`,
            (err, res) => {
              if (err) return err;

              // confirm employee update
              console.log(
                `\n ${answer.employee} MANAGER UPDATED TO ${answer.manager}...\n`
              );

              // go back to main menu
              mainMenu();
            }
          );
        });
    });
}
// ---------------------------------------------------------
// View all employees (manager)
function viewAllEmpByMngr() {
  //  manager array
  let managerArr = [];

  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      // Query all employees
      return conn.query(
        "SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id"
      );
    })
    .then(function (managers) {
      for (i = 0; i < managers.length; i++) {
        managerArr.push(managers[i].manager);
      }

      return managers;
    })
    .then((managers) => {
      inquirer
        .prompt({
          // Prompt user for manager
          name: "manager",
          type: "list",
          message: "Which manager would you like to search?",
          choices: managerArr,
        })
        .then((answer) => {
          let managerID;

          // Gets selected manager ID
          for (i = 0; i < managers.length; i++) {
            if (answer.manager == managers[i].manager) {
              managerID = managers[i].id;
            }
          }

          // query all employees by selected manager
          const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            WHERE e.manager_id = ${managerID};`;

          connection.query(query, (err, res) => {
            if (err) return err;

            // display results with console.table
            console.log("\n");
            console.table(res);

            mainMenu();
          });
        });
    });
}
