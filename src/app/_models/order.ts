import { City } from "./places"

export class PurchaseOrder {
	id: string
	title: string
	description: string
	bannerUrl: string
	capacityKg: number
	feePerKg: number
	currency: Currency
	startDate: Date
	endDate: Date
	createdAt: Date
	origin: Route
	routes: Route[]
	additional: any

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
		this.currency = new Currency()
	}

	isCurrentlyOpen(): boolean {
		if (this.startDate === null || this.endDate === null) return false
		var now = new Date()
		return now.getTime() >= this.startDate.getTime() && now.getTime() <= this.endDate.getTime()
	}

	getRemainingTimePrintable(): string {
		if (!this.isCurrentlyOpen()) {
			return ""
		}
		var now = new Date()
		var diffHr = Math.floor((this.endDate.getTime() - now.getTime()) / (1000 * 3600))
		if (diffHr > 24) {
			// Days before PO ends
			var value = Math.floor(diffHr/24)
			return value + " hari lagi"
		} else if (diffHr > 1) {
			// Hours before PO ends
			return diffHr + " jam lagi"
		}
		return "Tutup sebentar lagi"
	}
}

export class Currency {
	id: number
	symbol: string
	name: string
	
	constructor() {
		this.id = -1
		this.symbol = ""
		this.name = ""
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
