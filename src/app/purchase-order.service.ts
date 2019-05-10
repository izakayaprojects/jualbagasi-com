import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENV } from "./_global/global";
import { DateConverter, ApiResponse } from "./_models/utils";
import { PurchaseOrder, Currency } from "./_models/order";

const API = ENV.debug.apiurl;
const dateConv = new DateConverter();

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(
  	private http: HttpClient,
  	private localStorage: LocalStorageService) { }

  addPurchaseOrder(po: PurchaseOrder): Observable<ApiResponse<string>> {
  	let data = {
  		title: 				po.title,
  		description: 	po.description,
  		startDate: 		dateConv.toMySqlTimestamp(po.startDate),
  		endDate: 			dateConv.toMySqlTimestamp(po.endDate),
  		capacity: 		po.capacityKg,
  		fee: 					po.feePerKg,
  		currency_id: 	po.currency.id
  	}
  	let routes = [];

  	if (po.origin !== null && po.origin.city.id !== -1) {
  		routes.push({
  			city: po.origin.city.name,
  			country: po.origin.city.country,
  			country_code: po.origin.city.countryCode,
  			estItemArrivalDate: dateConv.toMySqlTimestamp(po.origin.estimatedItemArrivalDate)
  		})
  	}
  	if (po.routes !== null && po.routes.length > 0) {
  		for (var i = 0 ; i < po.routes.length ; i++) {
  			let item = po.routes[i]
  			if (item.city.id !== -1) {
	  			routes.push({
		  			city: item.city.name,
		  			country: item.city.country,
		  			country_code: item.city.countryCode,
		  			estItemArrivalDate: dateConv.toMySqlTimestamp(item.estimatedItemArrivalDate)
		  		})
  			}
  		}
  	}
  	data["routes"] = routes
    let token = this.localStorage.retrieve("token")
  	return this.http.post<ApiResponse<string>>
      (API+"/purchaseorder/add", {token: token, data: data}).pipe(
      map(result => {
        let resp = new ApiResponse<string>()
        resp.success = result["success"] ? result["success"] : false
        resp.errorId = result["success"] === false ? result["id"] : undefined
        resp.data = result["data"] ? result["data"]["purchase_order_id"] : undefined
        return resp
      })
    )
  }

  uploadBannerForPurchaseOrder(banner: File) {
    
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
