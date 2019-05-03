import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthService } from "../user-auth.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css', '../app.component.css']
})
export class NavigationBarComponent implements OnInit {

	@Input() currentNavigation = "";

  constructor(private userAuth: UserAuthService, private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
  	this.userAuth.logout().subscribe(result => {
  		this.router.navigate(["/"])
  	})
  }

}
