import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router"
import { Observable } from "rxjs"
import { map, delay } from "rxjs/operators"
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PurchaseOrderService } from "../purchase-order.service"
import { UserAuthService } from "../user-auth.service"
import { PurchaseOrder } from "../_models/order"
import { User } from "../_models/user" 

import { DialogEditTextComponent } from "../dialog-edit-text/dialog-edit-text.component"

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.css', "../app.component.css"]
})
export class PurchaseDetailComponent implements OnInit {

  user: User
	purchaseOrder: PurchaseOrder
  isOfferStillValid = false
  isOfferOver = true
  isOfferValidSoon = false

  isUploadingBanner = false

  constructor(
    private modalService: NgbModal,
  	private activatedRoute: ActivatedRoute,
  	private poService: PurchaseOrderService,
    private changeDetector: ChangeDetectorRef,
    private auth: UserAuthService) {

  	this.activatedRoute.paramMap.subscribe(params => {
      this.auth.getCurrentUser().subscribe(user => {
        this.user = user
        this.poService.getPurchaseOrder(params.get("id")).subscribe(po => {
          this.purchaseOrder = po
          this.isOfferOver = po.isOver()
          this.isOfferStillValid = po.isCurrentlyOpen()
          this.isOfferValidSoon = po.isOpeningSoon()
        })
      })
  	})
  }

  isLoggedIn(): boolean {
    return this.user !== null
  }

  isOwner(): boolean {
    return this.isLoggedIn() && this.purchaseOrder.owner.id === this.user.id
  }

  onEditTitle() {
    const modalRef = this.modalService.open(DialogEditTextComponent)
    modalRef.componentInstance["title"] = "Ubah judul Purchase Order"
    modalRef.componentInstance["content"] = this.purchaseOrder.title
    modalRef.result.then(result => {
      let content = result["content"]
      if (content) {
        // update title to server
        this.poService.editPurchaseOrder(this.purchaseOrder.id, "title", "title", content)
          .subscribe(resp => {
          if (resp.success) {
            this.purchaseOrder.title = content
          }
        })
      }
    }).catch(err => {})
  }

  onEditDescription() {
    const modalRef = this.modalService.open(DialogEditTextComponent)
    modalRef.componentInstance["title"] = "Ubah deskripsi Purchase Order"
    modalRef.componentInstance["content"] = this.purchaseOrder.description
    modalRef.componentInstance["type"] = "textarea"
    modalRef.result.then(result => {
      let content = result["content"]
      if (content) {
        // update desc to server
        this.poService.editPurchaseOrder(this.purchaseOrder.id, "description", "description", content)
          .subscribe(resp => {
          if (resp.success) {
            this.purchaseOrder.description = content
          }
        })
      }
    }).catch(err => {})
  }

  onBannerChanged(f) {
    let file = f.files[0]
    this.isUploadingBanner = true
    this.poService.uploadBannerForPurchaseOrder(file, this.purchaseOrder.id).subscribe(result => {
      if (result.success) { 
        this.purchaseOrder.bannerUrl = result.data+"?"+(new Date().getTime())
        this.isUploadingBanner = false
      }
    })
  }

  ngOnInit() {
  }

}
