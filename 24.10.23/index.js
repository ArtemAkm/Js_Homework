const { Telegraf } = require('telegraf')
const sqlite3 = require('sqlite3').verbose()

const bot = new Telegraf('6373366804:AAE5_alofKpDkRmufoFt3XjEIhcOJufKUgM')

const db = new sqlite3.Database('db.sqlite3')

// Создаем таблицу "Users" в базе данных
function createUserTable() {
    const query = `CREATE TABLE Users(
        id INTEGER PRIMARY KEY,
        status varchar(255),
        friend int
    );`
    db.run(query)
}
// createUserTable()

// Добавляем пользователя в базу данных
function addUser(id) {
    const query = `INSERT INTO Users (id, status) VALUES(?,?)`
    db.run(query, [id, "in_search"])
}

// Получаем информацию о пользователе из базы данных
function getUser(id, callback) {
    const query = `SELECT status, friend FROM Users WHERE id = ${id}`
    db.get(query, (err, res) => {
        callback(res)
    })
}

// Обновляем статус пользователя в базе данных
function updateStatus(id, status) {
    const query = `UPDATE Users SET status = '${status}' WHERE id = ${id}`
    db.run(query)
}

// Обновляем информацию о (друге) в базе данных
function updateFriend(id, friend) {
    const query = `UPDATE Users SET friend = ${friend} WHERE id = ${id}`
    db.run(query)
}

// Получаем список пользователей в поиске собеседника, исключая текущего пользователя
function getInSearchUsers(id, callback) {
    const query = `SELECT id FROM Users WHERE status = 'in_search' AND id <> ${id}`
    db.all(query, (err, res) => {
        callback(res)
    })
}

// Ищем случайного собеседника и устанавливаем связь
function findFriend(id) {
    getInSearchUsers(id, (res) => {
        if (res.length > 0) {
            const index = Math.floor(Math.random() * res.length)
            const randomUser = res[index]
            updateStatus(id, 'meet')
            updateStatus(randomUser.id, 'meet')
            updateFriend(id, randomUser.id)
            updateFriend(randomUser.id, id)
            bot.telegram.sendMessage(randomUser.id, "Співрозмовника знайдено. Можете спілкуватись")
            bot.telegram.sendMessage(id, "Співрозмовника знайдено. Можете спілкуватись")
        }
    })
}

// Запуск бота и поиск собеседника с помощью отдельной функции
bot.start((ctx) => {
    getUser(ctx.from.id, (res) => {
        if (res) {
            if (res.status == "standart") {
                updateStatus(ctx.from.id, "in_search")
                ctx.reply('Шукаємо співрозмовника')
                findFriend(ctx.from.id)
            } else if (res.status == "in_search") {
                ctx.reply('Ми вже шукаємо співрозмовника')
            } else if (res.status == "meet") {
                ctx.reply('У вас вже є співрозмовник. Напишіть /stop щоб зупинити бесіду')
            }
        } else {
            addUser(ctx.from.id)
            ctx.reply('Шукаємо співрозмовника')
            findFriend(ctx.from.id)
        }
    })
})

// Команда, которая завершит беседу
bot.command("stop", (ctx) => {
    getUser(ctx.from.id, (res) => {
        if (res) {
            if (res.status == "meet") {
                updateStatus(ctx.from.id, "standart")
                updateFriend(ctx.from.id, null)
                updateStatus(res.friend, 'standart')
                updateFriend(res.friend, null)
                ctx.reply('Розмову закінчено.')
                bot.telegram.sendMessage(res.friend, 'Співрозмовник завершив бесіду.')
            } else {
                ctx.reply("У вас немає співрозмовника.")
            }
        }
    })
})

// Обработчик текстовых сообщений 
bot.on('text', (ctx) => {
    getUser(ctx.from.id, (res) => {
        if (res) {
            if (res.status == 'meet') {
                bot.telegram.sendMessage(res.friend, ctx.message.text)
            } else {
                ctx.reply('З ким ви спілкуєтесь?')
            }
        } else {
            ctx.reply('Напишіть /start щоб знайти співрозмовника.')
        }
    })
})

// Запускаем бота
bot.launch()