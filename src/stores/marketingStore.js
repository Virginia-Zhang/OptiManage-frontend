// Marketing activity store
import { defineStore } from "pinia"
import storage from "@/utils/storage"

export const useMarketingStore = defineStore({
	id: "marketing",
	// First get the data locally and assign it to state
	state: () => ({
		// User's selected marketing activity
		selectedMarketingActivity:
			storage.getItem("selectedMarketingActivity", "local") ||
			storage.getItem("selectedMarketingActivity", "session" || {}),
		// Owner options list
		ownerOptions:
			storage.getItem("ownerOptions", "local") ||
			storage.getItem("ownerOptions", "session") ||
			[],
		// Marketing activity options list
		activityOptions:
			storage.getItem("activityOptions", "local") ||
			storage.getItem("activityOptions", "session") ||
			[],
	}),
	actions: {
		setSelectedMarketingActivity(data) {
			this.selectedMarketingActivity = data
			// If the user selects "Remember Me", save the data to local storage, otherwise save it to session storage
			if (storage.getItem("token", "local")) {
				storage.setItem("selectedMarketingActivity", data, "local")
			} else {
				storage.setItem("selectedMarketingActivity", data, "session")
			}
		},
		setOwnerOptions(data) {
			this.ownerOptions = data
			// If the user selects "Remember Me", save the data to local storage, otherwise save it to session storage
			if (storage.getItem("token", "local")) {
				storage.setItem("ownerOptions", data, "local")
			} else {
				storage.setItem("ownerOptions", data, "session")
			}
		},
		setActivityOptions(data) {
			this.activityOptions = data
			// If the user selects "Remember Me", save the data to local storage, otherwise save it to session storage
			if (storage.getItem("token", "local")) {
				storage.setItem("activityOptions", data, "local")
			} else {
				storage.setItem("activityOptions", data, "session")
			}
		},
		clearAll() {
			this.selectedMarketingActivity = {}
			this.ownerOptions = []
			this.activityOptions = []
			if (storage.getItem("token", "local")) {
				storage.removeItem("selectedMarketingActivity", "local")
				storage.removeItem("ownerOptions", "local")
				storage.removeItem("activityOptions", "local")
			} else {
				storage.removeItem("selectedMarketingActivity", "session")
				storage.removeItem("ownerOptions", "session")
				storage.removeItem("activityOptions", "session")
			}
		},
	},
})
