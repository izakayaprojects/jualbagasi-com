import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	@Input() username: string;
	password: string;

	loginErrorMessage: string;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService) { }

  ngOnInit() {
  }

  onLogin(): void {
  }

}
