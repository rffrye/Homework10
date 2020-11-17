
const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const fs = require('fs');

//Class handles the application process
class App {

    constructor() {

        //List of employees that get added as the user adds them
        this.employees = [];
        //Prompts for employee information
        this.employeePrompt = [
            {
                type: "input",
                message: "What is your name?",
                name: "name"
            },
            {
                type: "input",
                message: "What is your id?",
                name: "id"
            },
            {
                type: "input",
                message: "What is your email?",
                name: "email"
            }
        ];
        this.managerPrompt = this.employeePrompt.concat([
            {
                type: "input",
                message: "What is your office number?",
                name: "officeN"
            }
        ]);
        this.engineerPrompt = this.employeePrompt.concat([
            {
                type: "input",
                message: "What is your github?",
                name: "github"
            }
        ]);
        this.internPrompt = this.employeePrompt.concat([
            {
                type: "input",
                message: "What is your school?",
                name: "school"
            }
        ]);
        // console.log(this);
    }

    //start application
    start() {
        this.nextEmployee();
    }

    //end application
    end() {
        console.log("Team Profile Generated");
    }

    //Call to prompt for employee role. If role is "Exit". No additional employees => call to renderHTML page based on all employees.
    //Else call to get employe info based on role, then create employee object and push to employees array
    nextEmployee() {
        this.promptRole().then((role) => {
            if (role === "Exit") {
                this.renderHTML();
                this.end();
            }
            else {
                //prompt user for employee and add employee object to employees array
                this.promptInfo(role).then((data) => {
                    //create employee object with data received
                    switch (role) {
                        case "Manager":
                            this.employees.push(new Manager(data.name, data.id, data.email, data.officeN));
                            break;
                        case "Engineer":
                            this.employees.push(new Engineer(data.name, data.id, data.email, data.github));
                            break;
                        case "Intern":
                            this.employees.push(new Intern(data.name, data.id, data.email, data.school));
                            break;
                    }
                    //prompt for next employee/exit
                    this.nextEmployee();
                });
            }
        });
    }

    //Prompt user for employee role and return it
    promptRole() {
        return inquirer.prompt([
            {
                type: "list",
                message: "Enter your role",
                name: "role",
                choices: ["Manager", "Engineer", "Intern", "Exit"]
            }
        ]).then(function (data) {
            return (data.role);
        }).catch(function (error) {
            console.log(error);
        });
    }

    //prompt user for employee information and return it
    promptInfo(role) {
        switch (role) {
            case "Manager":
                return inquirer.prompt(this.managerPrompt).then(function (data) {
                    return data;
                });
            case "Engineer":
                return inquirer.prompt(this.engineerPrompt).then(function (data) {
                    return data;
                });
            case "Intern":
                return inquirer.prompt(this.internPrompt).then(function (data) {
                    return data;
                });
        }
    }

    //Reads a template html file and adds javascript string literal by calling get script
    //Writes an rendered team profile in html
    renderHTML() {
        fs.readFile('template/main.html', 'utf8', (err, htmlString) => {

            htmlString = htmlString("<script></script>").join(this.getScript());

            fs.writeFile('output/index.html', htmlString, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;
                // success case, the file was saved
                console.log('HTML generated!');
            });
        });

    }

    //return javascript that generates an employee information card per employee in the employees list
    getScript() {

        var scripts = ``;
        this.employees.forEach(e => {
            var field = "";
            var iconClass = "";
            switch (e.getRole()) {
                case "Manager":
                    field = `Office #: ${e.getOfficeNumber()}`;
                    iconClass = `users`;
                    break;
                case "Engineer":
                    field = `Github: ${e.getGithub()}`;
                    iconClass = `cogs`;
                    break;
                case "Intern":
                    field = `School: ${e.getSchool()}`;
                    iconClass = `user-graduate`;
                    break;
            }

            var cardScript = `
            <script>
            var col = $('<div class="col-4">');
            var card = $('<div class="card mx-auto border-info mb-3" style="max-width: 18rem;">');
            var header1 = $('<div class="card-header text-center h4">');
            header1.text("${e.getName()}");
            var header2 = $('<div class="card-header text-center">');
            var icon = $('<i class="fas fa-${iconClass}">');
            header2.text(" ${e.getRole()}");
            header2.prepend(icon);
            var cardBody = $('<div class="card-body text-info">');
            var cardTitle = $('<h5 class="card-title">');
            cardTitle.text("Employee Information:");
            var cardText = $('<p class="card-text">');
            cardText.text("ID: ${e.getId()}");
            var cardText2 = $('<p class="card-text">');
            cardText2.text("Email: ${e.getEmail()}");
            var cardText3 = $('<p class="card-text">');
            cardText3.text("${field}");
            cardBody.append(cardTitle);
            cardBody.append(cardText);
            cardBody.append(cardText2);
            cardBody.append(cardText3);
    
            card.append(header1);
            card.append(header2);
            card.append(cardBody);
            col.append(card);
            $("#cards").append(col);    
            </script>        
            `;
            scripts += cardScript;

        });

        return scripts;
    }


}


module.exports = App;