import { ElMessage } from "element-plus"
import storage from "./storage"
import dayjs from "dayjs"
import { useUserStore } from "@/stores/userStore"

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

// Get preferredLanguage from Pinia, 1 is English, 2 is Chinese, 3 is Japanese
export const getPreferredLanguage = () => {
	const userStore = useUserStore()
	return userStore?.preferredLanguage
}

// Get roleList from Pinia
export const getRoleList = () => {
	const userStore = useUserStore()
	return userStore?.roleList
}

// Format time
export const formatTime = time => {
	if (!time) return ""
	return dayjs(time).format("YYYY-MM-DD HH:mm:ss")
}

// Turn formatted time string into timestamp
export const parseTime = time => {
	return dayjs(time).valueOf()
}
