import { Component, OnInit } from '@angular/core';

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

  constructor(private poService: PurchaseOrderService,
  	private auth: UserAuthService) {
  	this.auth.getCurrentUser().subscribe(u => {
  		this.user = u
  		// TODO get po and orders belonged to this guy
  	})
  }

  onResendConfirmation() {
  	 // TODO auth.resendEmailConfirm
  }

  ngOnInit() {
  }

}
