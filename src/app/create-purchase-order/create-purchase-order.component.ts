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

  selectedBannerFileName: string
  selectedBannerPreviewUrl: any

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  onConfirmPO() {

  }

  onCancel() {
  	
  }

  processBannerFile(image) {
    let file = image.files[0]
    this.selectedBannerFileName = file.name
    let reader = new FileReader()
    reader.onload = (event) => {
      this.selectedBannerPreviewUrl = reader.result
    }
    reader.readAsDataURL(file)
  }

  openDestinationForm() {
  	const modalRef = this.modalService.open(CreateDestinationComponent)
  }

}
