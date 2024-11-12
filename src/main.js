import { createApp } from "vue"
import App from "./App.vue"
import "./reset.css"
import router from "./router"
import { getPreferredLanguage } from "./utils/utils"

import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { createPinia } from "pinia"
import { en, ja, zhCn } from "element-plus/es/locales.mjs"

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

// 根据preferredLanguage设置ElementPlus的语言
const preferredLanguage = getPreferredLanguage()
let locale
switch (preferredLanguage) {
	case 1:
		locale = en
		break
	case 2:
		locale = zhCn
		break
	case 3:
		locale = ja
		break
	default:
		locale = en
		break
}

app.use(ElementPlus, { locale }).use(router).mount("#app")
