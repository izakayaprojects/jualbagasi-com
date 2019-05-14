import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	private regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	private regexUsername = new RegExp(/^[a-zA-Z0-9-_]+$/)

	errorMessages = {
		email: "",
		password: "",
		username: ""
	}

	email: string = ""
	password: string = ""
	passwordRepeat: string = ""
	username: string = ""

	isSubmitted = false

  constructor() { }

  ngOnInit() {
  }

  onRegistrationSubmit() {
  	this.errorMessages = { email: "", password: "", username: "" }

  	let isValidated = true
  	this.isSubmitted = true
  	if (this.email === '' || !this.regexEmail.test(this.email)) {
  		isValidated = false
  		this.errorMessages.email = "Alamat E-mail tidak valid"
  	}

  	if (this.password === '') {
  		isValidated = false
  		this.errorMessages.password = "Password tidak boleh kosong"
  	}

  	if (this.password !== this.passwordRepeat) {
  		isValidated = false
  		this.errorMessages.password = "Password yang diulang tidak sama"
  	}

  	if (this.username === '') {
  		isValidated = false
  		this.errorMessages.username = "Username tidak boleh kosong"
  	}

  	if (this.username.length <= 8 || this.username.length >= 24) {
  		isValidated = false
  		this.errorMessages.username = "Username harus di antara 8 - 24 karakter"
  	}

  	if (!this.regexUsername.test(this.username)) {
  		isValidated = false
  		this.errorMessages.username = "Hanya angka, huruf, '_', dan '-' yang diperbolehkan"
  	}

  	if (isValidated) {
  		// TODO submit registration
  		
  	}
  }

}
