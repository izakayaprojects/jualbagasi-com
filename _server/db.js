const mysql = require('mysql');
const md5 = require("md5");
const crypto = require("crypto");
const config = require("./config");

const conf = config.get()

module.exports = {
	connection: mysql.createConnection(conf.db_conn),

	connect: function() {
		this.connection.connect(function(err) {
			if (!err) console.log("Connected to DB!");
			else console.log("Error: "+err.stack);
		});
	},
}