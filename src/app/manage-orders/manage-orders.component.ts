import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { Observable } from "rxjs"

import { PurchaseOrderService } from "../purchase-order.service";
import { UserAuthService } from "../user-auth.service"

import { User } from "../_models/user"
import { PurchaseOrder } from "../_models/order"

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {

	user: User
  emailConfirmationMsg: string

  purchaseOrders$: Observable<PurchaseOrder[]>

  constructor(private poService: PurchaseOrderService,
  	private auth: UserAuthService,
    private router: Router) {
  	this.auth.getCurrentUser().subscribe(u => {
  		this.user = u
      this.purchaseOrders$ = this.poService.getPurchaseOrdersList(2)
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
