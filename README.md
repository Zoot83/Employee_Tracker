# Team Generator

In this project I created a application that would allow you to keep track of your employee for a company. By using inquirer I was able to 
gather information for the database and store it in the proper tables. I ustilized multiple types of prompts from inquirer to 
get the right information along with the right choices for certain situations. 

I created 8 paths for the application that the user could user that would show manipulate or add information from the database.
I also created a database using MySQL and was able to store the inforamtion there. To show that this information was behaving right,
I seeded the database with infromation so that I could use that in the development process. 

Possible Paths:
- "View All Employees"
- "Add Employee"
- "Update Employee Role"
- "View All Roles"
- "Add Role"
- "View All Departments"
- "Add Department"
- "Quit"

These paths are very self explainitory and do exactly what they say. 

## Authors

- [@marshallrizzuto](https://github.com/Zoot83)


Website: https://github.com/Zoot83/Employee_Tracker
## Features

- Node
- Inquirer
- Query
- MySQL
- Promises
- Packages
- Npm
- Databases



## Demo

<img src="assets\Demo.gif" width="550" height="450" />

## Usage/Examples

  

In this example used that prompt mesage with an array that was built after doing queries for the information from the database. After the
queries were made and the proper information was brought back from the database I then used it to add a new employee. When asking the a quetion 
I couldn't use the id as a way of selecting the right department or role, I had to query for the name associated with those id and use that. 


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