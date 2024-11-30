<!-- Customer management page -->
<template>
	<div class="btn-group">
		<el-button type="primary" :icon="DocumentCopy" @click="batchExport"
			>批量导出（Excel）</el-button
		>
		<el-button type="success" :icon="DocumentCopy" @click="selectAndExport"
			>选择导出（Excel）</el-button
		>
	</div>
	<!-- Table area to display the list of customers -->
	<el-table
		ref="customerTableRef"
		:data="customerList"
		:border="true"
		stripe
		style="width: 100%"
		@selection-change="handleSelectionChange"
	>
		<el-table-column type="selection" width="55" fixed="left" />
		<el-table-column type="index" width="60" fixed="left" />
		<el-table-column property="ownerAct" label="负责人" width="150" show-overflow-tooltip />
		<el-table-column property="fullName" label="姓名" width="150" show-overflow-tooltip />
		<el-table-column
			property="gender"
			label="性别"
			width="80"
			:formatter="genderFormatter"
			show-overflow-tooltip
		/>
		<el-table-column property="phone" label="手机" width="160" show-overflow-tooltip />
		<el-table-column property="email" label="邮箱" width="220" show-overflow-tooltip />
		<el-table-column
			property="needLoan"
			label="是否贷款"
			width="100"
			:formatter="needLoanFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="intentionProductName"
			label="意向产品"
			width="180"
			show-overflow-tooltip
		/>
		<el-table-column
			property="source"
			label="来源"
			width="150"
			:formatter="sourceFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="nextContactTime"
			label="下次联系时间"
			width="170"
			:formatter="timeFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="region"
			label="地区"
			width="100"
			:formatter="regionFormatter"
			show-overflow-tooltip
		/>
		<el-table-column fixed="right" label="操作" min-width="80">
			<template #default="scope">
				<el-button type="primary" size="small" @click="showCustomerDetails(scope.row)"
					>详情</el-button
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
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

import { showOwnerSearch, getOwnerList, formatTime, messageTip } from "@/utils/utils"
import {
	clueSourceOptions,
	regionData,
	PAGE_SIZE,
	genderOptions,
	needLoanOptions,
} from "@/constants/constants"
import api from "@/http/api"
import { useProductStore } from "@/stores/productStore"

import { Search, MapLocation, DocumentCopy } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"

const productStore = useProductStore()

const router = useRouter()

// Customer Table instance
const customerTableRef = ref(null)
// Customer list
const customerList = ref([])

// total number of customers
const total = ref(0)
// Current page number
const currentPage = ref(1)
// Number of items displayed per page
const pageSize = ref(PAGE_SIZE)

// The ids of the customers to be exported
const exportedIds = []

// Search parameters
let params = {
	page: currentPage.value,
	pageSize: pageSize.value,
}
// Get the list of customers
const getCustomerList = async params => {
	const res = await api.getCustomerList(params)
	if (res.code === 200) {
		customerList.value = res.data.rows
		total.value = res.data.total
	}
}

const handleCurrentChange = val => {
	currentPage.value = val
	params.page = currentPage.value
	getCustomerList(params)
}

// Gender formatter
const genderFormatter = (row, column, cellValue, index) => {
	return cellValue === 1 ? "男" : "女"
}

// Whether the loan is needed
const needLoanFormatter = (row, column, cellValue, index) => {
	return cellValue === 1 ? "需要" : "不需要"
}

// Clue source formatter
const sourceFormatter = (row, column, cellValue, index) => {
	const source = clueSourceOptions.find(item => item.id === cellValue)
	return source ? source.name : "未知来源"
}

const timeFormatter = (row, column, cellValue, index) => {
	return formatTime(cellValue)
}

// Region formatter
const regionFormatter = (row, column, cellValue, index) => {
	const region = regionData.find(item => item.id === cellValue)
	return region ? region.name : "未知地区"
}

onMounted(() => {
	getCustomerList(params)
})

const handleSelectionChange = selectedClues => {
	exportedIds.length = 0
	selectedClues.forEach(item => {
		exportedIds.push(item.id)
	})
}
</script>

<style scoped lang="scss">
.btn-group {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin: 20px 0;
}

.el-pagination {
	margin-top: 20px;
}
</style>
