const express = require("express")
const db = require("./db");
const app = express();

const auth = require("./auth")
const order = require("./order")
const cities = require("./cities")

db.connect();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next();
})

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