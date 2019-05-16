import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"

import { UserAuthService } from "../user-auth.service"
import { MessageService } from "../message.service"

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

	isBeingChecked = true
	confirmed: Boolean
	message: string

  constructor(private route: ActivatedRoute,
  	private auth: UserAuthService,
  	private router: Router,
  	private messageService: MessageService) {

  	this.isBeingChecked = true
  	this.route.queryParams.subscribe(param => {
  		let confirmationToken = param["id"]
  		auth.confirmEmail(confirmationToken).subscribe(confirmation => {
  			if (confirmation.success === true) {
  				// Successful confirmation
  				this.confirmed = true
  				this.message = "Email berhasil di-konfirmasi."
  			} else {
  				this.confirmed = false
  				switch(confirmation.errorId) {
  					case -1 :
  						this.message = "Token konfirmasi tidak valid"
  						break;
						case -2 :
  						this.message = "Gagal konfirmasi alamat email. Mohon lapor Support"
  						break;
  				}
  			}
  			this.isBeingChecked = false
  		})
  	})
  }

  ngOnInit() {
  }

}
