const db = require("./db");
const utils = require("./utils");
const crypto = require("crypto");
const md5 = require("md5");

const AUTH_KEY_LIFETIME = 1000 * 3600 * 24; // 1 Day

function newLoginToken() {
	return crypto.randomBytes(64).toString("hex");
}

module.exports = {
	login: function(email, pass) {
		return new Promise(function(resolve, reject) {
			var query = "SELECT _id FROM tbl_users WHERE email = ? AND password = ?";
			db.connection.query(query, [email, md5(pass)], function(err, results) {
				if (results.length == 0) {
					reject(utils.createErrorResp(-1, "Wrong username / password"))
				} else {
					let userid = results[0]._id;
					let query = "SELECT * FROM tbl_user_auth WHERE user_id = ?";
					db.connection.query(query, [userid], function(err, results) {
						if (results.length == 0) {
							// No token yet, create new
							let token = newLoginToken();
							let expiration = new Date(Date.now() + AUTH_KEY_LIFETIME);
							let query = "INSERT INTO tbl_user_auth VALUES (?,?,?)";
							db.connection.query(query, [userid, token, expiration], function(err, results) {
								if (results) {
									resolve(utils.createSuccessResp({
										user_id: userid,
										token: token
									}))
								}
							})
						} else {
							// Check expiration
							let expiration = new Date(results[0].expired_at);
							let now = new Date();
							if (expiration < now) {
								// Expired
								let token = newLoginToken();
								let expiration = new Date(Date.now() + AUTH_KEY_LIFETIME);
								let query = "UDPATE tbl_user_auth SET token=?, expired_at=? WHERE user_id=?";
								db.connection.query(query, [token, expiration, userid], function(err, results) {
									if (results) {
										resolve(utils.createSuccessResp({
											user_id: userid,
											token: token
										}))
									}
								})
							} else {
								resolve(utils.createSuccessResp({
									user_id: userid,
									token: results[0].token
								}))
							}
						}
					})
				}
			})
		});
	}
}