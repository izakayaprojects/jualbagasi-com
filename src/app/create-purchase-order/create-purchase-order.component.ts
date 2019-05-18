import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";
import { Router } from '@angular/router';

import { PurchaseOrder, Route, Currency } from "../_models/order"
import { DateConverter, ApiResponse } from "../_models/utils"
import { CreateDestinationComponent } from "../create-destination/create-destination.component"
import { PurchaseOrderService } from "../purchase-order.service"
import { MessageService } from "../message.service"

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css', '../app.component.css']
})
export class CreatePurchaseOrderComponent implements OnInit {

	@Input() purchaseOrder: PurchaseOrder = new PurchaseOrder()

  errorMessages = {
    title: "",
    description: "",
    availableLuggage: "",
    pricePerKg: "",
    currency: "",
    startDate: "",
    endDate: ""
  }

  currencies: Observable<Currency[]>

  dateConv = new DateConverter()
  selectedBanner: File
  selectedBannerPreviewUrl: any

  ngbPOStartDate: NgbDateStruct 
  ngbPOEndDate: NgbDateStruct 

  isSubmitted: boolean = false
  isBeingSubmittedToServer: boolean = false

  constructor(
    private router: Router,
    private messageService: MessageService,
    private modalService: NgbModal,
    private poService: PurchaseOrderService) { }

  ngOnInit() {
    this.currencies = this.poService.getCurrencies()
    this.ngbPOStartDate = this.dateConv.dateToNgbDate(this.purchaseOrder.startDate)
    this.ngbPOEndDate = this.purchaseOrder.endDate !== null ? 
      this.dateConv.dateToNgbDate(this.purchaseOrder.startDate) : null
  }

  onConfirmPO() {
    this.errorMessages = {
      title: "", description: "", availableLuggage: "",
      pricePerKg: "", currency: "",
      startDate: "", endDate: ""
    }

    this.isSubmitted = true
    let isValidated = true
    if (this.purchaseOrder.title === "") {
      this.errorMessages.title = "Judul tidak boleh kosong"
      isValidated = false
    }
    if (this.purchaseOrder.description === "") {
      this.errorMessages.description = "Deskripsi tidak boleh kosong"
      isValidated = false
    }
    if (this.purchaseOrder.capacityKg <= 0) {
      this.errorMessages.availableLuggage = "Kapasitas harus lebih dari 0"
      isValidated = false
    }
    if (this.purchaseOrder.feePerKg <= 0) {
      this.errorMessages.pricePerKg = "Harga per Kg harus lebih dari 0"
      isValidated = false
    }
    if (this.purchaseOrder.currency.id === -1) {
      this.errorMessages.currency = "Mata uang tidak boleh kosong"
      isValidated = false
    }
    if (this.purchaseOrder.startDate === null) {
      this.errorMessages.startDate = "Tanggal mulai PO tidak boleh kosong"
      isValidated = false
    }
    if (this.purchaseOrder.endDate === null) {
      this.errorMessages.endDate = "Tanggal akhir PO tidak boleh kosong"
      isValidated = false
    }

    if (isValidated) {
      let context = this
      this.isBeingSubmittedToServer = true
      this.poService.addPurchaseOrder(this.purchaseOrder).subscribe(result => {
        if (result.success === true) {
          // Purchase order entered, adding image if any
          let poId = result.data
          if (this.selectedBanner) {
            this.poService.uploadBannerForPurchaseOrder(this.selectedBanner, poId).subscribe(banner => {         
              context.isBeingSubmittedToServer = false
              if (banner.success === true) {
                // Banner successfully added, back to order list
                this.messageService.setMessage("success", "Data PO berhasil ditambahkan")
                this.router.navigate(["/my-orders"])
              } else {
                // banner failed to upload. just go back to order list and give warning
                switch (result.errorId) {
                  case -11:
                    this.messageService.setMessage("warning", "Banner PO tidak ditemukan")
                    break;
                  case -12:
                    this.messageService.setMessage("warning", "Banner PO hanya boleh berupa gambar")
                    break;
                  case -13:
                    this.messageService.setMessage("danger", "Data PO tidak ditemukan")
                    break;
                  case -14:
                    this.messageService.setMessage("warning", "Banner tidak dapat disimpan. Mohon lapor admin")
                    break;
                  default:
                    this.messageService.setMessage("warning", "Data PO tidak ter-update. Mohon upload kembali")
                    break;
                }
                this.router.navigate(["/my-orders"])
              }
            })
          } else {
            context.isBeingSubmittedToServer = false
            this.messageService.setMessage("success", "Data PO berhasil ditambahkan")
            this.router.navigate(["/my-orders"])
          }
        } else {
          // display the error from PO submission
          if (result.errorId === -1 || result.errorId === -2) {
            // user not logged in or token has expired
            this.messageService.setMessage("danger", "Harap login terlebih dahulu")
            this.router.navigate(["/login"])
          } else if (result.errorId === -11) {
            this.messageService.setMessage("danger", "Data PO tidak ditemukan")
          } else if (result.errorId === -12) {
            this.messageService.setMessage("danger", "Data PO tidak lengkap. Mohon dicek kembali")
          } else if (result.errorId === -13) {
            this.messageService.setMessage("warning", "Rute perjalanan tidak bisa ditambahkan. Anda bisa update PO anda kembali")
            this.router.navigate(["/my-orders"])
          } else if (result.errorId === -14) {
            this.messageService.setMessage("warning", "Rute perjalanan gagal di-update. Anda bisa update PO anda kembali")
            this.router.navigate(["/my-orders"])
          }
          context.isBeingSubmittedToServer = false
        }
      })
    }

  }

  onCancel() {
  	
  }

  onCurrencyPicked(curr: Currency) {
    this.purchaseOrder.currency = curr
  }

  onDescriptionChanged(desc: string) {
    this.purchaseOrder.description = desc
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
    this.selectedBanner = file
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
