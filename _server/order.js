const db = require("./db");
const utils = require("./utils");
const auth = require("./auth");
const crypto = require("crypto");

function do_add_routes(routes) {
	return new Promise(function(resolve, reject) {
		let queryRoute = "INSERT INTO tbl_destinations "+
			"(_id,po_id,city,country,country_code,est_item_arrival_date,note) VALUES ?"
		db.connection.query(queryRoute, [routes], function(err, result) {
			if (err) reject()
			else resolve()
		})
	})
}

function do_parse_destination_concat(dests) {
	let destinations = dests.split(",")
	let parsed = []
	destinations.forEach(e => {
		let destElems = e.split(";")
		parsed.push({
			id: destElems[0], // Id
			code: destElems[1], // Country code
			city: destElems[2], // city name
			country: destElems[3], // country name
			estItemArrivalDate: destElems[4] // estimated item arrival date
		})
	})
	return parsed
}

module.exports = {
	get_summary_purchase_orders: function(token) {
		return new Promise(function(resolve, reject) {
			auth.check_token(token).then(result => {
				let userid = result["data"]["userid"]
				let concatOrders = "(SELECT GROUP_CONCAT(CONCAT(ord._id, ';', ord.capacity)) "+
					"FROM tbl_orders ord WHERE ord.po_id = po._id GROUP BY po._id) "+
					"AS orders"
				let query = "SELECT po._id AS po_id, po.title AS po_title, po.banner AS po_banner, "+
					"po.capacity_kg AS po_capacity,"+
					"po.from_date AS po_from, po.to_date AS po_to, po.destinations AS po_dest_count, "+
					concatOrders+" "+
					"FROM tbl_purchase_order po WHERE po.user_id = ?"
				db.connection.query(query, [userid], function(err, results) {
					if (err) {
						reject(utils.createErrorResp(-11, "Error getting purchase orders"))
					} else {
						let data = results.map(r => {
							r["po_dest_count"] = r["po_dest_count"].split(",").length
							if (r["orders"] !== null) {
								let parsedOrders = []
								let orders = r["orders"].split(",")
								orders.forEach(e => {
									let orderElems = e.split(";")
									parsedOrders.push({
										id: orderElems[0],
										capacity: orderElems[1]
									})
								})
								r["orders"] = parsedOrders
							}
							return r
						})
						resolve(utils.createSuccessResp(data))
					}
				})
			}).catch(err => {
				reject(err)
			})
		})
	},

	get_displaylist_purchase_orders: function(token) {
		return new Promise(function(resolve, reject) {
			let concatDest = "(SELECT GROUP_CONCAT(CONCAT(dst._id, ';', dst.country_code)) "+
				"FROM tbl_destinations dst WHERE dst.po_id = po._id GROUP BY po._id) "+
				"AS po_dest"
			let concatOrders = "(SELECT GROUP_CONCAT(ord.capacity SEPARATOR ';') "+
				"FROM tbl_orders ord WHERE ord.po_id = po._id GROUP BY po._id) "+
				"AS po_orders"
			let query = "SELECT po._id AS po_id, po.title AS po_title, po.banner AS po_banner, "+
					"po.from_date AS po_from, po.to_date AS po_to, po.capacity_kg AS po_capacity,"+
					concatDest+", "+
					concatOrders+" "+
					"FROM tbl_purchase_order po "+
					"ORDER BY po.from_date DESC"
			db.connection.query(query, function(err, results) {
				if (err) {
					reject(utils.createErrorResp(-11, "Error getting purchase orders"))
				} else {
					let data = results.map(r => {
						if (r["po_dest"] !== null) {
							r["destinations"] = do_parse_destination_concat(r["po_dest"])
						}
						if (r["po_orders"] !== null) {
							let orders = r["po_orders"].split(";")
							let taken = orders.reduce((accu, current) => current + parseFloat(accu))
							r["po_remaining_capacity"] = parseFloat(r["po_capacity"]) - taken
						} else {
							r["po_remaining_capacity"] = r["po_capacity"]
						}
						r["po_orders"] = undefined
						r["po_dest"] = undefined
						return r
					})
					resolve(utils.createSuccessResp(results))
				}
			})
		})
	},


	get_purchase_order: function(po_id) {
		return new Promise(function(resolve, reject) {
			let concatOrders = "(SELECT GROUP_CONCAT(ord.capacity SEPARATOR ';') "+
				"FROM tbl_orders ord WHERE ord.po_id = po._id GROUP BY po._id) "+
				"AS po_orders"
			let concatDest = "(SELECT GROUP_CONCAT(CONCAT("+
				"dst._id,';',dst.country_code,';',dst.city,';',dst.country,';',dst.est_item_arrival_date)) "+
				"FROM tbl_destinations dst WHERE dst.po_id = po._id GROUP BY po._id) "+
				"AS po_dest"
			let query = "SELECT po._id AS po_id, po.title AS po_title, po.description AS po_desc, "+
				"po.banner AS po_banner, po.from_date AS po_from, po.to_date AS po_to, po.capacity_kg AS po_capacity,"+
				"po.fee_per_kg AS po_fee, "+
				"curr.symbol AS curr_symbol, "+
				"u._id AS user_id, u.username AS user_username, u.profile_picture AS user_pp, "+
				concatDest+", "+
				concatOrders+" "+
				"FROM tbl_purchase_order po "+
				"LEFT JOIN tbl_currencies curr ON curr._id = po.currency_id "+
				"LEFT JOIN tbl_users u ON u._id = po.user_id "+
				"WHERE po._id = ?"
			db.connection.query(query, [po_id], function(err, results) {
				if (err) {
					reject(utils.createErrorResp(-1, "Error querying purchase order"))
				} else {
					if (results.length === 0) {
						reject(utils.createErrorResp(-2, "Purchase order not found"))
					} else {
						let data = results.map(r => {
							if (r["po_dest"] !== null) {
								r["destinations"] = do_parse_destination_concat(r["po_dest"])
							}
							if (r["po_orders"] !== null) {
								let orders = r["po_orders"].split(";")
								let taken = orders.reduce((accu, current) => current + parseFloat(accu))
								r["po_remaining_capacity"] = parseFloat(r["po_capacity"]) - taken
							} else {
								r["po_remaining_capacity"] = r["po_capacity"]
							}
							r["po_orders"] = undefined
							r["po_dest"] = undefined
							return r
						})
						resolve(utils.createSuccessResp(results[0]))
					}
				}
			})

		})
	},

	add_purchase_order: function(token, po) {
		return new Promise(function(resolve, reject) {
			auth.check_token(token).then(result => {
				if (po === undefined) {
					reject(utils.createErrorResp(-11, "Purchase order data is missing"))
					return
				}

				let userId = result["data"]["userid"]
				let newPOId = crypto.randomBytes(32).toString("hex");
				// Add the purchase order first
				let query = "INSERT INTO tbl_purchase_order "+
					"(_id,user_id,title,description,banner,from_date,to_date,capacity_kg,fee_per_kg,currency_id) "+
					"VALUES (?,?,?,?,?,?,?,?,?,?)"
				let params = [newPOId,userId,
					po.title,po.description,po.banner,
					po.startDate,po.endDate,
					po.capacity,po.fee,po.currency_id]
				db.connection.query(query, params, function(err, result) {
					if (err) {
						reject(utils.createErrorResp(-12, "PO data is missing some fields"))
					} else {
						// Add the routes if any
						if (po.routes === undefined || po.routes.length === 0) {
							resolve(utils.createSuccessResp({purchase_order_id: newPOId}))
						} else {
							let suffixPoId = newPOId.substr(newPOId.length - 6)
							let routes = po.routes
							let values = []
							let routeIds = []
							for (var i = 0 ; i < routes.length ; i++) {
								let newRouteId = suffixPoId+"-"+crypto.randomBytes(8).toString("hex");
								routeIds.push(newRouteId)
								let r = routes[i]
								let note = r.note === undefined ? "" : r.note
								values.push([newRouteId,newPOId,r.city,r.country,
									r.country_code,r.estItemArrivalDate,r.note])
							}
							do_add_routes(values).then(result => {
								// Update the PO with the routes' IDs
								let queryUpdate = "UPDATE tbl_purchase_order SET destinations=? WHERE _id=?"
								let updateParams = [routeIds.join(), newPOId]
								db.connection.query(queryUpdate, updateParams, function(err, result) {
									if (err) {
										reject(utils.createErrorResp(-14, "Error updating PO with routes"))
									} else {
										resolve(utils.createSuccessResp({purchase_order_id: newPOId}))
									}
								})
							}).catch(err => {
								reject(utils.createErrorResp(-13, "Error inserting routes"))
							})
						}

					}
				})
			}).catch(err => {
				reject(err)
			})
		})
	},

	edit_purchase_order: function(token, po_id, column, values) {
		return new Promise(function(resolve, reject) {
			if (column.length !== values.length) {
				reject(utils.createErrorResp(-11, "Values don't match the number of properties changed"))
			}

			auth.check_token(token).then(result => {
				let userid = result["data"]["userid"]
				let checkOrder = "SELECT user_id FROM tbl_purchase_order WHERE _id = ?"
				db.connection.query(checkOrder, [po_id], function(err, order) {
					if (err || order.length === 0) {
						reject(utils.createErrorResp(-12, "Purchase Order not found"))
					} else {
						let orderOwner = order[0]["user_id"]
						if (orderOwner !== userid) {
							reject(utils.createErrorResp(-13, "You are not the owner of this purchase order"))
						} else {
							let query = "UPDATE tbl_purchase_order SET "
							for (var i = 0; i < column.length ; i++) {
								query += column[i]+"=?"
								if (i < column.length - 1) {
									query += ","
								}
							}
							query += " WHERE _id=?"
							values.push(po_id)
							db.connection.query(query, values, function(err, results) {
								if (err) {
									reject(utils.createErrorResp(-14, "Cannot update Purchase order"))
								} else {
									resolve(utils.createSuccessResp({}))
								}
							})
						}
					}
				})
			}).catch(err => reject(err))
		})
	},

	get_currencies: function() {
		return new Promise(function(resolve, reject) {
			let query = "SELECT * FROM tbl_currencies"
			db.connection.query(query, function(err, results) {
				if (err) {
					reject(utils.createErrorResp(-1, "Error getting currency"))
				} else {
					resolve(utils.createSuccessResp(results))
				}
			})
		})
	},

	edit_destination: function(token, po_id, dest_id, cols, values) {
		return new Promise(function(resolve, reject) {
			if (!po_id || po_id === "") {
				reject(utils.createErrorResp(-11, "Purchase order id should not be empty"))
			}

			if (!dest_id || dest_id === "") {
				reject(utils.createErrorResp(-12, "Destination id should not be empty"))
			}

			if (cols.length !== values.length) {
				reject(utils.createErrorResp(-15, "Columns and values don't match"))
			}
			auth.check_token(token).then(info => {
				let userid = info["data"]["userid"]
				let getPOOwner = "SELECT user_id, destinations FROM tbl_purchase_order WHERE _id=?"
				db.connection.query(getPOOwner, [po_id], function(err, po) {
					if (err || po.length === 0) {
						reject(utils.createErrorResp(-13, "Purchase order not found"))
					} else {
						let order = po[0]
						if (order["user_id"] !== userid || !order["destinations"].includes(dest_id)) {
							reject(utils.createErrorResp(-14, "You are not the owner"))
						} else {
							let updateDest = "UPDATE tbl_destinations SET "
							for (var i = 0 ; i < cols.length ; i++) {
								updateDest += cols[i] + "=?"
								if (i < cols.length-1) updateDest+=","
							}
							updateDest+=" WHERE _id=?"
							values.push(dest_id)
							db.connection.query(updateDest, values, function(err, results) {
								if (err) {
									reject(utils.createErrorResp(-16, "Failed to update Destination"))
								} else {
									resolve(utils.createSuccessResp({}))
								}
							})
						}
					}
				})

			}).catch(err => {reject(error)})

		})
	},

	delete_destination: function(token, po_id, dest_id) {
		return new Promise(function(resolve, reject) {
			if (!po_id || po_id === "") {
				reject(utils.createErrorResp(-11, "Purchase order id should not be empty"))
			}

			if (!dest_id || dest_id === "") {
				reject(utils.createErrorResp(-12, "Destination id should not be empty"))
			}

			auth.check_token(token).then(info => {
				let userid = info["data"]["userid"]
				let getPOOwner = "SELECT user_id, destinations FROM tbl_purchase_order WHERE _id=?"
				db.connection.query(getPOOwner, [po_id], function(err, po) {
					if (err || po.length === 0) {
						reject(utils.createErrorResp(-13, "Purchase order not found"))
					} else {
						let order = po[0]
						if (order["user_id"] !== userid) {
							reject(utils.createErrorResp(-14, "You are not the owner"))
						} else {
							let dests = order["destinations"].split(",")
							let idx = dests.indexOf(dest_id)
							if (idx > -1) {
								dests.splice(idx, 1)
							}
							let updatePO = "UPDATE tbl_purchase_order SET destinations=? WHERE _id=?"
							db.connection.query(updatePO, [dests.join(","), po_id], function(err, results) {
								if (err) {
									reject(utils.createErrorResp(-15, "Failed to update Purchase order"))
								} else {
									let delRoute = "DELETE FROM tbl_destinations WHERE _id=?"
									db.connection.query(delRoute, [dest_id], function(err, deleted) {
										console.log(err)
									})
									resolve(utils.createSuccessResp({}))
								}
							})
						}
					}
				})

			}).catch(err => {reject(error)})
		})
	},

	edit_banner(fs, file, token, po_id) {
		return new Promise(function(resolve, reject) {
			if (!file || file === null) {
				reject(utils.createErrorResp(-11, "Missing image"))
				return
			}
			if (!file.mimetype.startsWith("image")) {
				reject(utils.createErrorResp(-12, "Only image is allowed"))
				return
			}

			if (!po_id || po_id === null) {
				reject(utils.createErrorResp(-13, "Missing purchase order id"))
				return
			}

			auth.check_token(token).then(result => {
				let userId = result["data"]["userid"]
				let tempPath = file.path
				let extension = file.originalname.split(".").pop()
				let finalImageName = "banner_"+po_id+"."+extension
				let target = "uploads/"+finalImageName
				fs.rename(tempPath, target, function(err) {
					if (err) {
						fs.unlink(tempPath, err => console.log(err))
						reject(utils.createErrorResp(-14, "Error moving image to directory"))
					} else {
						let query = "UPDATE tbl_purchase_order SET banner=? WHERE _id=?"
						db.connection.query(query, [finalImageName, po_id], function(err, result) {
							if (err) {
								reject(utils.createErrorResp(-15, "Error updating purchase order"))
							} else {
								resolve(utils.createSuccessResp({ banner_path: finalImageName }))
							}
						})
					}
				})
			}).catch(err => {
				reject(err)
			})
		})
	}
}