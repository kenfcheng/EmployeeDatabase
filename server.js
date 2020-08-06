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
/////////////////////////////////////////////////////
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
          "SELECT emp.id, concat(emp.first_name, ' ' ,  emp.last_name) AS Employee FROM employee ORDER BY Employee ASC"
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
            message: "What is their new role?",
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
        "SELECT DISTINCT man.id, CONCAT(m.first_name, ' ', man.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = man.id"
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
          const query = `SELECT emp.id, emp.first_name, emp.last_name, role.title, department.name AS department, role.salary, concat(man.first_name, ' ' ,  man.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON emp.manager_id = man.id
            INNER JOIN role ON emp.role_id = role.id
            INNER JOIN department ON role.department_id = dep.id
            WHERE emp.manager_id = ${managerID};`;

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
///////////////////////////////////////////////////////////

// Deletes employee
function deleteEmp() {
  // Create global employee array
  let employeeArr = [];

  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      // Query all employees
      return conn.query(
        "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC"
      );
    })
    .then((employees) => {
      for (i = 0; i < employees.length; i++) {
        employeeArr.push(employees[i].employee);
      }

      inquirer
        .prompt([
          {
            // prompts all employees
            name: "employee",
            type: "list",
            message: "Who would you like to delete?",
            choices: employeeArr,
          },
          {
            // confirm delete employee delete
            name: "yesNo",
            type: "list",
            message: "Confirm deletion",
            choices: ["YES", "NO"],
          },
        ])
        .then((answer) => {
          if (answer.yesNo == "YES") {
            let employeeID;

            // Confirmed ID Deletion
            for (i = 0; i < employees.length; i++) {
              if (answer.employee == employees[i].employee) {
                employeeID = employees[i].id;
              }
            }

            // deleted selected employee
            connection.query(
              `DELETE FROM employee WHERE id=${employeeID};`,
              (err, res) => {
                if (err) return err;

                // confirm deleted employee
                console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);

                // back to main menu
                mainMenu();
              }
            );
          } else {
            // if not confirmed, go back to main menu
            console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);

            // back to main menu
            mainMenu();
          }
        });
    });
}
////////////////////////////////////////////////////////

// Delete Role
function deleteRole() {
  // role array
  let roleArr = [];

  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      // query all roles
      return conn.query("SELECT id, title FROM role");
    })
    .then((roles) => {
      for (i = 0; i < roles.length; i++) {
        roleArr.push(roles[i].title);
      }

      inquirer
        .prompt([
          {
            name: "continueDelete",
            type: "list",
            message:
              "*** WARNING *** Deleting role will delete all employees associated with the role. Do you want to continue?",
            choices: ["YES", "NO"],
          },
        ])
        .then((answer) => {
          if (answer.continueDelete === "NO") {
            mainMenu();
          }
        })
        .then(() => {
          inquirer
            .prompt([
              {
                // prompt user of of roles
                name: "role",
                type: "list",
                message: "Which role would you like to delete?",
                choices: roleArr,
              },
              {
                // Type role to confirm delete
                name: "confirmDelete",
                type: "Input",
                message:
                  "Type the role title EXACTLY to confirm deletion of the role",
              },
            ])
            .then((answer) => {
              if (answer.confirmDelete === answer.role) {
                let roleID;
                for (i = 0; i < roles.length; i++) {
                  if (answer.role == roles[i].title) {
                    roleID = roles[i].id;
                  }
                }

                // delete role
                connection.query(
                  `DELETE FROM role WHERE id=${roleID};`,
                  (err, res) => {
                    if (err) return err;

                    // confirm role has been added
                    console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                    mainMenu();
                  }
                );
              } else {
                console.log(`\n ROLE '${answer.role}' NOT DELETED...\n `);

                mainMenu();
              }
            });
        });
    });
}
////////////////////////////////////////////////////////////////////

// Delete Department
function deleteDept() {
  let deptArr = [];

  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      return conn.query("SELECT id, name FROM department");
    })
    .then((depts) => {
      for (i = 0; i < depts.length; i++) {
        deptArr.push(depts[i].name);
      }

      inquirer
        .prompt([
          {
            // confirm to continue to select department to delete
            name: "continueDelete",
            type: "list",
            message:
              "*** WARNING *** Deleting a department will delete all roles and employees associated with the department. Do you want to continue?",
            choices: ["YES", "NO"],
          },
        ])
        .then((answer) => {
          // if not, go back to main menu
          if (answer.continueDelete === "NO") {
            mainMenu();
          }
        })
        .then(() => {
          inquirer
            .prompt([
              {
                // User selects department
                name: "dept",
                type: "list",
                message: "Which department would you like to delete?",
                choices: deptArr,
              },
              {
                // User deletes
                name: "confirmDelete",
                type: "Input",
                message:
                  "Type the department name EXACTLY to confirm deletion of the department: ",
              },
            ])
            .then((answer) => {
              if (answer.confirmDelete === answer.dept) {
                // Depeartment Deletion by ID
                let deptID;
                for (i = 0; i < depts.length; i++) {
                  if (answer.dept == depts[i].name) {
                    deptID = depts[i].id;
                  }
                }

                // delete department
                connection.query(
                  `DELETE FROM department WHERE id=${deptID};`,
                  (err, res) => {
                    if (err) return err;

                    // confirm department has been deleted
                    console.log(`\n DEPARTMENT '${answer.dept}' DELETED...\n `);

                    mainMenu();
                  }
                );
              } else {
                console.log(`\n DEPARTMENT '${answer.dept}' NOT DELETED...\n `);

                //back to main menu
                mainMenu();
              }
            });
        });
    });
}
//////////////////////////////////////////////////////////////

//  Department Budget
function viewDeptBudget() {
  promiseMySql
    .createConnection(connectionProperties)
    .then((conn) => {
      return Promise.all([
        // Departments and Salaries
        conn.query(
          "SELECT department.name AS department, role.salary FROM employee e LEFT JOIN employee m ON emp.manager_id = man.id INNER JOIN role ON emp.role_id = role.id INNER JOIN department ON role.department_id = dept.id ORDER BY department ASC"
        ),
        conn.query("SELECT name FROM department ORDER BY name ASC"),
      ]);
    })
    .then(([deptSalaies, departments]) => {
      let deptBudgetArr = [];
      let department;

      for (d = 0; d < departments.length; d++) {
        let departmentBudget = 0;

        // add all salaries together
        for (i = 0; i < deptSalaies.length; i++) {
          if (departments[d].name == deptSalaies[i].department) {
            departmentBudget += deptSalaies[i].salary;
          }
        }

        // create new property with budgets
        department = {
          Department: departments[d].name,
          Budget: departmentBudget,
        };

        // add to array
        deptBudgetArr.push(department);
      }
      console.log("\n");

      // display departments budgets using console.table
      console.table(deptBudgetArr);

      // back to main menu
      mainMenu();
    });
}
