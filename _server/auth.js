const db = require("./db");
const utils = require("./utils");
const crypto = require("crypto");
const md5 = require("md5");

const AUTH_KEY_LIFETIME = 1000 * 3600 * 24; // 1 Day

function newLoginToken() {
	return crypto.randomBytes(64).toString("hex");
}

function doCheckToken(token) {
	return new Promise(function(resolve, reject) {
		let query = "SELECT * FROM tbl_user_auth WHERE token = ?";
		db.connection.query(query, [token], function(err, result) {
			if (result.length === 0) {
				reject(utils.createErrorResp(-1, "Token does not exist"))
			} else {
				let auth = result[0];
				let expiration = new Date(auth.expired_at);
				let now = new Date();
				if (expiration < now) {
					// Expired
					reject(utils.createErrorResp(-2, "Token expired"))
				} else {
					// Still valid
					resolve(utils.createSuccessResp({valid: true, userid: auth.user_id}))
				}
			}
		})
	})
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
								let query = "UPDATE tbl_user_auth SET token=?, expired_at=? WHERE user_id=?";
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
	},

	logout: function(token) {
		return new Promise(function(resolve, reject) {
			let query = "DELETE FROM tbl_user_auth WHERE token = ?"
			db.connection.query(query, [token], function(err, result) {
				if(err) {
					reject(utils.createErrorResp(-1, "Database Error"))
				} else {
					if (result["affectedRows"] == 1) {
						resolve(utils.createSuccessResp({deleted_token: token}))
					} else {
						reject(utils.createErrorResp(-2, "Unknown token"))
					}
				}
			})
		})
	},

	upload_profile_picture: function(token, file, fs) {
		return new Promise(function(resolve, reject) {
			if (!file || file === null) {
				reject(utils.createErrorResp(-11, "Missing image"))
				return
			}
			if (!file.mimetype.startsWith("image")) {
				reject(utils.createErrorResp(-12, "Only image is allowed"))
				return
			}
			doCheckToken(token).then(result => {
				let userId = result["data"]["userid"]
				let tempPath = file.path
				let extension = file.originalname.split(".").pop()
				let finalImageName = "users/pp_"+userId+"."+extension
				let target = "uploads/"+finalImageName
				fs.rename(tempPath, target, function(err) {
					if (err) {
						fs.unlink(tempPath, err => console.log(err) )
						reject(utils.createErrorResp(-13, "Error moving image to directory"))
					} else {
						let query = "UPDATE tbl_users SET profile_picture=? WHERE _id=?"
						db.connection.query(query, [finalImageName, userId], function(err, result) {
							if (err) {
								reject(utils.createErrorResp(-14, "Error updating profile picture"))
							} else {
								resolve(utils.createSuccessResp({ 
									profile_picture_path: finalImageName 
								}))
							}
						})
					}
				})
			}).catch(err => {
				reject(err)
			})
		})
	},

	get_user: function(token) {
		return new Promise(function(resolve, reject) {
			let query = "SELECT u._id AS id, u.email AS email, u.username AS username,"+
				"u.role AS role, u.is_active AS is_active, u.profile_picture AS profile_pic, "+
				"u.created_at AS created_at "+
				"FROM tbl_users u "+
				"LEFT JOIN tbl_user_auth auth ON auth.user_id = u._id "+
				"WHERE auth.token = ?"
			db.connection.query(query, [token], function(err, results) {
				if (err) {
					reject(utils.createErrorResp(-1, "Error retrieving users"))
				} else {
					if (results.length === 0) {
						reject(utils.createErrorResp(-2, "User not found"))
					} else {
						resolve(utils.createSuccessResp(results[0]))
					}
				}
			})
		})
	},

	check_token: doCheckToken
}