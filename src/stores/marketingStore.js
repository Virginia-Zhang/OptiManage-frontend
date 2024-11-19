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
		clearSelectedMarketingActivity() {
			this.selectedMarketingActivity = {}
			if (storage.getItem("token", "local")) {
				storage.removeItem("selectedMarketingActivity", "local")
			} else {
				storage.removeItem("selectedMarketingActivity", "session")
			}
		},
	},
})
