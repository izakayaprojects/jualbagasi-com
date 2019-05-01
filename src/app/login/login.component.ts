import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

import { UserAuthService } from '../user-auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	@Input() email: string;
	password: string;

	loginErrorMessage: string;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private localStorage: LocalStorageService) { }

  ngOnInit() {
  }

  onLogin(): void {
    this.loginErrorMessage = "";
    
    if (this.email === undefined || this.password === undefined 
      || this.email === "" || this.password === "") {
      this.loginErrorMessage = "E-mail atau Password tidak boleh kosong!";
      return;
    }

    this.userAuthService.login(this.email, this.password).subscribe(result => {
        if (result["success"] === false) {
          this.loginErrorMessage = "E-mail atau Password salah!"
        } else {
          console.log(result);
        }
      }
    )
  }

}
