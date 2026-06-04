const pg = require("pg");


const Pool = new pg.Pool({
  user: "nikitametelev",
  password: "27021989",
  host: "localhost",
  port: 5432,
  database: "utvls",
})


module.exports = Pool;