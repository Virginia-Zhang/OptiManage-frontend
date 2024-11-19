<!-- campaign component -->
<template>
	<!-- Search form -->
	<el-form :inline="true" :model="searchForm" class="demo-form-inline">
		<el-form-item label="负责人" v-if="showOwnerSearch">
			<el-select
				v-model="searchForm.owners"
				placeholder="请选择负责人"
				width="200px"
				multiple
				collapse-tags
				collapse-tags-tooltip
				:max-collapse-tags="3"
				clearable
			>
				<el-option
					v-for="item in ownerOptions"
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
				width="200px"
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
				width="10px"
				@change="() => (searchForm.budget = null)"
				clearable
			>
				<el-option label="USD" value="USD" />
				<el-option label="RMB" value="RMB" />
				<el-option label="JPY" value="JPY" />
			</el-select>
		</el-form-item>
		<el-form-item label="地区">
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
			<el-button type="primary" :icon="Search" @click="search">搜索</el-button>
			<el-button :icon="Refresh" @click="reset">重置</el-button>
		</el-form-item>
	</el-form>
	<div class="btn-group">
		<el-button type="primary" :icon="Plus" @click="addMarketing">录入市场活动</el-button>
		<el-button type="danger" :icon="Delete" @click="batchDelete">批量删除</el-button>
	</div>
	<!-- Table area to display the list of marketing campaigns -->
	<el-table
		ref="marketingTableRef"
		:data="marketingList"
		:border="true"
		stripe
		style="width: 100%"
		@selection-change="handleSelectionChange"
	>
		<el-table-column type="selection" width="55" fixed="left" />
		<el-table-column type="index" width="60" fixed="left" />
		<el-table-column property="ownerAct" label="负责人" width="150" show-overflow-tooltip />
		<el-table-column property="name" label="活动名称" width="180" show-overflow-tooltip />
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
			width="220"
			:formatter="timeFormatter"
			show-overflow-tooltip
		/>
		<el-table-column property="cost" label="活动预算" width="100" show-overflow-tooltip />
		<el-table-column
			property="currencyUnit"
			label="货币单位"
			width="100"
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
			property="createTime"
			label="创建时间"
			width="180"
			:formatter="timeFormatter"
			show-overflow-tooltip
		/>
		<el-table-column fixed="right" label="操作" min-width="210">
			<template #default="scope">
				<el-button type="primary" size="small" @click="showMarketingDetails(scope.row)"
					>详情</el-button
				>
				<el-button type="success" size="small" @click="showEditMarketing(scope.row)"
					>编辑</el-button
				>
				<el-button type="danger" size="small" @click="deleteMarketings([scope.row.id])"
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
	<!-- AddMarketing component -->
	<AddMarketing
		ref="addMarketingRef"
		:ownerOptions="ownerOptions"
		@getMarketingList="getMarketingList"
	/>
	<!-- EditMarketing component -->
	<EditMarketing
		ref="editMarketingRef"
		:ownerOptions="ownerOptions"
		:activity="activity"
		@getMarketingList="getMarketingList"
	/>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"

import {
	budgetRangeRMB,
	budgetRangeUSD,
	budgetRangeJPY,
	PAGE_SIZE,
	regionData,
} from "@/constants/constants"
import { getRoleList, formatTime, messageTip } from "@/utils/utils"
import api from "@/http/api"
import AddMarketing from "@/components/marketing/AddMarketing.vue"
import EditMarketing from "@/components/marketing/EditMarketing.vue"
import { Search, Refresh, MapLocation, Plus, Delete, Coin } from "@element-plus/icons-vue"
import { useMarketingStore } from "@/stores/marketingStore"

const marketingStore = useMarketingStore()

// SearchForm data
const searchForm = ref({
	name: null,
	timeRange: [],
	budget: null,
	currencyUnit: null,
	regions: null,
})

// A computed attribute, controls whether the person in charge search box is displayed or not. If the user is admin, returns true, otherwise returns false.
const showOwnerSearch = computed(() => {
	const roleList = getRoleList()
	return roleList.indexOf("admin") !== -1
})

// Get the list of users who can be selected as the owner of the activity
const ownerOptions = ref([])

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

// Marketing campaigns list data
const marketingList = ref([])

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

// Search parameters
let params = {
	page: currentPage.value,
	pageSize: pageSize.value,
}
// Get the list of marketing campaigns
const getMarketingList = async params => {
	const res = await api.getActivityList(params)
	if (res.code === 200) {
		marketingList.value = res.data.rows
		total.value = res.data.total
	}
}

// Get ownerList and assign it to ownerOptions.value
const getOwnerList = async () => {
	const res = await api.getOwnerList()
	if (res.code === 200) {
		ownerOptions.value = res.data
	}
}

onMounted(() => {
	getMarketingList(params)
	getOwnerList()
})

const handleCurrentChange = val => {
	currentPage.value = val
	params.page = currentPage.value
	getMarketingList(params)
}

// Add campaign
const addMarketing = () => {
	if (!addMarketingRef.value) return
	// Show AddMarketing component
	addMarketingRef.value.showAddMarketingDialog()
}

// View campaign details
const showMarketingDetails = row => {
	console.log("showMarketingDetails", row)
	// Save selected marketing activity data to pinia
	marketingStore.setSelectedMarketingActivity(row)
}

// Edit campaign
const showEditMarketing = row => {
	if (!editMarketingRef.value) return
	activity.value = row
	editMarketingRef.value.showEditMarketingDialog()
}

const handleSelectionChange = val => {
	console.log("handleSelectionChange", val)
}

// Delete campaign
const deleteMarketings = ids => {
	console.log("deleteMarketings", ids)
}

// Delete campaigns in bulk
const batchDelete = () => {
	console.log("batchDelete")
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

const search = () => {
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
	} else if (searchForm.value.budget && !searchForm.value.currencyUnit) {
		// If the user only selects the budget, but not the currencyUnit, then the budget is invalid.
		messageTip("warning", "请选择货币单位，或清空活动预算！")
		return
	} else if (!searchForm.value.budget && searchForm.value.currencyUnit) {
		// If the user only selects the currencyUnit, but not the budget, then the budget is invalid.
		messageTip("warning", "请选择活动预算，或清空货币单位！")
		return
	}
	getMarketingList(params)
}

const reset = () => {
	searchForm.value = {}
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
