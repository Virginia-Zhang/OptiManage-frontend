<!-- User Management component -->
<template>
	<div class="btn-group">
		<el-button type="primary" :icon="Plus" @click="addUser">添加用户</el-button>
		<el-button type="danger" :icon="Delete" @click="batchDelete">批量删除</el-button>
	</div>
	<el-table
		:data="userList"
		:border="true"
		stripe
		style="width: 100%"
		@selection-change="handleSelectionChange"
	>
		<el-table-column type="selection" width="55" />
		<el-table-column type="index" width="60" />
		<el-table-column property="loginAct" label="账号" width="180" show-overflow-tooltip />
		<el-table-column property="name" label="姓名" width="180" show-overflow-tooltip />
		<el-table-column property="phone" label="手机" width="180" show-overflow-tooltip />
		<el-table-column property="email" label="邮箱" width="220" show-overflow-tooltip />
		<el-table-column property="createTime" label="创建时间" width="150" show-overflow-tooltip />
		<el-table-column fixed="right" label="操作" min-width="200">
			<template #default>
				<el-button type="primary" size="small">详情</el-button>
				<el-button type="success" size="small">编辑</el-button>
				<el-button type="danger" size="small">删除</el-button>
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
</template>

<script setup>
import { ref, onMounted } from "vue"
import { Plus, Delete } from "@element-plus/icons-vue"
import api from "@/http/api"

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const userList = ref([])

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
	const res = await api.getUserList(params)
	if (res.code === 200) {
		userList.value = res.data.rows
		total.value = res.data.total
	}
}

const handleSelectionChange = val => {}

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
