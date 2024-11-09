<!-- 用户管理模块回收站 -->
<template>
	<div class="btn-group">
		<el-button type="primary" :icon="RefreshRight" @click="batchRestore">批量恢复</el-button>
	</div>
	<el-table
		ref="userTableRef"
		:data="userList"
		:border="true"
		stripe
		style="width: 100%"
		@selection-change="handleSelectionChange"
	>
		<el-table-column type="selection" width="55" fixed="left" />
		<el-table-column type="index" width="60" fixed="left" />
		<el-table-column property="loginAct" label="账号" width="180" show-overflow-tooltip />
		<el-table-column property="name" label="姓名" width="180" show-overflow-tooltip />
		<el-table-column property="phone" label="手机" width="180" show-overflow-tooltip />
		<el-table-column property="email" label="邮箱" width="220" show-overflow-tooltip />
		<el-table-column
			property="region"
			label="地区"
			width="120"
			:formatter="regionFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="createTime"
			label="创建时间"
			width="180"
			:formatter="timeFormatter"
			show-overflow-tooltip
		/>
		<el-table-column fixed="right" label="操作" min-width="140">
			<template #default="scope">
				<el-button type="primary" size="small" @click="showUserDetails(scope.row)"
					>详情</el-button
				>
				<el-button type="success" size="small" @click="restoreUsers([scope.row.id])"
					>恢复</el-button
				>
			</template>
		</el-table-column>
	</el-table>
	<el-pagination
		background
		layout="prev, pager, next"
		:page-size="pageSize"
		:total="total"
		:current-page="currentPage"
		@current-change="handleCurrentChange"
	/>
	<!-- User details dialog -->
	<UserDetails ref="userDetailsRef" :user="user" />
</template>

<script setup>
import { ref, onMounted } from "vue"

import { PAGE_SIZE, regionData } from "@/constants/constants"
import { formatTime, messageTip } from "@/utils/utils"
import api from "@/http/api"
import UserDetails from "@/components/user/UserDetails.vue"

import { RefreshRight } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"

// Ref to user table
const userTableRef = ref(null)

const currentPage = ref(1)
const pageSize = ref(PAGE_SIZE)
const total = ref(0)

const userList = ref([])
// The ids of the users to be restored
const restoredIds = []

// The user object passed to UserDetails dialog
const user = ref({})
// Ref to UserDetails dialog
const userDetailsRef = ref(null)

const handleCurrentChange = val => {
	currentPage.value = val
	getUserList()
}

// Query user list by page
const getUserList = async () => {
	const params = {
		page: currentPage.value,
		pageSize: pageSize.value,
	}
	// Send request
	const res = await api.getDeletedUserList(params)
	if (res.code === 200) {
		userList.value = res.data.rows
		total.value = res.data.total
	}
}

// Show user details dialog
const showUserDetails = row => {
	if (!row) return
	if (userDetailsRef.value) {
		user.value = row
		userDetailsRef.value.toggleShowDialog()
	}
}

// Format region data
const regionFormatter = (row, column, cellValue, index) => {
	const region = regionData.find(item => item.value === cellValue)
	return region ? region.name : "未知地区"
}

// Format time
const timeFormatter = (row, column, cellValue, index) => {
	return formatTime(cellValue)
}

// To restore the selected user, a pop-up window shows asking if you want to delete it. Click OK and then delete it.
const restoreUsers = async ids => {
	ElMessageBox.confirm("确定要恢复吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			const params = {
				ids,
				accountEnabledValue: 1,
			}
			const res = await api.updateUsers(params)
			if (res.code === 200) {
				messageTip("success", "恢复成功!")
				getUserList()
			} else {
				messageTip("error", "恢复失败!请重试！")
			}
		})
		.catch(() => {
			// Click Cancel to clear the selected user array
			restoredIds.length = 0
			userTableRef.value.clearSelection()
		})
}

// Monitor changes of the selected status of table checkboxes
const handleSelectionChange = selectedUsers => {
	// Clear deletedIds last time
	restoredIds.length = 0
	// Get ids of the selected users this time and put them into deletedIds
	selectedUsers.forEach(item => {
		restoredIds.push(item.id)
	})
}

// Batch delete
const batchRestore = () => {
	if (!restoredIds.length) return messageTip("warning", "请选择用户！")
	restoreUsers(restoredIds)
}

onMounted(() => {
	getUserList()
})
</script>

<style scoped lang="scss">
.btn-group {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 20px;
}

.el-pagination {
	margin-top: 20px;
}
</style>
