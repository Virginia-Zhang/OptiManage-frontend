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
	// Query marketing campaigns(activities) owners list
	async getOwnerList() {
		return await request.get("/user/owners")
	},
	// Add new marketing campaign(activity)
	async addActivity(data) {
		return await request.post("/activity/", data)
	},
	// Edit marketing campaign(activity)
	async editActivity(data) {
		return await request.put("/activity/", data)
	},
	// Add marketing activity remark
	async addActivityRemark(data) {
		return await request.post("/activityRemark/", data)
	},
	// Query marketing activity remark list
	async getActivityRemarkList(params) {
		return await request.get("/activityRemark/list", params)
	},
	// Edit marketing activity remark
	async editActivityRemark(data) {
		return await request.put("/activityRemark/", data)
	},
	// Delete marketing activity remark by id
	async deleteActivityRemarkById(id) {
		// Id is included in dynamic routing parameters
		return await request.delete("/activityRemark/" + id)
	},
	// Remove/Restore marketing campaigns(activities)
	async updateActivities(data) {
		return await request.put("/activity/updateActivities", data)
	},
}
