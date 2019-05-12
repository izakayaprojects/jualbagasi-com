import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs"

import { UserAuthService } from "../user-auth.service"
import { User } from "../_models/user"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', "../app.component.css"]
})
export class ProfileComponent implements OnInit {

	user: Observable<User>

  constructor(private auth: UserAuthService) {
  	this.user = this.auth.getCurrentUser()
  }

  ngOnInit() {
  }

  onProfilePicClicked(file) {
  	console.log(file.files[0])
    // TODO upload pp
  }

}
