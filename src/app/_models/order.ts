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
	city: string
	country: string
	arrivalDate: Date
	departureDate: Date
	note: string = ""

	constructor() {
		this.city = ""
		this.country = ""
		this.arrivalDate = null
		this.departureDate = null
		this.note = ""
	}
}
