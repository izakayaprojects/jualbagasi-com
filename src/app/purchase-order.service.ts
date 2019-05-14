import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENV } from "./_global/global";
import { DateConverter, ApiResponse } from "./_models/utils";
import { PurchaseOrder, Currency, Route } from "./_models/order";
import { User } from "./_models/user"

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

  private parseToPurchaseOrder(item: any): PurchaseOrder {
    let po = new PurchaseOrder()
    po.id = item["po_id"]
    po.title = item["po_title"]
    po.description = item["po_desc"] ? item["po_desc"] : ""
    po.bannerUrl = item["po_banner"] ? item["po_banner"] : ""
    po.startDate = item["po_from"] ? new Date(item["po_from"]) : null
    po.endDate = item["po_to"] ? new Date(item["po_to"]) : null
    po.capacityKg = item["po_capacity"] ? item["po_capacity"] : 0
    po.feePerKg = item["po_fee"] ? item["po_fee"] : 0
    po.currency.symbol = item["curr_symbol"] ? item["curr_symbol"] : ""
    // TODO other fields (user, etc.)

    if (item["destinations"] && item["destinations"].length > 0) {
      let dests = item["destinations"]
      po.origin.city.countryCode = dests[0]["code"]
      po.origin.estimatedItemArrivalDate = dests[0]["estItemArrivalDate"]
      po.origin.city.country = dests[0]["country"]
      po.origin.city.name = dests[0]["city"]
      
      if (dests.length > 1) {
        for (var i = 1 ; i < dests.length ; i++) {
          let route = new Route()
          route.city.countryCode = dests[i]["code"]
          route.estimatedItemArrivalDate = dests[i]["estItemArrivalDate"]
          route.city.country = dests[i]["country"]
          route.city.name = dests[i]["city"]
          po.routes.push(route)
        }
      }
    }

    if (item["user_id"]) {
      po.owner = new User()
      po.owner.id = item["user_id"]
      po.owner.username = item["user_username"] ? item["user_username"] : ""
      po.owner.profilePicUrl = item["user_pp"] ? item["user_pp"]: ""
    }

    if (item["po_remaining_capacity"]) {
      po.additional["remaining_capacity"] = item["po_remaining_capacity"]
    }

    return po
  }

  getPurchaseOrder(id: string) {
    return this.http.get<ApiResponse<PurchaseOrder>>(API+"/purchaseorder/item/"+id).pipe(
      map(result => {
        let resp = new ApiResponse<PurchaseOrder>()
        resp.success = result["success"] ? result["success"] : false
        resp.errorId = result["success"] === false ? result["id"] : undefined
        if (result.success === true) {
          let data = result["data"]
          let po = this.parseToPurchaseOrder(data)
          resp.data = po
        }
        return resp;
      })
    )
  }


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
