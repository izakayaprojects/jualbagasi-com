import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ENV } from "./_global/global";
import { DateConverter, ApiResponse } from "./_models/utils";
import { PurchaseOrder, Currency, Route, Order } from "./_models/order";
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

    if (item["destinations"] && item["destinations"].length > 0) {
      let dests = item["destinations"]
      po.origin.id = dests[0]["id"]
      po.origin.city.countryCode = dests[0]["code"]
      po.origin.estimatedItemArrivalDate = dests[0]["estItemArrivalDate"]
      po.origin.city.country = dests[0]["country"]
      po.origin.city.name = dests[0]["city"]
      
      if (dests.length > 1) {
        for (var i = 1 ; i < dests.length ; i++) {
          let route = new Route()
          route.id = dests[i]["id"]
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

    if (item["orders"]) {
      let totalCapacity = 0
      item["orders"].forEach(e => {
        let ord = new Order()
        ord.id = e["id"]
        ord.capacityKg = e["capacity"]
        po.orders.push(ord)
        totalCapacity += ord.capacityKg
      })
      po.additional["capacity_taken"] = totalCapacity
      if (po.capacityKg > 0) {
        po.additional["capacity_percentage"] = totalCapacity / po.capacityKg
      }
    } else {
      po.additional["capacity_taken"] = 0
      po.additional["capacity_percentage"] = 0
    }

    po.additional["orders_count"] = item["orders_count"] ? item["orders_count"] : 0

    return po
  }

  getPurchaseOrder(id: string) {
    return this.http.get<PurchaseOrder>(API+"/purchaseorder/item/"+id).pipe(
      map(result => {
        if (result["success"] === true) {
          let po = this.parseToPurchaseOrder(result["data"])
          return po
        }
        return null
      })
    )
  }


  getPurchaseOrdersList(type: POListType = 1) {
    if (type == POListType.Manage) {
      let token = this.localStorage.retrieve("token")
      return this.http.post<PurchaseOrder[]>(API+"/purchaseorder/list-summary", {token: token}).pipe(
        map(result => {
          if (result["success"] === true) {
            let data = result["data"]
            let poList: PurchaseOrder[] = []
            data.forEach(d => poList.push(this.parseToPurchaseOrder(d)))
            return poList
          } else {
            return []
          }
        })
      )
    } else {
      return this.http.get<PurchaseOrder[]>(API+"/purchaseorder/list-display").pipe(
        map(result => {
          if (result["success"] === true) {
            let data = result["data"]
            let poList: PurchaseOrder[] = []
            data.forEach(d => poList.push(this.parseToPurchaseOrder(d)))
            return poList
          } else {
            return []
          }
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

  deleteDestination(poId: string, destId: string): Observable<ApiResponse<Boolean>> {
    let token = this.localStorage.retrieve("token")
    let body = { token: token, purchase_order_id: poId, destination_id: destId }
    return this.http.post<ApiResponse<Boolean>>(API+"/purchaseorder/destinations/delete", body).pipe(
      map(result => {
        let resp = new ApiResponse<Boolean>()
        resp.success = result["success"]
        resp.errorId = result["id"]
        resp.data = resp.success
        return resp
      })
    )
  }

  editDestination(poId: string, route: Route): Observable<ApiResponse<Boolean>> {
    let token = this.localStorage.retrieve("token")
    let body = { token: token, purchase_order_id: poId, destination_id: route.id }
    body["city"] = route.city.name
    body["country"] = route.city.country
    body["country_code"] = route.city.countryCode
    body["est_item_arrival_date"] = dateConv.toMySqlTimestamp(route.estimatedItemArrivalDate)
    console.log(body)
    return this.http.post<ApiResponse<Boolean>>(API+"/purchaseorder/destinations/edit", body).pipe(
      map(result => {
        let resp = new ApiResponse<Boolean>()
        resp.success = result["success"]
        resp.errorId = result["id"]
        resp.data = resp.success
        return resp
      })
    )
  }

  editPurchaseOrder(po_id: string, col: string, key: string[], newValue: string[]): 
    Observable<ApiResponse<Boolean>> {
      
    let token = this.localStorage.retrieve("token")
    let body = {token: token, purchase_order_id: po_id}
    for (var i = 0; i < key.length ; i++) {
      body[key[i]] = newValue[i]
    }
    return this.http.post<ApiResponse<Boolean>>
      (API+"/purchaseorder/edit/"+col, body).pipe(
      map(result => {
        let resp = new ApiResponse<Boolean>()
        resp.success = result["success"]
        resp.errorId = result["id"]
        resp.data = resp.success
        return resp
      })
    )
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
