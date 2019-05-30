const db = require("./db");
const utils = require("./utils");

function doGetCityByName(name) {
	return new Promise(function(resolve, reject) {
		let query = "select city.id AS city_id, city.name AS city_name,"+
				" state.name AS state_name, country.name AS country_name,"+
				" country.sortname AS country_code"+
				" FROM cities AS city "+
				" LEFT JOIN states AS state ON city.state_id = state.id "+
				" LEFT JOIN countries AS country ON state.country_id = country.id "+
				" WHERE city.name LIKE '%"+name+"%'"
		db.connection.query(query, function(err, result) {
			if (err) {
				reject({})
			} else {
				resolve(result)
			}
		})	
	})
}

function doGetCountryByName(name) {
	return new Promise(function(resolve, reject) {
		let query = "select id, name, sortname AS code "+
				" FROM countries "+
				" WHERE name LIKE '%"+name+"%'"
		db.connection.query(query, function(err, result) {
			if (err) {
				reject({})
			} else {
				resolve(result)
			}
		})	
	})
}

module.exports = {

	get_city_by_name: function(cityname) {
		return new Promise(function(resolve, reject) {
			if (cityname === undefined || cityname.length < 2) {
				reject(utils.createErrorResp(-1, "Search text should be more than 2 characters"))
			} else {
				doGetCityByName(cityname)
					.then(result => resolve(utils.createSuccessResp(result)))
					.catch(err => utils.createSuccessResp(-2, "Error querying cities"))
			}
		})
	},

	get_city_country_by_name: function(name) {
		return new Promise(function(resolve, reject) {
			if (name === undefined || name.length < 2) {
				reject(utils.createErrorResp(-1, "Search text should be more than 2 characters"))
			} else {
				doGetCityByName(name).then(result => {
					let cityResult = result.map(r => {
						r["type"] = "city"
						return r
					})
					doGetCountryByName(name).then(countries => {
						let countryResult = countries.map(r => {
							r["type"] = "country"
							return r
						})
						resolve(utils.createSuccessResp(countryResult.concat(cityResult)))
					}).catch(err => utils.createSuccessResp(-3, "Error querying country"))
				}).catch(err => utils.createSuccessResp(-2, "Error querying cities"))
			}
		})
	}

}