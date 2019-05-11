import { Component, OnInit } from '@angular/core';

import { PurchaseOrderService } from "../purchase-order.service";

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {

  constructor(private poService: PurchaseOrderService) { }

  ngOnInit() {
  }

}
