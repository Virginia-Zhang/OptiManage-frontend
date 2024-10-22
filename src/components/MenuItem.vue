<template>
	<el-sub-menu v-if="menuItem.children && menuItem.children.length" :index="menuItem.index">
		<template #title>
			<el-icon><component :is="menuItem.icon" /></el-icon>
			<span>{{ menuItem.title }}</span>
		</template>
		<MenuItem v-for="child in menuItem.children" :key="child.index" :menu-item="child" />
	</el-sub-menu>
	<el-menu-item v-else :index="menuItem.index">
		<el-icon><component :is="menuItem.icon" /></el-icon>
		<span>{{ menuItem.title }}</span>
	</el-menu-item>
</template>

<script setup>
import { defineProps } from "vue"
import { ElSubMenu, ElMenuItem, ElIcon } from "element-plus"
import MenuItem from "./MenuItem.vue"

const props = defineProps({
	menuItem: {
		type: Object,
		required: true,
	},
})
</script>

<style scoped></style>
