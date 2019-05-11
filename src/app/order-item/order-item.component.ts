import { Component, OnInit, Input } from '@angular/core';

import { PurchaseOrder } from "../_models/order"

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {

	@Input() purchaseOrder: PurchaseOrder

  constructor() { }

  ngOnInit() {
  }

}
