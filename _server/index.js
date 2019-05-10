const express = require("express");
const db = require("./db");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require("./auth")
const order = require("./order")
const cities = require("./cities")

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

app.post("/api/purchaseorder/banner", imageUpload.single("banner"), function(req, res) {
	order.edit_banner(fs, req.file, req.body.token, req.body.purchase_order_id).then(result => {
		let url = req.protocol+"://"+req.get("host")
		result["data"]["banner_path"] = url+"/uploads/"+result["data"]["banner_path"]
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

app.listen(3000, function() {
	console.log("Server is running at port 3000")
})