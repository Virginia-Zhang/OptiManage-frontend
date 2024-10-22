// 路由配置
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "login",
			component: () => import("@/views/LoginView.vue"),
		},
		{
			path: "/dashboard",
			name: "dashboard",
			component: () => import("@/views/Dashboard.vue"),
		},
	],
})

export default router
