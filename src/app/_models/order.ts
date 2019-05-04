export class PurchaseOrder {
	id: string
	title: string
	description: string
	bannerUrl: string
	capacityKg: number
	feePerKg: number
	origin: Route
	routes: Route[]
}

export class Route {
	city: string
	country: string
	arrivalDate: Date
	departureDate: Date
	note: string = ""
}