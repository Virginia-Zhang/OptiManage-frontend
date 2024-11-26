// Product store
import { defineStore } from "pinia"
import storage from "@/utils/storage"

export const useProductStore = defineStore({
	id: "product",
	// First get the data locally and assign it to state
	state: () => ({
		// Product options list
		productOptions:
			storage.getItem("productOptions", "local") ||
			storage.getItem("productOptions", "session") ||
			[],
	}),
	actions: {
		setProductOptions(data) {
			this.productOptions = data
			// If the user selects "Remember Me", save the data to local storage, otherwise save it to session storage
			if (storage.getItem("token", "local")) {
				storage.setItem("productOptions", data, "local")
			} else {
				storage.setItem("productOptions", data, "session")
			}
		},
		clearAll() {
			this.productOptions = []
			if (storage.getItem("token", "local")) {
				storage.removeItem("productOptions", "local")
			} else {
				storage.removeItem("productOptions", "session")
			}
		},
	},
})
