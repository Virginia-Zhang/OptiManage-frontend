import { ElMessage } from "element-plus"
import storage from "./storage"
import dayjs from "dayjs"
import { useUserStore } from "@/stores/userStore"
import { useMarketingStore } from "@/stores/marketingStore"
import { computed, watch } from "vue"
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
	return userStore?.userInfo?.preferredLanguage
}

// Get roleList from Pinia
export const getRoleList = () => {
	const userStore = useUserStore()
	return userStore?.roleList
}

export const getPermissionList = () => {
	const userStore = useUserStore()
	return userStore?.permissionList
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
	if (res?.code === 200) {
		marketingStore.setOwnerOptions(res.data)
	}
}

// Calculate the width of the actions bar in the data table. Pass in permissionItems, which is an array of permission strings
export const useCalculateActionsBarWidth = permissionItems => {
	const userStore = useUserStore()
	// The number of buttons displayed in the actions bar
	let displayedButtons = 0
	// Update the number of buttons displayed in the actions bar  based on permissionList
	const updateDisplayedButtons = permissionList => {
		// Initialize the number of buttons displayed
		let count = 0
		// Iterate through the permissionList and count the number of permissions that match the specified permissions
		permissionItems.forEach(item => {
			if (permissionList.includes(item)) count++
		})
		displayedButtons = count
	}

	// Listen for changes in the permission list
	watch(
		() => userStore.permissionList,
		newPermissionList => {
			updateDisplayedButtons(newPermissionList)
		},
		{ immediate: true }
	)

	// Dynamically calculate actions bar column width
	const computedWidth = computed(() => {
		// When there is only one button, set the button width to 75px, otherwise set the button width to 65px
		let buttonWidth
		switch (displayedButtons) {
			case 1:
				buttonWidth = 75
				break
			case 2:
				buttonWidth = 70
				break
			default:
				buttonWidth = 65
				break
		}
		return buttonWidth * displayedButtons
	})
	return computedWidth
}
