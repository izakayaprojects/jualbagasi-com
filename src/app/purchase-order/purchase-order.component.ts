import { Component, OnInit, Input } from '@angular/core';

import { PurchaseOrder } from "../_models/order"

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

	@Input() purchaseOrder: PurchaseOrder

  constructor() { }

  ngOnInit() {
  }

}
