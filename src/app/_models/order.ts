import { City } from "./places"
import { User } from "./user"

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
	owner: User
	orders: Order[]

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
		this.additional = {}
		this.owner = null
		this.orders = []
	}

	isCurrentlyOpen(): boolean {
		if (this.startDate === null || this.endDate === null) return false
		var now = new Date()
		return now.getTime() >= this.startDate.getTime() && now.getTime() <= this.endDate.getTime()
	}

	isOpeningSoon(): boolean {
		if (this.startDate === null || this.endDate === null) return false
		var now = new Date()
		return now.getTime() < this.startDate.getTime()
	}

	isOver(): boolean {
		if (this.startDate === null || this.endDate === null) return true
		var now = new Date()
		return now.getTime() >= this.endDate.getTime()
	}

	getRemainingTimePrintable(): string {
		var diffHr = 0
		var status = ""
		var now = new Date()
		if (!this.isCurrentlyOpen()) {
			if (now.getTime() < this.startDate.getTime()) {
				status = "before"
			} else {
				status = "after"
			}
		} else {
			status = "during"
		}

		if (status === "after") {
			return "PO sudah tidak berlaku"
		}

		if (status === "before") {
			diffHr = Math.floor((this.startDate.getTime() - now.getTime()) / (1000 * 3600))
		} else {
			diffHr = Math.floor((this.endDate.getTime() - now.getTime()) / (1000 * 3600))
		}
		if (diffHr > 24) {
			// Days before PO ends
			var value = Math.floor(diffHr/24)
			if (status === "before") {
				return "Buka dalam "+value+" hari"
			} else {
				return value + " hari lagi"
			}
		} else if (diffHr > 1) {
			// Hours before PO ends
			if (status === "before") {
				return "Buka dalam "+value+" jam"
			} else {
				return value + " jam lagi"
			}
		}
		return (status === "before") ? "Buka sebentar lagi" : "Tutup sebentar lagi"
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

export class Order {
	id: string
	capacityKg: number
	// TODO more props

	constructor() {
		this.id = ""
		this.capacityKg = 0
	}
}

export class Route {
	id: string
	city: City
	arrivalDate: Date
	estimatedItemArrivalDate: Date

	note: string = ""

	constructor() {
		this.id = ""
		this.city = new City()
		this.arrivalDate = null
		this.estimatedItemArrivalDate = null
		this.note = ""
	}
}
