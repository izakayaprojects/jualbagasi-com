const express = require("express");
const db = require("./db");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require("./auth")
const order = require("./order")
const cities = require("./cities")
const utils = require("./utils")
const mailer = require("./mailer")

db.connect();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const imageUpload = multer({ dest: "temp" })

app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next();
})
app.use("/static", express.static(path.join(__dirname, 'uploads')))

app.get("/", function(req, res) {
	res.send("Hello")
})

app.get("/api/autocomplete/city", function(req, res) {
	cities.get_city_by_name(req.query.search).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.get("/api/currencies", function(req, res) {
	order.get_currencies().then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/login", function(req, res) {
	auth.login(req.body.email, req.body.password).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/logout", function(req, res) {
	auth.logout(req.body.token).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/purchaseorder/add", function(req, res) {
	order.add_purchase_order(req.body.token, req.body.data).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/purchaseorder/list-summary", function(req, res) {
	order.get_summary_purchase_orders(req.body.token).then(result => {
		result["data"] = result["data"].map(i => {
			i["po_banner"] = utils.getImageUrl(req, i["po_banner"])
			return i
		})
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.get("/api/purchaseorder/list-display", function(req, res) {
	order.get_displaylist_purchase_orders().then(result => {
		result["data"] = result["data"].map(i => {
			if (i["po_banner"])  i["po_banner"] = utils.getImageUrl(req, i["po_banner"])
			return i
		})
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.get("/api/purchaseorder/item/:id", function(req, res) {
	order.get_purchase_order(req.params.id).then(result => {
		if (result["data"]["po_banner"]) {
			result["data"]["po_banner"] = utils.getImageUrl(req, result["data"]["po_banner"])
		}
		if (result["data"]["user_pp"]) {
			result["data"]["user_pp"] = utils.getImageUrl(req, result["data"]["user_pp"])
		}
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/purchaseorder/banner", imageUpload.single("banner"), function(req, res) {
	order.edit_banner(fs, req.file, req.body.token, req.body.purchase_order_id).then(result => {
		result["data"]["banner_path"] = utils.getImageUrl(req, result["data"]["banner_path"])
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/purchaseorder/edit/username", function(req, res) {
	order.edit_purchase_order(req.body.token, req.body.purchase_order_id, ["title"], [req.body.title]).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/session", function(req, res) {
	auth.check_token(req.body.token).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/user/register", function(req, res) {
	auth.register(req.body.email, req.body.password, req.body.username).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.get("/api/user/confirm", function(req, res) {
	auth.confirm_token(req.query.token).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/user/confirm/resend", function(req, res) {
	auth.resend_email_confirm(req.body.user_id).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/user/current", function(req, res) {
	auth.get_user(req.body.token).then(result => {
		if (result["data"]["profile_pic"]) {
			result["data"]["profile_pic"] = utils.getImageUrl(req, result["data"]["profile_pic"])
		}
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/user/username/edit", function(req, res) {
	auth.edit_username(req.body.token, req.body.username).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.post("/api/user/profilepicture/edit", imageUpload.single("profile_picture"), function(req, res) {
	auth.upload_profile_picture(req.body.token, req.file, fs).then(result => {
		if (result["data"]["profile_picture_path"]) {
			result["data"]["profile_picture_path"] = utils.getImageUrl(
				req, result["data"]["profile_picture_path"]
			)
		}
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.listen(3000, function() {
	console.log("Server is running at port 3000")
})