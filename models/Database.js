var sql = require('mysql');

const option = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node'
} /// instead this use .env const!!!!

class database {

    init() {
        return sql.createConnection(option)
    }

}

module.exports = database;