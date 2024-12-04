// Customer store
import { defineStore } from "pinia"
import storage from "@/utils/storage"

export const useCustomerStore = defineStore("customer", {
	state: () => ({
		// Selected customer data
		selectedCustomer:
			storage.getItem("selectedCustomer", "local") ||
			storage.getItem("selectedCustomer", "session") ||
			{},
	}),
	actions: {
		setSelectedCustomer(customer) {
			this.selectedCustomer = customer
			if (storage.getItem("token", "local")) {
				storage.setItem("selectedCustomer", customer, "local")
			} else {
				storage.setItem("selectedCustomer", customer, "session")
			}
		},
		clearAll() {
			this.selectedCustomer = {}
			if (storage.getItem("token", "local")) {
				storage.removeItem("selectedCustomer", "local")
			} else {
				storage.removeItem("selectedCustomer", "session")
			}
		},
	},
})
