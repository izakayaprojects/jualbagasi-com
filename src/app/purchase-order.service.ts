import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENV } from "./_global/global";
import { DateConverter, ApiResponse } from "./_models/utils";
import { PurchaseOrder, Currency, Route } from "./_models/order";

const API = ENV.debug.apiurl;
const dateConv = new DateConverter();

enum POListType {
  Homepage = 1,
  Manage = 2
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(
  	private http: HttpClient,
  	private localStorage: LocalStorageService) { }

  getPurchaseOrdersList(type: POListType = 1) {
    if (type == POListType.Manage) {
      // TODO /api/purchaseorder/list-summary
    } else {
      return this.http.get<ApiResponse<PurchaseOrder[]>>(API+"/purchaseorder/list-display").pipe(
        map(result => {
          let resp = new ApiResponse<PurchaseOrder[]>()
          resp.success = result["success"] ? result["success"] : false
          resp.errorId = result["success"] === false ? result["id"] : undefined
          if (result.success === true) {
            let data = result["data"]
            let poList: PurchaseOrder[] = []
            data.forEach(d => poList.push(this.parseToPurchaseOrder(d)))
            resp.data = poList
          }
          return resp;
        })
      )
    }
  }

  private parseToPurchaseOrder(item: any): PurchaseOrder {
    let po = new PurchaseOrder()
    po.id = item["po_id"]
    po.title = item["po_title"]
    po.bannerUrl = item["po_banner"] ? item["po_banner"] : ""
    po.startDate = item["po_from"] ? new Date(item["po_from"]) : null
    po.endDate = item["po_to"] ? new Date(item["po_to"]) : null
    // TODO other fields (capacity, etc.)

    if (item["destinations"] && item["destinations"].length > 0) {
      let dests = item["destinations"]
      po.origin.city.countryCode = dests[0]["code"]
      
      if (dests.length > 1) {
        for (var i = 0 ; i < dests.length ; i++) {
          let route = new Route()
          route.city.countryCode = dests[0]["code"]
          po.routes.push(route)
        }
      }
    }

    return po
  }

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

  uploadBannerForPurchaseOrder(banner: File, poId: string): Observable<ApiResponse<string>> {
    let formData = new FormData()
    formData.append("banner", banner)
    formData.append("purchase_order_id", poId)
    formData.append("token", this.localStorage.retrieve("token"))
    return this.http.post(API+"/purchaseorder/banner", formData).pipe(
      map(result => {
        let resp = new ApiResponse<string>()
        resp.success = result["success"] ? result["success"] : false
        resp.errorId = result["success"] === false ? result["id"] : undefined
        resp.data = result["data"] ? result["data"]["banner_path"] : undefined
        return resp
      })
    )
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
