import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { PurchaseOrder, Route } from "../_models/order"
import { DateConverter } from "../_models/utils"
import { CreateDestinationComponent } from "../create-destination/create-destination.component"

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css', '../app.component.css']
})
export class CreatePurchaseOrderComponent implements OnInit {

	@Input() purchaseOrder: PurchaseOrder = new PurchaseOrder()

  dateConv = new DateConverter()
  selectedBannerFileName: string
  selectedBannerPreviewUrl: any

  ngbPOStartDate: NgbDateStruct 
  ngbPOEndDate: NgbDateStruct 

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.ngbPOStartDate = this.dateConv.dateToNgbDate(this.purchaseOrder.startDate)
    this.ngbPOEndDate = this.purchaseOrder.endDate !== null ? 
      this.dateConv.dateToNgbDate(this.purchaseOrder.startDate) : null
  }

  onConfirmPO() {
    let isValidated = true
    if (this.purchaseOrder.title === "") {
      
    }
  }

  onCancel() {
  	
  }

  onDateSelected(which, event) {
    try {
      this.purchaseOrder[which] = this.dateConv.ngbDateToDate(event)
    } catch(e) {
      console.error(e)
    }

    if (which === "startDate") {
      this.ngbPOStartDate = event
    } else if (which === "endDate") {
      this.ngbPOEndDate = event
    }
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

  openDestinationForm(destIndex: number) {
  	const modalRef = this.modalService.open(CreateDestinationComponent)

    if (destIndex === -1) {
      modalRef.componentInstance["route"] = this.purchaseOrder.origin
    } else if (destIndex === this.purchaseOrder.routes.length) {
      modalRef.componentInstance["route"] = new Route()
    } else {
      modalRef.componentInstance["route"] = this.purchaseOrder.routes[destIndex]
    }
    modalRef.componentInstance["routeIndex"] = destIndex
    modalRef.result.then(result => {
      if (result["route"]) {
        let route = result["route"]
        let index = result["routeIndex"]
        if (index === -1) {
          // Origin
          this.purchaseOrder.origin = route
        } else {
          // One of the destinations
          this.purchaseOrder.routes[index] = route
        }
      }
    }).catch(err => { })
  }

}
