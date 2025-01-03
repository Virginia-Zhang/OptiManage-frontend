<!-- Customer management page -->
<template>
	<!-- Search form -->
	<el-form
		:inline="true"
		:model="searchForm"
		class="demo-form-inline"
		:rules="rules"
		ref="searchFormRef"
	>
		<el-form-item label="客户ID" prop="id">
			<el-input v-model="searchForm.id" placeholder="请输入客户ID" type="number" clearable />
		</el-form-item>
		<el-form-item label="负责人" v-if="showOwner">
			<el-select
				v-model="searchForm.owners"
				placeholder="请选择负责人"
				multiple
				collapse-tags
				collapse-tags-tooltip
				:max-collapse-tags="3"
				clearable
			>
				<el-option
					v-for="item in ownerOptionsList"
					:key="item.id"
					:label="item.loginAct"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="客户姓名">
			<el-input v-model="searchForm.fullName" placeholder="请输入客户姓名" clearable />
		</el-form-item>
		<el-form-item label="客户性别">
			<el-select v-model="searchForm.gender" placeholder="请选择客户性别" clearable>
				<el-option
					v-for="item in genderOptions"
					:key="item.value"
					:label="item.name"
					:value="item.value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="是否贷款">
			<el-select v-model="searchForm.needLoan" placeholder="请选择是否贷款" clearable>
				<el-option
					v-for="item in needLoanOptions"
					:key="item.value"
					:label="item.name"
					:value="item.value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="意向产品">
			<el-select
				v-model="searchForm.intentionProducts"
				placeholder="请选择意向产品"
				multiple
				collapse-tags
				collapse-tags-tooltip
				:max-collapse-tags="3"
				style="width: 400px"
				clearable
			>
				<el-option
					v-for="item in productOptions"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="来源">
			<el-select
				v-model="searchForm.sources"
				placeholder="请选择来源"
				multiple
				collapse-tags
				collapse-tags-tooltip
				:max-collapse-tags="3"
				clearable
			>
				<el-option
					v-for="item in clueSourceOptionsList"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
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
		<el-button
			type="primary"
			:icon="DocumentCopy"
			@click="exportAll"
			v-permission="'customer:export'"
			v-if="customerList.length"
			>全部导出（Excel）</el-button
		>
		<el-button
			type="success"
			:icon="DocumentCopy"
			@click="exportSelected"
			v-permission="'customer:export'"
			v-if="customerList.length"
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
		v-loading="customerListLoading"
		v-if="customerList.length > 0 || customerListLoading"
	>
		<el-table-column type="selection" width="50" fixed="left" />
		<el-table-column type="index" width="50" fixed="left" />
		<el-table-column property="ownerAct" label="负责人" width="150" show-overflow-tooltip />
		<el-table-column
			property="fullName"
			label="姓名"
			width="150"
			:formatter="emptyFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="gender"
			label="性别"
			width="80"
			:formatter="genderFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="phone"
			label="手机"
			width="160"
			:formatter="emptyFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="email"
			label="邮箱"
			width="220"
			:formatter="emptyFormatter"
			show-overflow-tooltip
		/>
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
			:formatter="emptyFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="source"
			label="来源"
			width="180"
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
			width="90"
			:formatter="regionFormatter"
			show-overflow-tooltip
		/>
		<el-table-column fixed="right" label="操作" :width="actionsBarWidth">
			<template #default="scope">
				<el-button
					type="primary"
					size="small"
					@click="showCustomerDetails(scope.row)"
					v-permission="'customer:details'"
					>详情</el-button
				>
			</template>
		</el-table-column>
	</el-table>
	<el-empty
		v-if="customerList.length === 0 && !customerListLoading"
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
		v-if="customerList.length"
	/>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue"
import { useRouter, useRoute } from "vue-router"

import {
	showOwner,
	getOwnerList,
	formatTime,
	messageTip,
	useCalculateActionsBarWidth,
	showRegion,
	getRegion,
	emptyFormatter,
	convertStrArrToNumArr,
} from "@/utils/utils"
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
import { useMarketingStore } from "@/stores/marketingStore"
import { useCustomerStore } from "@/stores/customerStore"

import { Search, MapLocation, DocumentCopy, Refresh } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"
import * as XLSX from "xlsx"
import dayjs from "dayjs"

const productStore = useProductStore()
const marketingStore = useMarketingStore()
const customerStore = useCustomerStore()
const permissionItems = ["customer:details"]
const actionsBarWidth = useCalculateActionsBarWidth(permissionItems)

const router = useRouter()
const route = useRoute()

const searchForm = ref({
	id: null,
	fullName: null,
	gender: null,
	needLoan: null,
	intentionProducts: null,
	sources: null,
	regions: null,
})
const searchFormRef = ref({})
const searchLoading = ref(false)

const rules = {
	// Check whether the input value is a positive integer
	id: [
		{
			validator: (rule, value, callback) => {
				if (value != null && !/^[1-9]\d*$/.test(value)) {
					return callback(new Error("请输入正整数"))
				}
				callback()
			},
			trigger: "blur",
		},
	],
}

// Get the list of owners options
const ownerOptionsList = ref([])
// Get the list of products options
const productOptions = ref([])

// Customer Table instance
const customerTableRef = ref(null)
// Customer list
const customerList = ref([])
const customerListLoading = ref(false)
// Get the list of clue sources options
const clueSourceOptionsList = ref([])

// total number of customers
const total = ref(0)
// Current page number
const currentPage = ref(1)
// Number of items displayed per page
const pageSize = ref(PAGE_SIZE)

// The customer data to be exported
const exportedCustomers = []

// If the user is not a super administrator or super financing staff, only the list of lead/clue source options in the user's region will be displayed.
const getClueSourceOptionList = () => {
	const region = getRegion()
	if (!showRegion.value) {
		clueSourceOptionsList.value = clueSourceOptions.filter(item => item.region.includes(region))
	} else {
		clueSourceOptionsList.value = clueSourceOptions
	}
}

// Search parameters
let params = {
	page: currentPage.value,
	pageSize: pageSize.value,
}
// Check whether the current page path contains query parameters. If so, assign the query parameters to params.
watchEffect(() => {
	if (route.query) {
		params = { ...params, ...route.query }
		// When there are search parameters in the URL, backfill the search form
		if (route.query.id) {
			searchForm.value.id = route.query.id
		}
		if (route.query.owners) {
			const ownerArr = route.query.owners.split(",")
			searchForm.value.owners = convertStrArrToNumArr(ownerArr)
		}
		if (route.query.fullName) {
			searchForm.value.fullName = route.query.fullName
		}
		if (route.query.gender) {
			searchForm.value.gender = Number(route.query.gender)
		}
		if (route.query.needLoan) {
			searchForm.value.needLoan = Number(route.query.needLoan)
		}
		if (route.query.intentionProducts) {
			const productArr = route.query.intentionProducts.split(",")
			searchForm.value.intentionProducts = convertStrArrToNumArr(productArr)
		}
		if (route.query.sources) {
			const sourceArr = route.query.sources.split(",")
			searchForm.value.sources = convertStrArrToNumArr(sourceArr)
		}
		if (route.query.regions) {
			const regionArr = route.query.regions.split(",")
			searchForm.value.regions = convertStrArrToNumArr(regionArr)
		}
	}
})
// Get the list of customers
const getCustomerList = async params => {
	customerListLoading.value = true
	const res = await api.getCustomerList(params)
	customerListLoading.value = false
	if (res?.code === 200) {
		customerList.value = res.data.rows
		total.value = res.data.total
	}
}

const handleCurrentChange = val => {
	currentPage.value = val
	params.page = currentPage.value
	router.replace({
		// Only add attributes whose value in params is not null to the query object.
		query: Object.fromEntries(Object.entries(params).filter(([key, value]) => value !== null)),
	})
	getCustomerList(params)
}

// Gender formatter
const genderFormatter = (row, column, cellValue, index) => {
	if (!cellValue) return "--"
	return cellValue === 1 ? "男" : "女"
}

// Whether the loan is needed
const needLoanFormatter = (row, column, cellValue, index) => {
	if (!cellValue) return "--"
	return cellValue === 1 ? "需要" : "不需要"
}

// Clue source formatter
const sourceFormatter = (row, column, cellValue, index) => {
	if (!cellValue) return "--"
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
	// Get the list of users who can be selected as the owner of the clues
	getOwnerList()
	// Get the list of products
	getProductOptionList()
	getClueSourceOptionList()
})

const handleSelectionChange = selectedCustomers => {
	exportedCustomers.length = 0
	selectedCustomers.forEach(item => {
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
	switch (gender) {
		case 1:
			return "男性"
		case 2:
			return "女性"
		default:
			return "--"
	}
}

const mapNeedLoan = needLoan => {
	switch (needLoan) {
		case 0:
			return "不需要"
		case 1:
			return "需要"
		default:
			return "--"
	}
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

// Get owner options list from Pinia
watchEffect(() => {
	ownerOptionsList.value = marketingStore.ownerOptions
})

// Get product options
const getProductOptionList = async () => {
	const res = await api.getProductOptionList()
	productOptions.value = res.data
	productStore.setProductOptions(res.data)
}

const search = () => {
	searchFormRef.value.validate(async valid => {
		if (!valid) return
		// Reset the current page number to 1
		currentPage.value = 1
		// Update the parameters
		params.page = currentPage.value
		params.id = searchForm.value.id
		params.owners =
			searchForm.value.owners && searchForm.value.owners.length
				? searchForm.value.owners.join(",")
				: null
		params.fullName = searchForm.value.fullName
		params.gender = searchForm.value.gender
		params.needLoan = searchForm.value.needLoan
		params.intentionProducts =
			searchForm.value.intentionProducts && searchForm.value.intentionProducts.length
				? searchForm.value.intentionProducts.join(",")
				: null
		params.sources =
			searchForm.value.sources && searchForm.value.sources.length
				? searchForm.value.sources.join(",")
				: null
		params.regions =
			searchForm.value.regions && searchForm.value.regions.length
				? searchForm.value.regions.join(",")
				: null
		// Get the current page path and add params to the url
		const currentPath = route.path
		router.push({
			path: currentPath,
			// Do not add attributes with null value to the query object
			query: Object.fromEntries(
				Object.entries(params).filter(([key, value]) => value !== null)
			),
		})
		searchLoading.value = true
		await getCustomerList(params)
		searchLoading.value = false
	})
}

const reset = () => {
	searchForm.value.id = null
	searchForm.value.owners = null
	searchForm.value.fullName = null
	searchForm.value.gender = null
	searchForm.value.needLoan = null
	searchForm.value.intentionProducts = null
	searchForm.value.sources = null
	searchForm.value.regions = null
}

const showCustomerDetails = row => {
	customerStore.setSelectedCustomer(row)
	router.push({ name: "customer-details", params: { id: row.id } })
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
	margin: 20px 0;
}

.el-pagination {
	margin-top: 20px;
}
</style>
