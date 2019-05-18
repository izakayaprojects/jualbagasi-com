import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

import { PurchaseOrderService } from "../purchase-order.service";
import { UserAuthService } from "../user-auth.service"

import { User } from "../_models/user"

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {

	user: User
  emailConfirmationMsg: string

  constructor(private poService: PurchaseOrderService,
  	private auth: UserAuthService,
    private router: Router) {
  	this.auth.getCurrentUser().subscribe(u => {
  		this.user = u
  		// TODO get po and orders belonged to this guy
  	})
  }

  onResendConfirmation(userid) {
    this.emailConfirmationMsg = ""
    this.auth.resendEmailConfirm(userid).subscribe(res => {
      if (res.success === true) {
        this.emailConfirmationMsg = "Email konfirmasi sudah terkirim ke "+res.data
        } else {
          switch (res.errorId) {
          case -1:
            // user not found
            this.auth.logout().subscribe(res => this.router.navigate(["/logout"])) 
            break;
          case -2:
            // Failed to update token
            this.emailConfirmationMsg = "Email konfirmasi tidak dapat dikirim. Mohon hubungi Admin" 
            break;
        }
      }
    })
  }

  ngOnInit() {
  }

}
