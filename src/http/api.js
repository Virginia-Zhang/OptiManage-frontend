/**
 * manage api interface
 */

import request from "@/http/httpRequest"

export default {
	// Log in
	async login(data) {
		return await request.post("/login", data)
	},
	// Get user information
	async getUserInfo() {
		return await request.get("/user/info")
	},
	// Logout
	async logout() {
		return await request.post("/logout")
	},
	// Query user list by page
	async getUserList(params) {
		return await request.get("/user/list", params)
	},
	// Add user
	async addUser(data) {
		return await request.post("/user/", data)
	},
	// Edit user
	async editUser(data) {
		return await request.put("/user/", data)
	},
	// Delete users
	async deleteUsers(data) {
		return await request.delete("/user/", data)
	},
}
