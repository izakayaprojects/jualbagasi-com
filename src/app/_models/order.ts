import { City } from "./places"

export class PurchaseOrder {
	id: string
	title: string
	description: string
	bannerUrl: string
	capacityKg: number
	feePerKg: number
	currency: string
	startDate: Date
	endDate: Date
	createdAt: Date
	origin: Route
	routes: Route[]

	constructor() {
		this.id = ""
		this.title = ""
		this.description = ""
		this.bannerUrl = ""
		this.capacityKg = 0
		this.feePerKg = 0
		this.startDate = new Date()
		this.endDate = null
		this.origin = new Route()
		this.routes = []
		this.createdAt = null
	}
}

export class Route {
	city: City
	arrivalDate: Date
	estimatedItemArrivalDate: Date

	note: string = ""

	constructor() {
		this.city = new City()
		this.arrivalDate = null
		this.estimatedItemArrivalDate = null
		this.note = ""
	}
}
