/**
 * @description localStorage/sessionStorage secondary encapsulation
 * @author Virginia
 */
import config from "@/config"

export default {
	// Get the storage object corresponding to the current project namespace
	getStorage(type) {
		if (type === "local") {
			return JSON.parse(localStorage.getItem(config.namespace) || "{}")
		} else {
			return JSON.parse(sessionStorage.getItem(config.namespace) || "{}")
		}
	},
	/**
	 **
	 * @description Add data to storage
	 * @param {String} key Key
	 * @param {Any} value Value
	 * @param {String} type local or session
	 */
	setItem(key, value, type) {
		// Get the storage object of the current project
		const storage = this.getStorage(type)
		// Add new properties and values ​​to storage
		storage[key] = value
		if (type === "local") {
			// Store the updated storage back into local storage
			localStorage.setItem(config.namespace, JSON.stringify(storage))
		} else {
			sessionStorage.setItem(config.namespace, JSON.stringify(storage))
		}
	},
	// Get data from storage
	getItem(key, type) {
		return this.getStorage(type)[key]
	},
	// Delete data from storage
	removeItem(key, type) {
		const storage = this.getStorage(type)
		delete storage[key]
		if (type === "local") {
			localStorage.setItem(config.namespace, JSON.stringify(storage))
		} else {
			sessionStorage.setItem(config.namespace, JSON.stringify(storage))
		}
	},
	// Clear storage
	clear(type) {
		if (type === "local") {
			localStorage.removeItem(config.namespace)
		} else {
			sessionStorage.removeItem(config.namespace)
		}
	},
}
