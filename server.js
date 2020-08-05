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

// Connector
const connection = mysql.createConnection(connectionProperties);
