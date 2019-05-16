import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthService } from "../user-auth.service";
import { MessageService } from "../message.service"

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
		username: "",
    submission: ""
	}

	email: string = ""
	password: string = ""
	passwordRepeat: string = ""
	username: string = ""

	isSubmitted = false

  constructor(private auth: UserAuthService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit() {
  }

  onRegistrationSubmit() {
  	this.errorMessages = { email: "", password: "", username: "", submission: "" }

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
  		// submit registration
  		this.auth.register(this.email, this.password, this.username).subscribe(result => {
        if (result.success === true) {
          this.messageService.setMessage("success", 
            "Akun berhasil dibuat. Email konfirmasi sudah dikirim ke alamat E-mail anda")
          this.router.navigate(["/login"])
        } else {
          if (result.errorId === -1) {
            this.errorMessages.email = "Email sudah terpakai"
          } else if (result.errorId === -2) {
            this.errorMessages.username = "Username sudah terpakai"
          } else if (result.errorId === -3) {
            this.errorMessages.submission = "Gagal membuat akun. Mohon hubungi Admin"
          } 
        }
      })
  	}
  }

}
