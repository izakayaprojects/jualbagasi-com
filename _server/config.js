const DEV = {
	hostsite: "http://localhost:4200",
	db_conn: {
		host: 'localhost',
		user: 'jualbagasi',
		password: 'jualbagasi',
		database: 'db_nitipteman_test'
	}
}

const PRODUCTION = {
	hostsite: "",
	db_conn: {
		host: 'localhost',
		user: 'jualbagasi',
		password: 'jualbagasi',
		database: 'db_nitipteman_test'
	}
}

module.exports = {
	get: function() {
		let env = process.env.NODE_ENV || "dev"
		if (env === "production") return PRODUCTION
		return DEV
	}
}