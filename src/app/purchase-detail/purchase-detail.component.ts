import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router"
import { Observable } from "rxjs"
import { map, delay } from "rxjs/operators"

import { PurchaseOrderService } from "../purchase-order.service"
import { UserAuthService } from "../user-auth.service"
import { PurchaseOrder } from "../_models/order"
import { User } from "../_models/user" 

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.css', "../app.component.css"]
})
export class PurchaseDetailComponent implements OnInit {

  user: User
	purchaseOrder: PurchaseOrder

  constructor(
  	private activatedRoute: ActivatedRoute,
  	private poService: PurchaseOrderService,
    private auth: UserAuthService) {

  	this.activatedRoute.paramMap.subscribe(params => {
      this.auth.getCurrentUser().subscribe(user => {
        this.user = user
        this.poService.getPurchaseOrder(params.get("id")).subscribe(po => {
          this.purchaseOrder = po
        })
      })
  	})
  }

  isLoggedIn(): boolean {
    return this.user !== null
  }

  isOwner(): boolean {
    return this.purchaseOrder.owner.id === this.user.id
  }

  ngOnInit() {
  }

}
