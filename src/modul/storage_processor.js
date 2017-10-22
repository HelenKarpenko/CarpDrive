// Використати тип сутностей, які ви обрали у ЛР№1 для створення модуля-сховища колекції об'єктів цього типу. Кожен елемент у сховищі повинен мати унікальний ідентифікатор, що присвоюється йому при внесенні у сховище.
// Модуль назвати відповідно до типу, наприклад students.js і підключити його у основний файл проекту для використання. Модуль повинен містити такі асинхронні функції (повертають Promise-об'єкти):
// create(x) - додати у сховище новий елемент
// getAll() - отримати списком всі об'єкти зі сховища
// getById(x_id) - отримати елемент зі сховища за ідентифікатором
// update(x) - оновити дані елемента у сховищі
// remove(x_id) - видалити елемент зі сховища за ідентифікатором
// Реалізувати модуль таким чином, щоби всі описані функції асинхронно працювали із JSON файлом, що буде містити масив із об'єктами, кожен із яких повинен містити як мінімум:
// 2 строкових значеня
// 2 числових значення
// 1 строку із датою у форматі ISO 8601
// Реалізувати консольну програму, у якій користувач має можливість вводити консольні команди у програму для використання всіх функцій із модуля-сховища.

const folder = require('./folder_storage');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// '--------------------------------------------------------------------\n' +
// '1) create(x) - додати у сховище новий елемент\n' +
// '2) getAll() - отримати списком всі об\'єкти зі сховища\n' +
// '3) getById(x_id) - отримати елемент зі сховища за ідентифікатором\n' +
// '4) update(x) - оновити дані елемента у сховищі\n' +
// '5) remove(x_id) - видалити елемент зі сховища за ідентифікатором\n' +
// '--------------------------------------------------------------------\n' +
// 'Enter command:'
function question(questStr){
    return new Promise((resolve)=>{
        rl.question(questStr, (answer) => {
            // console.log(`Thank you for your valuable feedback: ${answer}`);
            resolve(answer.trim());
            // rl.close();
        });
    });
}

function create() {
    let name;
    let img;
    let size;
    let type;
    let location;
    let owner;
    let description;
    question('Name: ')
        .then(answer => {
            name = answer;
            return question('Images: ');
        }).then(answer => {
            img = answer;
            return question('Size: ');
        })
        .then(answer => {
            size = Number(answer);
            return question('Type: ');
        })
        .then(answer => {
            type = answer;
            return question('Location: ');
        })
        .then(answer => {
            location = answer;
            return question('Owner: ');
        })
        .then(answer => {
            owner = answer;
            return question('Description: ');
        })
        .then(answer => {
            description = answer;
            folder.create(img,name,size,type,location,owner,description)
                .catch(err => console.error(err));
            askQuestion();
        });
}
function getAll() {
    folder.getAll()
        .then(data => console.log(data))
        .catch(err => console.error(err));
    askQuestion();
}
function getById() {
    question('id: ')
        .then(answer => {
            folder.getById(answer)
                .then(data => console.log(data))
                .catch(err => console.error(err));
            askQuestion();
        });
}
function update() {
    let id;
    let field;
    question('Enter id: ')
        .then(answer => {
            id = answer;
            console.log('Enter field name:');
            console.log('All field:');
            console.log('name');
            console.log('img');
            console.log('size');
            console.log('type');
            console.log('location');
            console.log('owner');
            console.log('description');
            return question('Enter field: ');
        })
        .then(answer => {
            field = answer;
            return question('Enter new value: ');
        }).then(answer => {
        folder.update(id,field,answer)
            .catch(err => console.log(err));
        askQuestion();
    });
}
function remove() {
    question('id: ')
        .then(answer => {
            folder.remove(answer)
                .catch(err => console.error(err));
            askQuestion();
        });
}

function askQuestion() {
    console.log('1) create(x) - додати у сховище новий елемент\n' +
        '2) getAll() - отримати списком всі об\'єкти зі сховища\n' +
        '3) getById(x_id) - отримати елемент зі сховища за ідентифікатором\n' +
        '4) update(x) - оновити дані елемента у сховищі\n' +
        '5) remove(x_id) - видалити елемент зі сховища за ідентифікатором\n' +
        '---------------------------------------------------------------------');
    question('Enter the command number: ')
        .then(answer => processInput(answer));
}

function processInput(answer) {
    switch (Number(answer)) {
        case 1:
            create();
            break;
        case 2:
            getAll();
            break;
        case 3:
            getById();
            break;
        case 4:
            update();
            break;
        case 5:
            remove();
            break;
        default:
            break;
    }
}
module.exports = {
    start:askQuestion
};