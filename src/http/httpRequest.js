import axios from "axios"
import config from "@/config"
import storage from "@/utils/storage"
import { messageTip, clearStorage } from "@/utils/utils"
import router from "@/router"

const AxiosUtil = axios.create({
	baseURL: config.baseApi,
	timeout: 10000,
	// withCredentials: true
})

const request = {
	// GET method

	get(url, params = {}, config = {}) {
		return AxiosUtil.get(url, { params, ...config })
	},

	// POST method

	post(url, data = {}, config = {}) {
		return AxiosUtil.post(url, data, config)
	},

	// PUT method

	put(url, data, config = {}) {
		return AxiosUtil.put(url, data, config)
	},

	// DELETE method

	delete(url, data, config = {}) {
		return AxiosUtil.delete(url, { data, ...config })
	},
}

// response interceptor
AxiosUtil.interceptors.response.use(
	response => {
		// When token-related problems occur, show the message "Token is invalid. Please log in again", then clear the storage, and jump to the login page in 2 seconds.
		if (response.data.code > 900) {
			messageTip("error", "Token无效，请重新登录！")
			clearStorage()
			setTimeout(() => {
				router.push("/")
			}, 2000)
			return
		}
		return response.data
	},
	error => {
		if (error.response) {
			// The request was made and the server responded with a status code that falls out of the range of 2xx.
			messageTip("error", "服务器异常，请稍后再试。")
			return Promise.reject(new Error(JSON.stringify(error.response.data)))
		} else {
			// Handle unresponsive errors, such as network errors
			messageTip("error", "服务器异常，请稍后再试。")
			return Promise.reject(new Error("服务器异常，请稍后再试。"))
		}
	}
)

// request interceptor
AxiosUtil.interceptors.request.use(
	config => {
		const { headers } = config
		// Get token from storage
		const token = storage.getItem("token", "local") || storage.getItem("token", "session")
		// Set token into header
		if (token) {
			if (!headers.Authorization) headers.Authorization = `Bearer ${token}`
		}
		// Set rememberMe into header
		headers.rememberMe = storage.getItem("token", "local") ? "true" : "false"
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

export default request
