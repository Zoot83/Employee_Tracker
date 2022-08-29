const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'Password123',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

const listOfOptions=[
    {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Quit"
        ]
    }
]


const addDepartment =[
    {
        type: 'input',
        name: "name",
        message: "What is the name of the department? "
    },
]

let nextOption="";

 function init(){

     promptQuestions();

}

async function dbQuery(sql, params){
        db.promise().query(sql, params)
        .then(([rows])=>
        {
            console.log("\n");
            console.table(rows);
            promptQuestions();
        })
}

async function promptQuestions(){

    await inquirer.prompt(listOfOptions)
        .then((answer)=>{
        nextOption = answer.choice;
    })
    .catch((err)=>{
        console.log(err);
    });
    let sql;
    let params;
    switch (nextOption) {
        case "View All Employees":
            sql =`SELECT a.id AS id,
            a.first_name AS first_name,
            a.last_name AS last_name,
            roles.title AS title,
            department.name AS department,
            roles.salary AS salary,
            CONCAT(b.first_name," ", b.last_name) AS manager
            FROM employee a
            LEFT JOIN roles ON a.role_id = roles.id
            JOIN department
            ON roles.department_id = department.id
            LEFT JOIN employee b
            ON a.manager_id = b.id;`
            dbQuery(sql);
            break;

        case "Add Employee":
            
            let allRoles=[];
            let allManagers= [];

            let managerID;
            let roleTitle;
            let rolesSQL;
            let managerSQL;

           
                db.promise().query('SELECT title FROM roles ORDER by title;')
                .then(([rows]) => {

                    for(let i = 0; i<rows.length; i++){
                        allRoles.push(rows[i].title);
                    }
                    
                    db.promise().query('SELECT CONCAT(b.first_name," ", b.last_name) AS name FROM employee a LEFT JOIN employee b ON a.manager_id = b.id WHERE a.manager_id IS NOT NULL;')
                    .then(([rows])=>{
                        for(let i = 0; i<rows.length; i++){
                            allManagers.push(rows[i].name);
                        }
                        
                        const newEmployeeQuestions = [
                            
                            {
                                type: 'input',
                                name: "first_name",
                                message: "What is the first name of the employee? "
                                
                            },
                            {
                                type: 'input',
                                name: "last_name",
                                message: "What is the last name of the employee? ",
                            },
                            {
                                type: 'list',
                                name: "title",
                                message: "What is the job title of the employee? ",
                                choices: allRoles
                            },
                            {
                                type: 'list',
                                name: "manager",
                                message: "Who is the manager of the employee? ",
                                choices: allManagers
                            }
                        ]
                        inquirer.prompt(newEmployeeQuestions)
                        .then((answer)=>{
                                    //Getting title is
                            rolesSQL = 'SELECT id FROM roles WHERE title=' + "'" + answer.title+"'";
                            db.promise().query(rolesSQL)
                            .then(([rows])=>{
                                roleTitle = rows[0].id;
                                managerSQL = 'SELECT id FROM employee WHERE CONCAT(first_name," ", last_name) ='+"'"+answer.manager+"'";
                                db.promise().query(managerSQL)
                                .then(([rows])=>{
                                    managerID = rows[0].id;
                                    newEmployeeSQL= "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('"+answer.first_name+"','"+answer.last_name+"',"+roleTitle+","+managerID+");";
                                    db.promise().execute(newEmployeeSQL); 
                                    promptQuestions();

                                })
                            })                           
                        })       
                    })
                })
            
            break;

        case "Update Employee Role":

            let avaRoles=[];
            let newRole;
            db.promise().query('SELECT title FROM roles ORDER by title;')
                .then(([rows]) => {

                    for(let i = 0; i<rows.length; i++){
                        avaRoles.push(rows[i].title);
                    }
                    const changeRole = [
                 
                        {
                            type: 'input',
                            name: "first_name",
                            message: "What is the first name of the employee? "
                            
                        },
                        {
                            type: 'input',
                            name: "last_name",
                            message: "What is the last name of the employee? ",
                        },
                        {
                            type: 'list',
                            name: "title",
                            message: "What do you want to change the role to? ",
                            choices: avaRoles
                        },
                    ]
                    inquirer.prompt(changeRole)
                    .then((answer)=>{
                        let changeRolesSQL = 'SELECT id FROM roles WHERE title=' + "'" + answer.title+"'";
                            db.promise().query(changeRolesSQL)
                            .then(([rows])=>{
                                newRole= rows[0].id;
                                let empSearchSQL = "UPDATE employee SET role_id = "+newRole +" WHERE CONCAT(first_name,' ', last_name) = CONCAT('"+answer.first_name+"',' ','" + answer.last_name+"');";
                                db.promise().execute(empSearchSQL)
                                promptQuestions();
                            })
                    })
                })
            
            
            break;

        case "View All Roles":
            sql = `SELECT roles.id AS id,
            roles.title AS title,
            department.name AS department_id,
            roles.salary AS salary
            FROM department
            JOIN roles ON roles.department_id = department.id;`
             dbQuery(sql);
            
            break;

        case "Add Role":
            let allDepart= [];

            db.promise().query('SELECT name FROM department ORDER by name;')
            .then(([rows]) => {

                for(let i = 0; i<rows.length; i++){
                    allDepart.push(rows[i].name);
                }

            
            const allDepartment =[
                {
                    type: 'list',
                    name: "department",
                    message: "What is the name of the department? ",
                    choices: allDepart
                },
                {
                    
                    type: 'input',
                    name: "salary",
                    message: "What is the salary of the role? "
                    
                },
                {
                    type: 'input',
                    name: "title",
                    message: "What is the title of the role? "
                },
            ]
             inquirer.prompt(allDepartment)
            .then((answer)=>{
                
                sql2 = 'SELECT id FROM department WHERE name=' + "'" + answer.department+"'";
                db.promise().query(sql2)
                .then(([rows])=>{
                    sql = "INSERT INTO roles (title, department_id, salary) VALUES ("+"'"+answer.title+"',"+rows[0].id +","+answer.salary+")";
                    db.promise().execute(sql);
                    
                })
                promptQuestions();
            });
        })
            break;

        case "View All Departments":
            sql =`SELECT * FROM department ORDER BY department.name;`;
            dbQuery(sql);
            break;
    
        case "Add Department":
            inquirer.prompt(addDepartment)
            .then((answer)=>{
                sql = `INSERT INTO department (name) VALUES (?)`;
                params = [answer.name];
                db.promise().query(sql,params);
                promptQuestions();
            });
            break;

        case "Quit":
            process.exit();
        default :
            break;
    }
}

init();