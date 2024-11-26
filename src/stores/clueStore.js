// Marketing clue/lead store
import { defineStore } from "pinia"
import storage from "@/utils/storage"

export const useClueStore = defineStore({
	id: "clue",
	// First get the data locally and assign it to state
	state: () => ({
		// Selected marketing clue data
		selectedClue:
			storage.getItem("selectedClue", "local") ||
			storage.getItem("selectedClue", "session") ||
			{},
	}),
	actions: {
		setSelectedClue(data) {
			this.selectedClue = data
			// If the user selects "Remember Me", save the data to local storage, otherwise save it to session storage
			if (storage.getItem("token", "local")) {
				storage.setItem("selectedClue", data, "local")
			} else {
				storage.setItem("selectedClue", data, "session")
			}
		},
		clearAll() {
			this.selectedClue = {}
			if (storage.getItem("token", "local")) {
				storage.removeItem("selectedClue", "local")
			} else {
				storage.removeItem("selectedClue", "session")
			}
		},
	},
})
