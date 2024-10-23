/**
 * api接口管理
 */

import request from "@/http/httpRequest"

export default {
	// 登录
	async login(data) {
		return await request.post("/api/login", data)
	},
	// 获取用户信息
	async getUserInfo() {
		return await request.get("/api/user/info")
	},
}
