const express = require("express")
const db = require("./db");
const app = express();

const auth = require("./auth")

db.connect();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", function(req, res) {
	res.send("Hello")
})

app.post("/api/login", function(req, res) {
	auth.login(req.body.email, req.body.password).then(result => {
		res.send(result)
	}).catch(err => {
		res.send(err)
	})
})

app.listen(3000, function() {
	console.log("Server is running at port 3000")
})