export class User {
	id: string
	username: string
	email: string
	role: string
	isActive: boolean
	profilePicUrl: string
	createdAt: Date

	constructor() {
		this.id = ""
		this.username = ""
		this.email = ""
		this.role = ""
		this.isActive = true
		this.profilePicUrl = ""
		this.createdAt = null
	}
}