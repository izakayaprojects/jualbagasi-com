import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserAuthService } from "../user-auth.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css', '../app.component.css']
})
export class NavigationBarComponent implements OnInit {

	@Input() currentNavigation = "";
	isLoggedIn$: Observable<any>

  constructor(private userAuth: UserAuthService, private router: Router) {
  }

  ngOnInit() {
  	this.isLoggedIn$ = this.userAuth.check_token().pipe(map(res => {
  		return { result: res };
  	}))
  }

  logout() {
  	this.userAuth.logout().subscribe(result => {
  		this.router.navigate(["/login"])
  	})
  }

}
