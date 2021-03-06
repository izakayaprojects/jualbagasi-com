const db = require("./db");
const utils = require("./utils");
const mailer = require("./mailer");
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

	edit_username: function(token, username) {
		return new Promise(function(resolve, reject) {
			doCheckToken(token).then(result => {
				let userid = result["data"]["userid"]
				let queryUser = "SELECT _id FROM tbl_users WHERE username=?"
				db.connection.query(queryUser, [username], function(err, results) {
					if (results.length > 0) {
						reject(utils.createErrorResp(-11, "Username sudah diambil"))
					} else {
						let query = "UPDATE tbl_users SET username=? WHERE _id=?"
						db.connection.query(query, [username, userid], function(err, results) {
							if (err) {
								reject(utils.createErrorResp(-12, "Username gagal di-update"))
							} else {
								resolve(utils.createSuccessResp({
									username: username
								}))
							}
						})
					}
				})
			}).catch(err => reject(err))
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
				"u.is_email_confirmed AS email_confirmed, u.created_at AS created_at "+
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

	register: function(email, password, username) {
		return new Promise(function(resolve, reject) {
			let query = "SELECT _id FROM tbl_users WHERE email=?"
			// Check email
			db.connection.query(query, [email], function(err, results) {
				if (results.length > 0) {
					reject(utils.createErrorResp(-1, "Email address is used"))
				} else {
					// Check username
					let checkUsername = "SELECT _id FROM tbl_users WHERE username=?"
					db.connection.query(checkUsername, [username], function(err, usernames) {
						if (usernames.length > 0) {
							reject(utils.createErrorResp(-2, "Username is already used"))
						} else {
							// Register
							let newId = crypto.randomBytes(16).toString("hex")
							let confirmationToken = crypto.randomBytes(16).toString("hex")
							let registerQ = "INSERT INTO tbl_users "+
								"(_id,email,username,password,confirmationToken) VALUES "+
								"(?,?,?,?,?)"
							db.connection.query(registerQ, 
								[newId,email,checkUsername,md5(password),confirmationToken],
								function(err, reg) {
									if (err) {
										reject(utils.createErrorResp(-3, "Error registering new user"))
									} else {
										mailer.send_email_confirmation(email, confirmationToken)
										resolve(utils.createSuccessResp({
											new_user_id: newId,
											confirmation_token: confirmationToken
										}))
									}
								})
						}
					})
				}
			})
		})
	},

	resend_email_confirm: function(userid) {
		return new Promise(function(resolve, reject) {
			let user = "SELECT email FROM tbl_users WHERE _id=?"
			db.connection.query(user, [userid], function(err, results) {
				if (err || results.length === 0) {
					reject(utils.createErrorResp(-1, "User not found"))
				} else {
					let email = results[0]["email"]
					let confToken = crypto.randomBytes(16).toString("hex")
					let updateConfToken = "UPDATE tbl_users SET confirmation_token=? WHERE _id=?"
					db.connection.query(updateConfToken, [confToken, userid], function(err, updated) {
						if (err) {
							reject(utils.createErrorResp(-2, "Failed to update token"))
						} else {
							mailer.send_email_confirmation(email, confToken)
							resolve(utils.createSuccessResp({
								sent_to: email
							}))
						}
					})
				}
			})
		})
	},

	confirm_token: function(confirmationToken) {
		return new Promise(function(resolve, reject) {
			let query = "SELECT _id FROM tbl_users WHERE confirmation_token=?"
			db.connection.query(query, [confirmationToken], function(err, results) {
				if (err || results.length == 0) {
					reject(utils.createErrorResp(-1, "Invalid confirmation token"))
				} else {
					let userid = results[0]["_id"]
					let updateStatus = "UPDATE tbl_users SET confirmation_token=?, is_email_confirmed=? WHERE _id=?"
					db.connection.query(query, ["", true, userid], function(err, results) {
						if (err) {
							reject(utils.createErrorResp(-2, "Cannot validate account"))
						} else {
							resolve(utils.createSuccessResp({}))
						}
					})
				}
			})
		})
	},

	check_token: doCheckToken
}