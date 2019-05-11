module.exports = {
	createErrorResp: function(id, msg) {
		return {success: false, id: id, message: msg}
	},
	createSuccessResp: function(data) {
		return {success: true, data: data}
	},
	getImageUrl(req, imgName) {
		return req.protocol+"://"+req.get("host")+"/uploads/"+imgName
	}
}