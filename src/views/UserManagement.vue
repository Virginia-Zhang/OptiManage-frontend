<!-- User Management component -->
<template>
	<div class="btn-group">
		<el-button type="primary" :icon="Plus" @click="addUser">添加用户</el-button>
		<el-button type="danger" :icon="Delete" @click="batchDelete">批量删除</el-button>
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
		<el-table-column fixed="right" label="操作" min-width="210">
			<template #default="scope">
				<el-button type="primary" size="small" @click="showUserDetails(scope.row)"
					>详情</el-button
				>
				<el-button type="success" size="small" @click="showEditUser(scope.row)"
					>编辑</el-button
				>
				<el-button type="danger" size="small" @click="deleteUsers([scope.row.id])"
					>删除</el-button
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
	<!-- Add user dialog -->
	<AddUser ref="addUserRef" @getUserList="getUserList" />
	<!-- Edit user dialog -->
	<EditUser ref="editUserRef" :user="user" @getUserList="getUserList" />
</template>

<script setup>
import { ref, onMounted } from "vue"

import api from "@/http/api"
import UserDetails from "@/components/user/UserDetails.vue"
import AddUser from "@/components/user/AddUser.vue"
import { regionData, PAGE_SIZE } from "@/constants/constants"
import EditUser from "@/components/user/EditUser.vue"
import { messageTip, formatTime } from "@/utils/utils"

import { Plus, Delete } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"

const currentPage = ref(1)
const pageSize = ref(PAGE_SIZE)
const total = ref(0)

const userList = ref([])
// The ids of the users to be deleted
const deletedIds = []

// The user object passed to UserDetails and EditUser dialog
const user = ref({})
// Ref to UserDetails dialog
const userDetailsRef = ref(null)
// Ref to AddUser dialog
const addUserRef = ref(null)
// Ref to EditUser dialog
const editUserRef = ref(null)
// Ref to user table
const userTableRef = ref(null)

// Default pagination params
const params = {
	page: currentPage.value,
	pageSize: pageSize.value,
}
const handleCurrentChange = val => {
	currentPage.value = val
	params.page = currentPage.value
	getUserList(params)
}

// Query user list by page
const getUserList = async data => {
	currentPage.value = data.page
	pageSize.value = data.pageSize
	// Send request
	const res = await api.getUserList(data)
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

// Show add user dialog
const addUser = () => {
	if (addUserRef.value) {
		addUserRef.value.showAddUserDialog()
	}
}

// Format region data
const regionFormatter = (row, column, cellValue, index) => {
	const region = regionData.find(item => item.id === cellValue)
	return region ? region.name : "未知地区"
}

// Format time
const timeFormatter = (row, column, cellValue, index) => {
	return formatTime(cellValue)
}

// Show edit user dialog
const showEditUser = row => {
	if (!row) return
	if (editUserRef.value) {
		user.value = row
		editUserRef.value.showEditUserDialog()
	}
}

// To delete the selected user, a pop-up window shows asking if you want to delete it. Click OK and then delete it.
const deleteUsers = async ids => {
	ElMessageBox.confirm("确定要删除吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			const params = {
				ids,
				accountEnabledValue: 0,
			}
			const res = await api.updateUsers(params)
			if (res.code === 200) {
				messageTip("success", "删除成功!")
				getUserList({
					page: 1,
					pageSize: pageSize.value,
				})
				currentPage.value = 1
			} else {
				messageTip("error", "删除失败!请重试！")
			}
		})
		.catch(() => {
			// Click Cancel to clear the selected user array
			deletedIds.length = 0
			userTableRef.value.clearSelection()
		})
}

// Monitor changes of the selected status of table checkboxes
const handleSelectionChange = selectedUsers => {
	// Clear deletedIds last time
	deletedIds.length = 0
	// Get ids of the selected users this time and put them into deletedIds
	selectedUsers.forEach(item => {
		if (!item.accountEnabled) return
		deletedIds.push(item.id)
	})
}

// Batch delete
const batchDelete = () => {
	if (!deletedIds.length) return messageTip("warning", "请选择用户！")
	deleteUsers(deletedIds)
}

onMounted(() => {
	getUserList(params)
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
