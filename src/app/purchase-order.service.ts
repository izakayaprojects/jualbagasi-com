import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENV } from "./_global/global";
import { PurchaseOrder } from "./_models/order";

const API = ENV.debug.apiurl;

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private localStorage: LocalStorageService) { }

  addPurchaseOrder(po: PurchaseOrder) {

  }

  deletePurchaseOrder(poId: string) {

  }

  editPurchaseOrder(po: PurchaseOrder) {
  	
  }
}
