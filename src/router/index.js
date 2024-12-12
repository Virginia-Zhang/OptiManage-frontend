// Routing configuration
import { createRouter, createWebHistory } from "vue-router"
import storage from "@/utils/storage"
import { messageTip, getPermissionList } from "@/utils/utils"

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
					component: () => import("@/views/user/UserManagement.vue"),
					meta: {
						title: "用户管理",
					},
					//If the user is not an administrator, access to this page is not allowed
					beforeEnter: (to, from) => {
						checkPermission("user:list")
					},
				},
				{
					path: "user/recycle",
					name: "user/recycle",
					component: () => import("@/views/user/UserRecycleBin.vue"),
					meta: {
						title: "用户管理-回收站",
					},
					//If the user is not an administrator, access to this page is not allowed
					beforeEnter: (to, from) => {
						checkPermission("user:list")
					},
				},
				{
					path: "marketing",
					name: "marketing",
					component: () => import("@/views/marketing/MarketingManagement.vue"),
					meta: {
						title: "市场活动",
					},
					// If the user's role does not include any of admin, marketing, and financing, access is not allowed.
					beforeEnter: (to, from) => {
						checkPermission("activity:list")
					},
				},
				// Jump from the marketing campaign/activity management page to the marketing campaign/activity details page
				{
					path: "marketing-details/:id",
					name: "marketing-details",
					component: () => import("@/views/marketing/MarketingDetails.vue"),
					meta: {
						title: "市场活动详情",
					},
					// If the user does not have the "activity:details" permission, access is prohibited.
					beforeEnter: (to, from) => {
						checkPermission("activity:details")
					},
				},
				// Jump from the marketing campaign/activity recycle bin page to the marketing campaign/activity details page
				{
					path: "marketing/recycle-details/:id",
					name: "marketing/recycle-details",
					component: () => import("@/views/marketing/MarketingDetails.vue"),
					meta: {
						title: "市场活动详情",
					},
					// If the user does not have the "activity:details" permission, access is prohibited.
					beforeEnter: (to, from) => {
						checkPermission("activity:details")
					},
				},
				{
					path: "marketing/recycle",
					name: "marketing/recycle",
					component: () => import("@/views/marketing/MarketingRecycleBin.vue"),
					meta: {
						title: "市场活动-回收站",
					},
					// If the user does not have the "activity:list" permission, access is prohibited.
					beforeEnter: (to, from) => {
						checkPermission("activity:list")
					},
				},
				{
					path: "clues",
					name: "clues",
					component: () => import("@/views/clues/CluesManagement.vue"),
					meta: {
						title: "线索管理",
					},
					// If the user does not have "clue:list" permission, access is prohibited
					beforeEnter: (to, from) => {
						checkPermission("clue:list")
					},
				},
				{
					path: "clues-add",
					name: "clues-add",
					component: () => import("@/views/clues/AddClue.vue"),
					meta: {
						title: "录入线索",
					},
					// If the user does not have "clue:add" permission, access is prohibited
					beforeEnter: (to, from) => {
						checkPermission("clue:add")
					},
				},
				{
					path: "clues-edit/:id",
					name: "clues-edit",
					component: () => import("@/views/clues/EditClue.vue"),
					meta: {
						title: "编辑线索",
					},
					// If the user does not have "clue:edit" permission, access is prohibited
					beforeEnter: (to, from) => {
						checkPermission("clue:edit")
					},
				},
				// Jump from the lead/clue management page to the lead/clue details page
				{
					path: "clues-details/:id",
					name: "clues-details",
					component: () => import("@/views/clues/ClueDetails.vue"),
					meta: {
						title: "线索详情",
					},
					// If the user does not have the "clue:details" permission, access is prohibited
					beforeEnter: (to, from) => {
						checkPermission("clue:details")
					},
				},
				// Jump from the lead/clue recycle bin page to the lead/clue details page
				{
					path: "clues/recycle-details/:id",
					name: "clues/recycle-details",
					component: () => import("@/views/clues/ClueDetails.vue"),
					meta: {
						title: "线索详情",
					},
					// If the user does not have the "clue:details" permission, access is prohibited
					beforeEnter: (to, from) => {
						checkPermission("clue:details")
					},
				},
				{
					path: "clues/recycle",
					name: "clues/recycle",
					component: () => import("@/views/clues/CluesRecycleBin.vue"),
					meta: {
						title: "线索管理-回收站",
					},
					// If the user does not have the "clue:list" permission, access is prohibited.
					beforeEnter: (to, from) => {
						checkPermission("clue:list")
					},
				},
				{
					path: "customer",
					name: "customer",
					component: () => import("@/views/customer/CustomerManagement.vue"),
					meta: {
						title: "客户管理",
					},
					// If the user does not have the "customer:list" permission, access is prohibited.
					beforeEnter: (to, from) => {
						checkPermission("customer:list")
					},
				},
				{
					path: "customer-details/:id",
					name: "customer-details",
					component: () => import("@/views/customer/CustomerDetails.vue"),
					meta: {
						title: "客户详情",
					},
					// If the user does not have the "customer:details" permission, access is prohibited.
					beforeEnter: (to, from) => {
						checkPermission("customer:details")
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

// Check whether the user has permission to access the current route
const checkPermission = permission => {
	const permissionList = getPermissionList()
	if (permissionList.indexOf(permission) === -1) {
		messageTip("warning", "您没有权限访问此页面")
		setTimeout(() => {
			router.back()
		}, 2000)
		return false
	}
}

// Route guard, determine whether the route the user wants to access exists; if exists, allow access, and modify the page title, otherwise jump to the 404 page
router.beforeEach((to, from) => {
	if (router.hasRoute(to.name)) {
		document.title = to.meta.title
	} else {
		router.push({ name: "not-found" })
	}
})
export default router
