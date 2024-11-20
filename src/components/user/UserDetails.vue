<!-- User details pop-up window -->
<template>
	<el-dialog v-model="dialogVisible" title="用户详情" width="30%" :before-close="handleClose">
		<el-descriptions :column="1" :border="true">
			<el-descriptions-item label="ID">{{ user.id }}</el-descriptions-item>
			<el-descriptions-item label="账号">{{ user.loginAct }}</el-descriptions-item>
			<el-descriptions-item label="姓名">{{ user.name }}</el-descriptions-item>
			<el-descriptions-item label="手机">{{ user.phone }}</el-descriptions-item>
			<el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
			<el-descriptions-item label="地区">{{
				convertRegionToText(user.region)
			}}</el-descriptions-item>
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
import { ref } from "vue"

import { regionData } from "@/constants/constants"
import { formatTime } from "@/utils/utils"

defineProps({
	// Receive user information passed by the parent component
	user: Object,
})

// Variable that controls the visibility of pop-up window
const dialogVisible = ref(false)

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

// Convert the value of region into the corresponding text and display it on the page
const convertRegionToText = region => {
	// Traverse regionData, find the corresponding text, and return
	for (const item of regionData) {
		if (item.id === region) {
			return item.name
		}
	}
}
</script>
