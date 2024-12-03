<!-- Customer management page -->
<template>
	<div class="btn-group">
		<el-button type="primary" :icon="DocumentCopy" @click="exportAll"
			>全部导出（Excel）</el-button
		>
		<el-button type="success" :icon="DocumentCopy" @click="exportSelected"
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
	customerExcelHeaders,
} from "@/constants/constants"
import api from "@/http/api"
import { useProductStore } from "@/stores/productStore"

import { Search, MapLocation, DocumentCopy } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"
import * as XLSX from "xlsx"
import dayjs from "dayjs"

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

// The customer data to be exported
const exportedCustomers = []

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
	exportedCustomers.length = 0
	selectedClues.forEach(item => {
		exportedCustomers.push(item)
	})
}

/**
 *	Process the values ​​of specific fields when exporting excel according to mapping rules, including gender, needLoan, source, region
	gender: 1-male, 2-female, other-unknown
	needLoan: 0-no need, 1-need, other-unknown
	source: id in clueSourceOptions, corresponding to sourceName
	region: id in regionData, corresponding to regionName
 */
//
const mapGender = gender => {
	return gender === 1 ? "男性" : gender === 2 ? "女性" : "--"
}

const mapNeedLoan = needLoan => {
	return needLoan === 0 ? "不需要" : needLoan === 1 ? "需要" : "--"
}

const mapSource = sourceId => {
	const source = clueSourceOptions.find(option => option.id === sourceId)
	return source ? source.name : "--"
}

const mapRegion = regionId => {
	const region = regionData.find(r => r.id === regionId)
	return region ? region.name : "--"
}

// Export incoming customer data to excel
const exportExcel = customerData => {
	// Dynamically generate formatted data
	const formattedData = customerData.map(item => {
		const formattedItem = {}

		// Traverse the mapped fields and map the actual data fields to the header names
		customerExcelHeaders.forEach(field => {
			const key = field.key
			let value = item[key]

			// Perform value conversions for specific fields
			switch (key) {
				case "gender":
					value = mapGender(value) // Mapping gender
					break
				case "needLoan":
					value = mapNeedLoan(value) // Map whether need loan
					break
				case "source":
					value = mapSource(value) // Map customer sources
					break
				case "region":
					value = mapRegion(value) // Map region
					break
				default:
					// Other fields will not be processed
					break
			}

			formattedItem[field.label] = value // Fill into formatted items
		})

		return formattedItem
	})

	// Convert data to worksheet
	const ws = XLSX.utils.json_to_sheet(formattedData)

	// Create a new workbook
	const wb = XLSX.utils.book_new()
	// Add a worksheet to a workbook
	XLSX.utils.book_append_sheet(wb, ws, "Customer Data")

	// Use dayjs to get the current date and format the file name
	const fileName = `Customer Data ${dayjs().format("YYYYMMDD")}.xlsx`

	// Export Excel file
	XLSX.writeFile(wb, fileName)
}

// Export all customer data
const exportAll = async () => {
	// A confirmation box pops up, asking the user to confirm exporting all customer data.
	ElMessageBox.confirm("确认导出全部客户数据吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		// Query all customer data without pagination
		const result = await api.getCustomerListWithoutPagination()
		// Export data to excel
		if (result.code == 200 && result.data?.length > 0) {
			exportExcel(result.data)
		}
	})
}

// Export selected customer data
const exportSelected = () => {
	// If no data is selected, a pop-up window shows to prompt the user
	if (exportedCustomers.length === 0) {
		messageTip("warning", "请先选择要导出的数据！")
		return
	}
	// A confirmation box pops up, asking user to confirm exporting the selected data.
	ElMessageBox.confirm("确认导出选中的数据吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(() => {
			// Export selected data
			exportExcel(exportedCustomers)
			// Clear the selected customers array
			exportedCustomers.length = 0
			customerTableRef.value.clearSelection()
		})
		.catch(() => {
			// Click Cancel to clear the selected customers array
			exportedCustomers.length = 0
			customerTableRef.value.clearSelection()
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
