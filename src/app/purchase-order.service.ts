import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENV } from "./_global/global";
import { PurchaseOrder, Currency } from "./_models/order";

const API = ENV.debug.apiurl;

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(
  	private http: HttpClient,
  	private localStorage: LocalStorageService) { }

  addPurchaseOrder(po: PurchaseOrder) {

  }

  deletePurchaseOrder(poId: string) {

  }

  editPurchaseOrder(po: PurchaseOrder) {
  	
  }

  getCurrencies(): Observable<Currency[]> {
  	return this.http.get(API+"/currencies").pipe(
  		map(result => {
  			if (result["success"] === true) {
  				let data = result["data"]
  				let currencies: Currency[] = []
  				for (var i = 0 ; i < data.length ; i++) {
  					let item = data[i]
  					let currency = new Currency()
  					currency.id = item["_id"]
  					currency.name = item["name"]
  					currency.symbol = item["symbol"]
  					currencies.push(currency)
  				}
  				return currencies
  			} else {
  				return []
  			}
  		})
  	)
  }
}
