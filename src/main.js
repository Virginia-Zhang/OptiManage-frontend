import { createApp, watch } from "vue"
import App from "./App.vue"
import "./reset.css"
import router from "./router"

import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { createPinia } from "pinia"
import { useUserStore } from "@/stores/userStore"

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

const userStore = useUserStore()
// Global custom directive, to control button/function permissions
app.directive("permission", {
	mounted(el, binding) {
		const permissionList = userStore.permissionList
		const permission = binding.value
		if (permissionList) {
			// If the permission does not exist in the permissionList, remove the button element from the page
			if (!permissionList.includes(permission)) {
				el.parentNode.removeChild(el)
			}
		}
	},
})

app.use(ElementPlus).use(router).mount("#app")
