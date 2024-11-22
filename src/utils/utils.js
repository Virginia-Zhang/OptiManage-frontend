import { ElMessage } from "element-plus"
import storage from "./storage"
import dayjs from "dayjs"
import { useUserStore } from "@/stores/userStore"
import { useMarketingStore } from "@/stores/marketingStore"
import { computed } from "vue"
import api from "@/http/api"

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

// A computed attribute, controls whether the person in charge search box is displayed or not. If the user is admin, returns true, otherwise returns false.
export const showOwnerSearch = computed(() => {
	const roleList = getRoleList()
	return roleList.indexOf("admin") !== -1
})

// Get owner options list and assign it to ownerOptions in Pinia
export const getOwnerList = async () => {
	if (!showOwnerSearch.value) return
	const res = await api.getOwnerList()
	const marketingStore = useMarketingStore()
	if (res.code === 200) {
		marketingStore.setOwnerOptions(res.data)
	}
}
