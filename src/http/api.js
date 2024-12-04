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
	// Get activity option list, including activity's id and name only
	async getActivityOptionList() {
		return await request.get("/activity/activities")
	},
	// Get product option list, including product's id and name only
	async getProductOptionList() {
		return await request.get("/product/products")
	},
	// Query marketing clues(leads) list by page
	async getClueList(params) {
		return await request.get("/clue/list", params)
	},
	// Add new marketing clue(lead)
	async addClue(data) {
		return await request.post("/clue/", data)
	},
	// Edit marketing clue(lead)
	async editClue(data) {
		return await request.put("/clue/", data)
	},
	// Remove/Restore marketing clues(leads)
	async updateClues(data) {
		return await request.put("/clue/updateClues", data)
	},
	// Add marketing clue(lead) remark
	async addClueRemark(data) {
		return await request.post("/clueRemark/", data)
	},
	// Query marketing clue(lead) remark list
	async getClueRemarkList(params) {
		return await request.get("/clueRemark/list", params)
	},
	// Edit marketing clue(lead) remark
	async editClueRemark(data) {
		return await request.put("/clueRemark/", data)
	},
	// Delete marketing clue(lead) remark by id
	async deleteClueRemarkById(id) {
		// Id is included in dynamic routing parameters
		return await request.delete("/clueRemark/" + id)
	},
	// Convert clue to customer
	async convertToCustomer(data) {
		return await request.post("/customer/", data)
	},
	// Query customer list by page
	async getCustomerList(params) {
		return await request.get("/customer/list", params)
	},
	// Query customer list without pagination
	async getCustomerListWithoutPagination() {
		return await request.get("/customer/all")
	},
	// Add customer remark
	async addCustomerRemark(data) {
		return await request.post("/customerRemark/", data)
	},
	// Query customer remark list
	async getCustomerRemarkList(params) {
		return await request.get("/customerRemark/list", params)
	},
	// Edit customer remark
	async editCustomerRemark(data) {
		return await request.put("/customerRemark/", data)
	},
	// Delete customer remark by id
	async deleteCustomerRemarkById(id) {
		// Id is included in dynamic routing parameters
		return await request.delete("/customerRemark/" + id)
	},
	// Create transaction
	async createTransaction(data) {
		return await request.post("/tran/", data)
	},
}
