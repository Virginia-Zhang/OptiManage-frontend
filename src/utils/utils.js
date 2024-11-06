import { ElMessage } from "element-plus"
import storage from "./storage"

// Message pop-up window
export const messageTip = (type, content) => {
	return ElMessage({
		type,
		message: content,
		duration: 2000,
		center: true,
		showClose: true,
	})
}

// remove token in localStorage or sessionStorage
export const removeToken = () => {
	storage.removeItem("token", "local")
	storage.removeItem("token", "session")
}

// Clear storage
export const clearStorage = () => {
	storage.clear("local")
	storage.clear("session")
}

// Get preferredLanguage from storage, 1 is English, 2 is Chinese, 3 is Japanese
export const getPreferredLanguage = () => {
	return (
		storage.getItem("preferredLanguage", "local") ||
		storage.getItem("preferredLanguage", "session")
	)
}
