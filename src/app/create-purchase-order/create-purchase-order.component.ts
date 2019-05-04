import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PurchaseOrder } from "../_models/order"
import { CreateDestinationComponent } from "../create-destination/create-destination.component"

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css', '../app.component.css']
})
export class CreatePurchaseOrderComponent implements OnInit {

	@Input() purchaseOrder: PurchaseOrder

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  onConfirmPO() {

  }

  onCancel() {
  	
  }

  openDestinationForm() {
  	const modalRef = this.modalService.open(CreateDestinationComponent)
  }

}
