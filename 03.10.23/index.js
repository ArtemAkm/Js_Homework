const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class User {
    constructor(name, role) {
        this.name = name;
        this.role = role;
        this.grades = {};
    }

    addGrade(subject, grade) {
        this.grades[subject] = grade;
    }

    viewGrades() {
        console.log(`Оцінки для користувача ${this.name}:`);
        for (let subject in this.grades) {
            console.log(`${subject}: ${this.grades[subject]}`);
        }
    }
}

const users = {}; 

function addUser(name, role) {
    users[name] = new User(name, role);
}

function authorizeUser() {
    rl.question("Введіть ваше ім'я: ", (name) => {
        rl.question("Ви викладач (1) чи учень (2)? ", (role) => {
            if (role === '1' || role === '2') {
                addUser(name, role);
                console.log(`${name}, ви успішно авторизувалися.`);
                main(name);
            } else {
                console.log("Невірний вибір ролі. Спробуйте ще раз.");
                authorizeUser();
            }
        });
    });
}

function viewStudents() {
    console.log("Список учнів:");
    for (let name in users) {
        if (users[name].role === '2') {
            console.log(name);
        }
    }
}

function addGrade(teacherName, studentName) {
    rl.question("Введіть предмет: ", (subject) => {
        rl.question("Введіть оцінку: ", (grade) => {
            if (users[studentName]) {
                users[studentName].addGrade(subject, grade);
                console.log(`Оцінка ${grade} була додана учню ${studentName} за предмет ${subject}.`);
            } else {
                console.log(`Користувача з ім'ям ${studentName} не існує.`);
            }
            main(teacherName);
        });
    });
}

function main(username) {
    rl.question(`\n\nВиберіть опцію:\n1 - Переглянути список учнів\n2 - Додати оцінку учню\n3 - Переглянути свої оцінки\n4 - Вийти\n`, 
    (choice) => {
        switch (choice) {
            case '1':
                viewStudents();
                main(username);
                break;
            case '2':
                if (users[username] && users[username].role === '1') {
                    rl.question("Введіть ім'я учня, якому хочете поставити оцінку: ", (studentName) => {
                        addGrade(username, studentName);
                    });
                } else {
                    console.log("Ви не викладач. Недоступна опція.");
                    main(username);
                }
                break;
            case '3':
                if (users[username] && users[username].role === '2') {
                    users[username].viewGrades();
                } else {
                    console.log("Ви не учень. Недоступна опція.");
                }
                main(username);
                break;
            case '4':
                rl.close();
                break;
            default:
                console.log("Невірний вибір. Спробуйте ще раз.");
                main(username);
                break;
        }
    });
}

authorizeUser();