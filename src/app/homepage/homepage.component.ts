import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from "../navigation-bar/navigation-bar.component";
import { Observable, of } from "rxjs"
import { map } from 'rxjs/operators';
import { Router } from "@angular/router"

import { PurchaseOrder } from "../_models/order"
import { PurchaseOrderService } from "../purchase-order.service"
import { DateConverter } from "../_models/utils"

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css', '../app.component.css'],
})
export class HomepageComponent implements OnInit {

	purchaseOrders: PurchaseOrder[]
  filtered: PurchaseOrder[]

  filter = {
    origin: null,
    route: null,
    min_date: null,
    max_date: null,
    min_capacity: 0,
    max_capacity: 50,
    over: true,
    currently_open: true,
    incoming: true
  }

  private dtConv = new DateConverter()

  constructor(private poService: PurchaseOrderService,
    private router: Router) {
  	this.poService.getPurchaseOrdersList().subscribe(res => {
      this.purchaseOrders = res
      this.doFilterPurchaseOrders()
    })
  }

  ngOnInit() {
  }

  onFilterMinDate(minDate) {
    this.filter.min_date = this.dtConv.ngbDateToDate(minDate)
  }

  onFilterMaxDate(maxDate) {
    this.filter.max_date = this.dtConv.ngbDateToDate(maxDate)
  }

  onFilter() {
    this.doFilterPurchaseOrders()
  }

  private doFilterPurchaseOrders() {
    let f = this.filter
    this.filtered = this.purchaseOrders.filter(po => {
      let shouldInsert = true
      // From PO's availability
      if (!f.over && po.isOver()) shouldInsert = false
      if (!f.incoming && po.isOpeningSoon()) shouldInsert = false
      if (!f.currently_open && po.isCurrentlyOpen()) shouldInsert = false      
      if (!shouldInsert) return false

      // From capacity offered
      let leftover = po.capacityKg - po.additional["capacity_taken"]
      if (leftover >= f.max_capacity || leftover <= f.min_capacity) shouldInsert = false

      return shouldInsert
    })

  }

}
