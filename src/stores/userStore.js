// User Store
import { defineStore } from "pinia"
import storage from "@/utils/storage"

export const useUserStore = defineStore({
	id: "user",
	// First get the data locally and assign it to state
	state: () => ({
		// User's preferred language, default to English (2)
		preferredLanguage:
			storage.getItem("preferredLanguage", "local") ||
			storage.getItem("preferredLanguage", "session") ||
			1,
		// User's role list
		roleList:
			storage.getItem("roleList", "local") || storage.getItem("roleList", "session") || [],
		// User's permission list
		permissionList:
			storage.getItem("permissionList", "local") ||
			storage.getItem("permissionList", "session") ||
			[],
	}),
	actions: {
		setUserData(data) {
			this.preferredLanguage = data.preferredLanguage
			this.roleList = data.roleList
			this.permissionList = data.permissionList
		},
		clearUserData() {
			this.preferredLanguage = null
			this.roleList = []
			this.permissionList = []
		},
	},
})
