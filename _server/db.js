const mysql = require('mysql');
const md5 = require("md5");
const crypto = require("crypto");

module.exports = {
	connection: mysql.createConnection({
		host: 'localhost',
		user: 'jualbagasi',
		password: 'jualbagasi',
		database: 'db_nitipteman_test'
	}),

	connect: function() {
		this.connection.connect(function(err) {
			if (!err) console.log("Connected to DB!");
			else console.log("Error: "+err);
		});
	},
}