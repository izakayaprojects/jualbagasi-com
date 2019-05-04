const db = require("./db");
const utils = require("./utils");
const auth = require("./auth");
const crypto = require("crypto");

function do_add_routes(routes) {
	return new Promise(function(resolve, reject) {
		let queryRoute = "INSERT INTO tbl_destinations VALUES ?"
		db.connection.query(queryRoute, [routes], function(err, result) {
			if (err) reject()
			else resolve()
		})
	})
}

module.exports = {
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
					"(_id,user_id,title,description,banner,from_date,to_date,capacity_kg,fee_per_kg,currency) "+
					"VALUES (?,?,?,?,?,?,?,?,?,?)"
				let params = [newPOId,userId,
					po.title,po.description,po.banner,
					po.startDate,po.endDate,
					po.capacity,po.fee,po.currency]
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
							let queryRoute = "INSERT INTO tbl_destinations VALUES (?)"
							let values = []
							let routeIds = []
							for (var i = 0 ; i < routes.length ; i++) {
								let newRouteId = suffixPoId+"-"+crypto.randomBytes(8).toString("hex");
								routeIds.push(newRouteId)
								let r = routes[i]
								let note = r.note === undefined ? "" : r.note
								values.push([newRouteId,newPOId,r.city,r.country,r.arrivalDate,r.departureDate,r.note])
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
	}
}