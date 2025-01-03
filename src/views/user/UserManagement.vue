<!-- User Management component -->
<template>
	<!-- Search form -->
	<el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchFormRef">
		<el-form-item label="账号">
			<el-input v-model="searchForm.loginAct" placeholder="请输入账号" clearable />
		</el-form-item>
		<el-form-item label="姓名">
			<el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
		</el-form-item>
		<el-form-item label="地区" v-if="showRegion">
			<el-select
				v-model="searchForm.regions"
				placeholder="请选择地区"
				multiple
				collapse-tags
				collapse-tags-tooltip
				:max-collapse-tags="3"
				clearable
			>
				<template #prefix>
					<el-icon><MapLocation /></el-icon>
				</template>
				<el-option
					v-for="item in regionData"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" :icon="Search" @click="search" :loading="searchLoading"
				>搜索</el-button
			>
			<el-button :icon="Refresh" @click="reset">重置</el-button>
		</el-form-item>
	</el-form>
	<div class="btn-group">
		<el-button type="primary" :icon="Plus" @click="addUser" v-permission="'user:add'"
			>添加用户</el-button
		>
		<el-button
			type="danger"
			:icon="Delete"
			@click="batchDelete"
			v-permission="'user:delete'"
			v-if="userList.length"
			>批量删除</el-button
		>
	</div>
	<el-table
		ref="userTableRef"
		:data="userList"
		:border="true"
		stripe
		style="width: 100%"
		@selection-change="handleSelectionChange"
		v-loading="userListLoading"
		v-if="userList.length > 0 || userListLoading"
	>
		<el-table-column type="selection" width="55" fixed="left" />
		<el-table-column type="index" width="60" fixed="left" />
		<el-table-column property="loginAct" label="账号" width="180" show-overflow-tooltip />
		<el-table-column property="name" label="姓名" width="180" show-overflow-tooltip />
		<el-table-column
			property="phone"
			label="手机"
			width="180"
			:formatter="emptyFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="email"
			label="邮箱"
			:formatter="emptyFormatter"
			width="220"
			show-overflow-tooltip
		/>
		<el-table-column
			property="region"
			label="地区"
			width="120"
			:formatter="regionFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="roles"
			label="角色"
			width="180"
			:formatter="rolesFormatter"
			show-overflow-tooltip
		/>
		<el-table-column fixed="right" label="操作" :width="actionsBarWidth">
			<template #default="scope">
				<el-button
					type="primary"
					size="small"
					@click="showUserDetails(scope.row)"
					v-permission="'user:details'"
					>详情</el-button
				>
				<el-button
					type="success"
					size="small"
					@click="showEditUser(scope.row)"
					v-permission="'user:edit'"
				>
					编辑</el-button
				>
				<el-button
					type="danger"
					size="small"
					@click="deleteUsers([scope.row.id])"
					v-permission="'user:delete'"
				>
					删除</el-button
				>
			</template>
		</el-table-column>
	</el-table>
	<!-- When the table has no data, display the el-empty component -->
	<el-empty
		v-if="userList.length === 0 && !userListLoading"
		description="没有数据"
		style="margin-top: 20px"
	/>
	<el-pagination
		background
		layout="prev, pager, next"
		:page-size="pageSize"
		:total="total"
		:current-page="currentPage"
		@current-change="handleCurrentChange"
		v-if="userList.length > 0"
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
import { regionData, PAGE_SIZE, roleData } from "@/constants/constants"
import EditUser from "@/components/user/EditUser.vue"
import { messageTip, useCalculateActionsBarWidth, showRegion, emptyFormatter } from "@/utils/utils"

import { Plus, Delete, MapLocation, Search, Refresh } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"

const permissionItems = ["user:edit", "user:delete", "user:details"]
const actionsBarWidth = useCalculateActionsBarWidth(permissionItems)

const searchForm = ref({
	loginAct: null,
	name: null,
	regions: null,
})
const searchFormRef = ref({})
const searchLoading = ref(false)

const currentPage = ref(1)
const pageSize = ref(PAGE_SIZE)
const total = ref(0)

const userList = ref([])
const userListLoading = ref(false)
// The ids of the users to be deleted
const deletedIds = []

// The user object passed to UserDetails and EditUser dialog
const user = ref(null)
// Ref to UserDetails dialog
const userDetailsRef = ref(null)
// Ref to AddUser dialog
const addUserRef = ref(null)
// Ref to EditUser dialog
const editUserRef = ref(null)
// Ref to user table
const userTableRef = ref(null)

// Default query params, query all undeleted users
const params = {
	page: currentPage.value,
	pageSize: pageSize.value,
	isDeleted: 1,
}
const handleCurrentChange = val => {
	currentPage.value = val
	params.page = currentPage.value
	getUserList(params)
}

// Query user list by page
const getUserList = async (data = params) => {
	currentPage.value = data.page
	pageSize.value = data.pageSize
	userListLoading.value = true
	// Send request
	const res = await api.getUserList(data)
	userListLoading.value = false
	if (res?.code === 200) {
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

// Format roles data
const rolesFormatter = (row, column, cellValue, index) => {
	// Convert the current json string to an array
	const roleList = JSON.parse(cellValue)
	// Find the name corresponding to the current role in roleData, and then concat the names of all roles into a string and return it.
	if (roleList.length === 1 && roleList[0] == null) return
	return roleList.map(role => roleData.find(item => item.id === role).name).join(", ")
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
			const data = {
				ids,
				isDeletedValue: 0,
			}
			const res = await api.updateUsers(data)
			if (res?.code === 200) {
				messageTip("success", "删除成功!")
				currentPage.value = 1
				params.page = currentPage.value
				getUserList(params)
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

const search = async () => {
	// Reset the current page number to 1
	currentPage.value = 1
	params.page = currentPage.value
	params.regions =
		searchForm.value.regions && searchForm.value.regions.length
			? searchForm.value.regions.join(",")
			: null
	params.loginAct = searchForm.value.loginAct
	params.name = searchForm.value.name
	try {
		searchLoading.value = true
		await getUserList(params)
	} catch (error) {
		console.error("Error searching users:", error)
	} finally {
		searchLoading.value = false
	}
}

const reset = () => {
	searchForm.value.loginAct = null
	searchForm.value.name = null
	searchForm.value.regions = null
}
</script>

<style scoped lang="scss">
.demo-form-inline {
	.el-input {
		--el-input-width: 220px;
	}
	.el-select {
		--el-select-width: 220px;
	}
}

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
