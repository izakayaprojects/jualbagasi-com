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

	purchaseOrders$: Observable<PurchaseOrder[]>

  filter = {
    country: null,
    min_date: null,
    max_date: null,
    min_capacity: 0,
    max_capacity: 50,
    currently_open: true,
    incoming: true
  }

  private dtConv = new DateConverter()

  constructor(private poService: PurchaseOrderService,
    private router: Router) {
  	
  	this.purchaseOrders$ = this.poService.getPurchaseOrdersList()
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
    // TODO filter
  }

}
