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
	// Remove/Restore users
	async updateUsers(data) {
		return await request.put("/user/updateUsers", data)
	},
	// Query marketing campaigns(activities) list by page
	async getActivityList(params) {
		return await request.get("/activity/list", params)
	},
	// Query deleted user list by page
	async getDeletedUserList(params) {
		return await request.get("/user/deletedList", params)
	},
}
