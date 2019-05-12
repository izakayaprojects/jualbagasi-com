import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router"
import { Observable } from "rxjs"
import { map, delay } from "rxjs/operators"

import { PurchaseOrderService } from "../purchase-order.service"
import { PurchaseOrder } from "../_models/order"

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.css', "../app.component.css"]
})
export class PurchaseDetailComponent implements OnInit {

	purchaseOrder: Observable<PurchaseOrder>

  constructor(
  	private activatedRoute: ActivatedRoute,
  	private poService: PurchaseOrderService) {

  	this.activatedRoute.paramMap.subscribe(params => {
  		this.purchaseOrder = this.poService.getPurchaseOrder(params.get("id")).pipe(map(r => r.data))
  	})
  }

  ngOnInit() {
  }

}
