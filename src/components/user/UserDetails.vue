<!-- User details pop-up window -->
<template>
	<el-dialog v-model="dialogVisible" title="用户详情" width="30%" :before-close="handleClose">
		<el-descriptions :column="1" :border="true" label-width="120px">
			<el-descriptions-item label="ID">{{ user.id }}</el-descriptions-item>
			<el-descriptions-item label="账号">{{ user.loginAct }}</el-descriptions-item>
			<el-descriptions-item label="姓名">{{ user.name }}</el-descriptions-item>
			<el-descriptions-item label="手机">{{ user.phone }}</el-descriptions-item>
			<el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
			<el-descriptions-item label="地区">{{
				convertRegionToText(user.region)
			}}</el-descriptions-item>
			<el-descriptions-item label="角色">{{ roles }}</el-descriptions-item>
			<el-descriptions-item label="账号未过期">{{
				user.accountNoExpired ? "是" : "否"
			}}</el-descriptions-item>
			<el-descriptions-item label="密码未过期">{{
				user.credentialsNoExpired ? "是" : "否"
			}}</el-descriptions-item>
			<el-descriptions-item label="账号未锁定">{{
				user.accountNoLocked ? "是" : "否"
			}}</el-descriptions-item>
			<el-descriptions-item label="账号是否启用">{{
				user.accountEnabled ? "是" : "否"
			}}</el-descriptions-item>
			<el-descriptions-item label="创建时间">{{
				formatTime(user.createTime)
			}}</el-descriptions-item>
			<el-descriptions-item label="创建人">{{ user.createByAct }}</el-descriptions-item>
			<el-descriptions-item :label="user.accountEnabled ? '编辑时间' : '删除时间'">{{
				formatTime(user.editTime)
			}}</el-descriptions-item>
			<el-descriptions-item :label="user.accountEnabled ? '编辑人' : '删除人'">{{
				user.editByAct
			}}</el-descriptions-item>
			<el-descriptions-item label="最近登录时间">{{
				formatTime(user.lastLoginTime)
			}}</el-descriptions-item>
		</el-descriptions>
	</el-dialog>
</template>

<script setup>
import { ref, watchEffect } from "vue"

import { regionData, roleData } from "@/constants/constants"
import { formatTime } from "@/utils/utils"

const props = defineProps({
	// Receive user information passed by the parent component
	user: Object,
})

// Variable that controls the visibility of pop-up window
const dialogVisible = ref(false)
// User's role list, which will be displayed on the page as a string
const roles = ref("")

// Monitor the changes in props.user and dialogVisible. When the user clicks the details button to display the pop-up window, and props.user is not empty, convert the current json string to an array and find the name corresponding to the current role in roleData, and then concat the names of all roles into a string.
watchEffect(async () => {
	if (props.user && dialogVisible.value) {
		// Convert the current json string to an array
		const roleList = JSON.parse(props.user.roles)
		// Find the name corresponding to the current role in roleData, and then concat the names of all roles into a string.
		if (!roleList.length) return
		roles.value = roleList.map(role => roleData.find(item => item.id === role).name).join(", ")
	}
})

// Control the visibility of pop-up window
const toggleShowDialog = () => {
	dialogVisible.value = !dialogVisible.value
}

// Expose toggleShowDialog function to parent component by defineExpose
defineExpose({ toggleShowDialog })

// Close dialog
const handleClose = () => {
	dialogVisible.value = false
}

// Convert the value of region into the corresponding text and display on the page
const convertRegionToText = region => {
	// Traverse regionData, find the corresponding text, and return
	for (const item of regionData) {
		if (item.id === region) {
			return item.name
		}
	}
}
</script>
