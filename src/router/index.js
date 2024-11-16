// Routing configuration
import { createRouter, createWebHistory } from "vue-router"
import storage from "@/utils/storage"
import { messageTip } from "../utils/utils"

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "login",
			component: () => import("@/views/LoginView.vue"),
			meta: {
				title: "OptiManage-优客易-オプティマネ",
			},
			// The route is exclusively guarded. After logging in, you are not allowed to access the login page again.
			beforeEnter: (to, from) => {
				const token =
					storage.getItem("token", "local") || storage.getItem("token", "session")
				if (token && to.path == "/") {
					// If there is a previous page, return to the previous page. If there is no previous page (just open the system), jump directly to the home page.
					if (window.history.length > 1) {
						messageTip("warning", "您已登录，请勿重复登录")
						setTimeout(() => {
							router.back()
						}, 2000)
					} else {
						router.push("/dashboard")
					}
					return false
				}
			},
		},
		{
			path: "/dashboard",
			name: "dashboard",
			component: () => import("@/views/Dashboard.vue"),
			meta: {
				title: "首页",
			},
			children: [
				{
					path: "user",
					name: "user",
					component: () => import("@/views/UserManagement.vue"),
					meta: {
						title: "用户管理",
					},
				},
				{
					path: "user-recycle",
					name: "user-recycle",
					component: () => import("@/views/UserRecycleBin.vue"),
					meta: {
						title: "用户管理-回收站",
					},
				},
				{
					path: "marketing",
					name: "marketing",
					component: () => import("@/views/MarketingManagement.vue"),
					meta: {
						title: "市场活动",
					},
				},
			],
		},
		// 404 page
		{
			name: "not-found",
			path: "/404",
			component: () => import("@/views/NotFound.vue"),
			meta: {
				title: "页面不存在",
			},
		},
	],
})

// Route guard, determine whether the route the user wants to access exists; if exists, allow access, and modify the page title, otherwise jump to the 404 page
router.beforeEach((to, from) => {
	if (router.hasRoute(to.name)) {
		document.title = to.meta.title
	} else {
		router.push({ name: "not-found" })
	}
})
export default router
