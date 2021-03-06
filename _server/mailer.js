const mailer = require("nodemailer")
const config = require("./config")

const conf = config.get()

const GmailTransporter = mailer.createTransport({
	service:'gmail',
	auth: {
		user: "jualbagasi@gmail.com",
		pass: "ju4lb4g4s1"
	}
})

module.exports = {
	send_email_confirmation: function(recipient, confirmationToken) {
		return new Promise(function(resolve, reject) {
			let confirmURL = conf.hostsite+"/confirm?id="+confirmationToken
			let content = "<p>Selamat bergabung bersama kami di Jualbagasi. Konfirmasi alamat email anda lewat link ini:</p>"
			content+="<div style='margin-left: 3em'>"+confirmURL+"</div>"
			content+="<div>Salam,</div>"
			content+="<div>Team Jualbagasi</div>"
			let options = {
				from: 'jualbagasi@gmail.com',
				to: recipient,
				subject: "Jualbagasi - Konfirmasi Alamat Email anda",
				html: content
			}
			GmailTransporter.sendMail(options, function(err, info) {
				if (err) {
					reject()
				} else {
					resolve()
				}
			})
		})
	},

	send_mail: function(from, to, title, body) {
		// TODO construct general email
	}
}