import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from "../navigation-bar/navigation-bar.component";
import { Observable, of } from "rxjs"
import { map } from 'rxjs/operators';

import { PurchaseOrder } from "../_models/order"
import { PurchaseOrderService } from "../purchase-order.service"

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {

	purchaseOrders$: Observable<PurchaseOrder[]>

  constructor(private poService: PurchaseOrderService) {
  	
  	this.purchaseOrders$ = this.poService.getPurchaseOrdersList().pipe(
  		map(result => {
  			console.log(result)
  			if (result.success === true) {
  				return result.data
  			} else {
  				return []
  			}
  		})
  	)
    // TODO build list in html
  	// this.poService.getPurchaseOrdersList().subscribe(result => console.log(result))
  }

  ngOnInit() {
  }

}
