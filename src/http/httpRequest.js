import axios from "axios"
import config from "@/config"
import storage from "@/utils/storage"

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
		return response.data
	},
	error => {
		if (error.response) {
			// The server responded, but the status code was not 2xx
			const { status, data } = error.response
			switch (status) {
				case 401:
					console.error("未授权，请重新登录。")
					break
				case 403:
					console.error("拒绝访问。")
					break
				case 404:
					console.error("请求错误，未找到该资源。")
					break
				case 500:
					console.error("服务器错误，请稍后再试。")
					break
				default:
					console.error(`连接错误${status}`)
			}
			// Prompt based on the error information returned by the backend
			return Promise.reject(data)
		} else {
			// Handle unresponsive errors, such as network errors
			console.error("网络连接错误，请稍后再试。")
			return Promise.reject({ message: "网络连接错误，请稍后再试。" })
		}
	}
)

// 从storage中获取token
const token = storage.getItem("token", "local") || storage.getItem("token", "session")

// 请求拦截器
AxiosUtil.interceptors.request.use(
	config => {
		const { headers } = config
		if (token) {
			if (!headers.Authorization) headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

export default request
