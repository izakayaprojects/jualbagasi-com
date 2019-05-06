const db = require("./db");
const utils = require("./utils");

module.exports = {

	get_city_by_name: function(cityname) {
		return new Promise(function(resolve, reject) {
			if (cityname === undefined || cityname.length < 2) {
				reject(utils.createErrorResp(-1, "Search text should be more than 2 characters"))
			} else {
				let query = "select city.id AS city_id, city.name AS city_name,"+
					" state.name AS state_name, country.name AS country_name,"+
					" country.sortname AS country_code"+
					" FROM cities AS city "+
					" LEFT JOIN states AS state ON city.state_id = state.id "+
					" LEFT JOIN countries AS country ON state.country_id = country.id "+
					" WHERE city.name LIKE '%"+cityname+"%'"
				db.connection.query(query, function(err, result) {
					if (err) {
						reject(utils.createErrorResp(-2, "Error querying cities"))
					} else {
						resolve(utils.createSuccessResp(result))
					}
				})
			}
		})
	}

}