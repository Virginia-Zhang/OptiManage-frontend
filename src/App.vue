<script setup>
import { watch, ref } from "vue"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import ja from "element-plus/es/locale/lang/ja"
import en from "element-plus/es/locale/lang/en"
import { getPreferredLanguage } from "@/utils/utils"

// Get user's preferredLanguage and dynamically set language of ElementPlus
const lang = ref(null)
// Listen for language changes
watch(
	() => getPreferredLanguage(),
	newValue => {
		switch (newValue) {
			case 1:
				lang.value = en
				break
			case 2:
				lang.value = zhCn
				break
			case 3:
				lang.value = ja
				break
			default:
				lang.value = en
				break
		}
	},
	{ immediate: true } // Make sure the language is applied when the page is initialized
)
</script>

<template>
	<!-- Set the language of ElementPlus using el-config-provider and locale -->
	<el-config-provider :locale="lang">
		<router-view />
	</el-config-provider>
</template>
