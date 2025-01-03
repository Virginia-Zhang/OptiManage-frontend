<!-- Marketing Campaigns/Activities component -->
<template>
	<!-- Search form -->
	<el-form :inline="true" :model="searchForm" class="demo-form-inline">
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
		<el-form-item label="活动名称">
			<el-input v-model="searchForm.name" placeholder="请输入活动名称" clearable />
		</el-form-item>
		<el-form-item label="活动时间">
			<el-date-picker
				v-model="searchForm.timeRange"
				type="datetimerange"
				start-placeholder="开始时间"
				end-placeholder="结束时间"
				format="YYYY-MM-DD HH:mm:ss"
				date-format="YYYY/MM/DD ddd"
				time-format="A hh:mm:ss"
			/>
		</el-form-item>
		<el-form-item label="活动预算">
			<el-select
				v-model="searchForm.budget"
				placeholder="请选择活动预算"
				@clear="searchForm.currencyUnit = null"
				clearable
			>
				<template #prefix>
					<el-icon><Coin /></el-icon>
				</template>
				<el-option v-for="item in budgetOptions" :key="item" :label="item" :value="item" />
			</el-select>
			<!-- Currency unit is also a drop-down menu with three options: USD, RMB, and JPY. When the option changes, clear the value in the budget box. -->
			<el-select
				v-model="searchForm.currencyUnit"
				placeholder="请选择货币单位"
				@change="() => (searchForm.budget = null)"
				clearable
				v-if="showRegion"
			>
				<el-option label="USD" value="USD" />
				<el-option label="RMB" value="RMB" />
				<el-option label="JPY" value="JPY" />
			</el-select>
			<!-- Show currency unit here when the user is neither a super admin nor a super financing staff -->
			<span style="margin-left: 10px">{{ currencyUnit }}</span>
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
		<el-button type="primary" :icon="Plus" @click="addMarketing" v-permission="'activity:add'"
			>录入市场活动</el-button
		>
		<el-button
			type="danger"
			:icon="Delete"
			@click="batchDelete"
			v-permission="'activity:delete'"
			v-if="marketingList.length"
			>批量删除</el-button
		>
		<el-button
			type="success"
			:icon="DocumentCopy"
			@click="exportAll"
			v-permission="'activity:export'"
			v-if="marketingList.length"
			>全部导出（Excel）</el-button
		>
		<el-button
			type="info"
			:icon="DocumentCopy"
			@click="exportSelected"
			v-permission="'activity:export'"
			v-if="marketingList.length"
			>选择导出（Excel）</el-button
		>
	</div>
	<!-- Table area to display the list of marketing campaigns -->
	<el-table
		ref="marketingTableRef"
		:data="marketingList"
		:border="true"
		stripe
		style="width: 100%"
		@selection-change="handleSelectionChange"
		v-loading="marketingListLoading"
		v-if="marketingList.length > 0 || marketingListLoading"
	>
		<el-table-column type="selection" width="50" fixed="left" />
		<el-table-column type="index" width="50" fixed="left" />
		<el-table-column property="ownerAct" label="负责人" width="150" show-overflow-tooltip />
		<el-table-column property="name" label="活动名称" width="250" show-overflow-tooltip />
		<el-table-column
			property="startTime"
			label="开始时间"
			width="180"
			:formatter="timeFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="endTime"
			label="结束时间"
			width="180"
			:formatter="timeFormatter"
			show-overflow-tooltip
		/>
		<el-table-column property="cost" label="活动预算" width="100" show-overflow-tooltip />
		<el-table-column
			property="currencyUnit"
			label="货币单位"
			width="90"
			show-overflow-tooltip
		/>
		<el-table-column
			property="region"
			label="地区"
			width="80"
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
		<el-table-column fixed="right" label="操作" :width="actionsBarWidth">
			<template #default="scope">
				<el-button
					type="primary"
					size="small"
					@click="showMarketingDetails(scope.row)"
					v-permission="'activity:details'"
					>详情</el-button
				>
				<el-button
					type="success"
					size="small"
					@click="showEditMarketing(scope.row)"
					v-permission="'activity:edit'"
					>编辑</el-button
				>
				<el-button
					type="danger"
					size="small"
					@click="deleteMarketings([scope.row.id])"
					v-permission="'activity:delete'"
					>删除</el-button
				>
			</template>
		</el-table-column>
	</el-table>
	<el-empty
		v-if="marketingList.length === 0 && !marketingListLoading"
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
		v-if="marketingList.length"
	/>
	<!-- AddMarketing component -->
	<AddMarketing
		ref="addMarketingRef"
		:ownerOptions="ownerOptionsList"
		@getMarketingList="getMarketingList"
	/>
	<!-- EditMarketing component -->
	<EditMarketing
		ref="editMarketingRef"
		:ownerOptions="ownerOptionsList"
		:activity="activity"
		@getMarketingList="getMarketingList"
	/>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from "vue"
import { useRouter, useRoute } from "vue-router"

import {
	budgetRangeRMB,
	budgetRangeUSD,
	budgetRangeJPY,
	PAGE_SIZE,
	regionData,
	activityExcelHeaders,
} from "@/constants/constants"
import {
	showOwner,
	formatTime,
	parseTime,
	messageTip,
	getOwnerList,
	useCalculateActionsBarWidth,
	showRegion,
	getRegion,
	convertStrArrToNumArr,
} from "@/utils/utils"
import api from "@/http/api"
import AddMarketing from "@/components/marketing/AddMarketing.vue"
import EditMarketing from "@/components/marketing/EditMarketing.vue"
import { useMarketingStore } from "@/stores/marketingStore"

import {
	Search,
	Refresh,
	MapLocation,
	Plus,
	Delete,
	Coin,
	DocumentCopy,
} from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"
import * as XLSX from "xlsx"
import dayjs from "dayjs"

const router = useRouter()
const route = useRoute()
const marketingStore = useMarketingStore()
const permissionItems = ["activity:details", "activity:edit", "activity:delete"]
// Calculate the width of the actions bar
const actionsBarWidth = useCalculateActionsBarWidth(permissionItems)

// SearchForm data
const searchForm = ref({
	name: null,
	timeRange: [],
	budget: null,
	currencyUnit: null,
	regions: null,
})
const searchLoading = ref(false)

// A computed attribute, displays different options based on the currency unit selected by the user.
const budgetOptions = computed(() => {
	switch (searchForm.value.currencyUnit) {
		case "USD":
			return budgetRangeUSD
		case "RMB":
			return budgetRangeRMB
		case "JPY":
			return budgetRangeJPY
		default:
			return []
	}
})

// Get the list of owners options
const ownerOptionsList = ref([])

// Get owner options list from Pinia
watchEffect(() => {
	ownerOptionsList.value = marketingStore.ownerOptions
})

// Marketing campaigns list data
const marketingList = ref([])
const marketingListLoading = ref(false)
// Marketing table instance
const marketingTableRef = ref(null)

// total number of campaigns
const total = ref(0)
// Current page number
const currentPage = ref(1)
// Number of items displayed per page
const pageSize = ref(PAGE_SIZE)

// AddMarketing component instance
const addMarketingRef = ref(null)
// EditMarketing component instance
const editMarketingRef = ref(null)

// Marketing activity data passed to the child component
const activity = ref({})

// The ids of the activities to be deleted
const deletedIds = []
// The list of activities to be exported
const exportedActivities = []

// Currency unit of the activity budget
const currencyUnit = ref("")

// If the user is not a super administrator or super financing staff, assign a value to the currencyUnit field in the search form based on the user's region.
const assignValueToCurrencyUnit = () => {
	if (!showRegion.value) {
		const userRegion = getRegion()
		// Find currency unit corresponding to the user's region in regionData and assign it to the currency unit field in the search form
		searchForm.value.currencyUnit = currencyUnit.value = regionData.find(
			item => item.id === userRegion
		).currencyUnit
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
		if (route.query.ownerIds) {
			const ownerArr = route.query.ownerIds.split(",")
			searchForm.value.owners = convertStrArrToNumArr(ownerArr)
		}
		if (route.query.name) {
			searchForm.value.name = route.query.name
		}
		if (route.query.startTime && route.query.endTime) {
			searchForm.value.timeRange = [
				parseTime(route.query.startTime),
				parseTime(route.query.endTime),
			]
		}
		if (route.query.startCost && route.query.endCost) {
			// Convert startCost and endCost to numeric types, and add a comma separator every 3 digits starting from the end of the number.
			const start = Number(route.query.startCost).toLocaleString("en-US")
			const end = Number(route.query.endCost).toLocaleString("en-US")
			// Concat budget
			searchForm.value.budget = `${start}-${end}`
		}
		if (route.query.startCost && !route.query.endCost) {
			searchForm.value.budget = `${Number(route.query.startCost).toLocaleString("en-US")}+`
		}
		if (route.query.currencyUnit) {
			searchForm.value.currencyUnit = route.query.currencyUnit
		}
		if (route.query.regions) {
			const regionArr = route.query.regions.split(",")
			searchForm.value.regions = convertStrArrToNumArr(regionArr)
		}
	}
})

// Get the list of marketing campaigns
const getMarketingList = async (data = params) => {
	marketingListLoading.value = true
	const res = await api.getActivityList(data)
	marketingListLoading.value = false
	if (res?.code === 200) {
		marketingList.value = res.data.rows
		total.value = res.data.total
	}
}

onMounted(() => {
	getMarketingList()
	getOwnerList()
	assignValueToCurrencyUnit()
})

const handleCurrentChange = val => {
	currentPage.value = val
	params.page = currentPage.value
	router.replace({
		// Only add attributes whose value in params is not null to the query object.
		query: Object.fromEntries(Object.entries(params).filter(([key, value]) => value !== null)),
	})
	getMarketingList()
}

// Add campaign
const addMarketing = () => {
	if (!addMarketingRef.value) return
	// Show AddMarketing component
	addMarketingRef.value.showAddMarketingDialog()
}

// View campaign details
const showMarketingDetails = row => {
	// Save selected marketing activity data to pinia
	marketingStore.setSelectedMarketingActivity(row)
	// Jump to the marketing activity details page, and carry the activity ID in the route
	router.push({ name: "marketing-details", params: { id: row.id } })
}

// Edit campaign
const showEditMarketing = row => {
	if (!editMarketingRef.value) return
	activity.value = row
	editMarketingRef.value.showEditMarketingDialog()
}

const handleSelectionChange = selectedActivities => {
	deletedIds.length = 0
	exportedActivities.length = 0
	selectedActivities.forEach(item => {
		deletedIds.push(item.id)
		exportedActivities.push(item)
	})
}

// Delete marketing campaigns
const deleteMarketings = ids => {
	ElMessageBox.confirm("确定要删除吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			const data = {
				ids,
				isDeletedValue: 1,
			}
			const res = await api.updateActivities(data)
			if (res?.code === 200) {
				messageTip("success", "删除成功!")
				currentPage.value = 1
				params.page = currentPage.value
				getMarketingList(params)
			} else {
				messageTip("error", "删除失败!请重试！")
			}
		})
		.catch(() => {
			// Click Cancel to clear the selected activity array
			deletedIds.length = 0
			marketingTableRef.value.clearSelection()
		})
}

// Delete campaigns in bulk
const batchDelete = () => {
	if (!deletedIds.length) return messageTip("warning", "请选择市场活动！")
	deleteMarketings(deletedIds)
}

// region formatting
const regionFormatter = (row, column, cellValue, index) => {
	const region = regionData.find(item => item.id === cellValue)
	return region ? region.name : "未知地区"
}

// Format time
const timeFormatter = (row, column, cellValue, index) => {
	return formatTime(cellValue)
}

const search = async () => {
	// Clear the searching parameters last time
	currentPage.value = 1
	params = {
		page: currentPage.value,
		pageSize: pageSize.value,
	}
	// Piece together the searching parameters for this time
	params = {
		...params,
		// Convert owners into a string and put it into queryString
		ownerIds:
			searchForm.value.owners && searchForm.value.owners.length
				? searchForm.value.owners.join(",")
				: null,
		name: searchForm.value.name,
		// Convert regions into a string and put it into queryString
		regions:
			searchForm.value.regions && searchForm.value.regions.length
				? searchForm.value.regions.join(",")
				: null,
		currencyUnit: searchForm.value.currencyUnit,
	}
	// If the user selects activity time, process form.value.timeRange, split it into start time and end time, and convert them into date strings
	if (searchForm.value.timeRange?.length) {
		params.startTime = formatTime(searchForm.value.timeRange[0])
		params.endTime = formatTime(searchForm.value.timeRange[1])
	}
	// If the user selects activity budget and currency, process form.value.budget and split it into start cost and end cost.
	if (searchForm.value.budget && searchForm.value.currencyUnit) {
		let startCost
		let endCost
		// If budget is in "number-number" format ("5001-10000"), split it into startCost and endCost.
		if (searchForm.value.budget.includes("-")) {
			startCost = searchForm.value.budget.split("-")[0]
			endCost = searchForm.value.budget.split("-")[1]
		} else {
			// If the budget is in the "number+" format ("1000000+"), remove the + at the end of the string, and then the remaining part is the start cost, without endCost.
			startCost = searchForm.value.budget.slice(0, -1)
		}
		// Remove the "," in the startCost and endCost strings and convert them into numbers
		startCost = Number(startCost.replaceAll(",", ""))
		endCost = endCost ? Number(endCost.replaceAll(",", "")) : null
		params.startCost = startCost
		params.endCost = endCost
	} else if (!searchForm.value.budget || !searchForm.value.currencyUnit) {
		// If the user does not select the budget or currencyUnit, set the startCost, endCost and currencyUnit to null
		params.startCost = null
		params.endCost = null
		params.currencyUnit = null
	}
	// Get the current page path and add params to the url
	const currentPath = route.path
	router.push({
		path: currentPath,
		// Do not add attributes with null value to the query object
		query: Object.fromEntries(Object.entries(params).filter(([key, value]) => value !== null)),
	})
	searchLoading.value = true
	await getMarketingList(params)
	searchLoading.value = false
}

const reset = () => {
	searchForm.value.owners = null
	searchForm.value.name = null
	searchForm.value.regions = null
	searchForm.value.currencyUnit = null
	searchForm.value.timeRange = []
	searchForm.value.budget = null
}

const mapRegion = regionId => {
	const region = regionData.find(r => r.id === regionId)
	return region ? region.name : "--"
}

// Export incoming activity data to excel
const exportExcel = activityData => {
	// Dynamically generate formatted data
	const formattedData = activityData.map(item => {
		const formattedItem = {}

		// Traverse the mapped fields and map the actual data fields to the header names
		activityExcelHeaders.forEach(field => {
			const key = field.key
			let value = item[key]

			// Perform value conversions for specific fields
			switch (key) {
				case "region":
					value = mapRegion(value) // Map region
					break
				case "createTime":
				case "editTime":
					value = formatTime(value)
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
	XLSX.utils.book_append_sheet(wb, ws, "Marketing Campaign Data")

	// Use dayjs to get the current date and format the file name
	const fileName = `Marketing Campaign Data ${dayjs().format("YYYYMMDD")}.xlsx`

	// Export Excel file
	XLSX.writeFile(wb, fileName)
}

// Export all activity data
const exportAll = async () => {
	// A confirmation box pops up, asking the user to confirm exporting all activity data.
	ElMessageBox.confirm("确认导出全部市场活动数据吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		// Query all activity data without pagination
		const result = await api.getActivityListWithoutPagination()
		// Export data to excel
		if (result.code == 200 && result.data?.length > 0) {
			exportExcel(result.data)
		}
	})
}

// Export selected activity data
const exportSelected = () => {
	// If no data is selected, a pop-up window shows to prompt the user
	if (exportedActivities.length === 0) {
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
			exportExcel(exportedActivities)
			// Clear the selected activities array
			exportedActivities.length = 0
			marketingTableRef.value.clearSelection()
		})
		.catch(() => {
			// Click Cancel to clear the selected activities array
			exportedActivities.length = 0
			marketingTableRef.value.clearSelection()
		})
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
