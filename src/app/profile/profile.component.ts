import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs"

import { UserAuthService } from "../user-auth.service"
import { User } from "../_models/user"
import { MessageService } from "../message.service"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', "../app.component.css"]
})
export class ProfileComponent implements OnInit {

	user: Observable<User>

  isUploadingProfilePicture = false
  isUpdatingUsername = false

  constructor(
    private auth: UserAuthService,
    private messageService: MessageService) {
  	this.user = this.auth.getCurrentUser()
  }

  ngOnInit() {
  }

  onUsernameChange(newUsername) {
    this.isUpdatingUsername = true
    this.auth.editUsername(newUsername).subscribe(response => {
      if (response.success === true) {
        this.user = this.auth.getCurrentUser()
        this.messageService.setMessage("success", "Username berhasil di-update")
      } else if (response.errorId === -11) {
        this.messageService.setMessage("danger", "Username sudah diambil")
      } else {
        this.messageService.setMessage("danger", "Username gagal di-update")
      }
      this.isUpdatingUsername = false 
    })
  }

  onProfilePicClicked(file) {
    let pp = file.files[0]
    this.isUploadingProfilePicture = true
    this.auth.uploadProfilePicture(pp).subscribe(result => {
      if (result.data) {
        this.user = this.auth.getCurrentUser()
        this.messageService.setMessage("success", "Profile Picture berhasil di-update")
      } else {
        this.messageService.setMessage("danger", "Profile Picture gagal di-update")
      }
      this.isUploadingProfilePicture = false
    })
  }

}
