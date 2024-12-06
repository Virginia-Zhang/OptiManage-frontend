<script setup>
import { watch, ref } from "vue"
import { en, zhCn, ja } from "element-plus/es/locales.mjs"
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

<style scoped></style>
