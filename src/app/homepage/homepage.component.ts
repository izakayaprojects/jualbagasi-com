import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from "../navigation-bar/navigation-bar.component";
import { Observable, of } from "rxjs"
import { map } from 'rxjs/operators';
import { Router } from "@angular/router"

import { PurchaseOrder } from "../_models/order"
import { PurchaseOrderService } from "../purchase-order.service"

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {

	purchaseOrders$: Observable<PurchaseOrder[]>

  currentCapacityFilter = [0, 50]

  constructor(private poService: PurchaseOrderService,
    private router: Router) {
  	
  	this.purchaseOrders$ = this.poService.getPurchaseOrdersList().pipe(
  		map(result => {
  			if (result.success === true) {
  				return result.data
  			} else {
  				return []
  			}
  		})
  	)
  }

  onPurchaseOrderSelected(po: PurchaseOrder) {
    this.router.navigate(["/purchaseorder", po.id])
  }

  onFilterCapacity(value) {
    console.log(value)
    this.currentCapacityFilter = value
  }

  ngOnInit() {
  }

}
