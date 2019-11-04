const Pool = require('pg').Pool
exports.pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'teamwork',
  password: 'eliday1234@',
  port: 5432,
});



