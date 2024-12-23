// User Store
import { defineStore } from "pinia"
import storage from "@/utils/storage"

export const useUserStore = defineStore("user", {
	// First get the data locally and assign it to state
	state: () => ({
		// User's information
		userInfo:
			storage.getItem("userInfo", "local") || storage.getItem("userInfo", "session") || {},
		// User's role list
		roleList:
			storage.getItem("roleList", "local") || storage.getItem("roleList", "session") || [],
		// User's info
		permissionList:
			storage.getItem("permissionList", "local") ||
			storage.getItem("permissionList", "session") ||
			[],
	}),
	actions: {
		setUserData(data) {
			this.userInfo = data.userInfo
			this.roleList = data.roleList
			this.permissionList = data.permissionList
		},
		clearUserData() {
			this.userInfo = null
			this.roleList = []
			this.permissionList = []
		},
	},
})
