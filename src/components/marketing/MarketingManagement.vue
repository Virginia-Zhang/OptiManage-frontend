<!-- campaign component -->
<template>
	<!-- Search form -->
	<el-form :inline="true" :model="searchForm" class="demo-form-inline">
		<el-form-item label="负责人" v-if="showOwnerSearch">
			<el-input v-model="searchForm.owner" placeholder="请输入负责人" />
		</el-form-item>
		<el-form-item label="活动名称">
			<el-input v-model="searchForm.name" placeholder="请输入活动名称" />
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
			<el-select v-model="searchForm.budget" placeholder="请选择活动预算" width="200px">
				<el-option v-for="item in budgetOptions" :key="item" :label="item" :value="item" />
			</el-select>
			<!-- Currency unit -->
			<span style="margin-left: 5px">元</span>
		</el-form-item>
		<el-form-item label="地区">
			<el-select v-model="searchForm.region" placeholder="请选择地区" clearable width="120px">
				<template #prefix>
					<el-icon><MapLocation /></el-icon>
				</template>
				<el-option
					v-for="item in regionData"
					:key="item.value"
					:label="item.name"
					:value="item.value"
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
		<el-table-column property="cost" label="活动预算（元）" width="150" show-overflow-tooltip />
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
</template>

<script setup>
import { computed, onMounted, ref } from "vue"

import { regionData } from "@/constants/constants"
import { budgetRangeRMB, budgetRangeUSD, budgetRangeJPY, PAGE_SIZE } from "@/constants/constants"
import { getPreferredLanguage, getRoleList, formatTime } from "@/utils/utils"
import api from "@/http/api"

import { Search, Refresh, MapLocation, Plus, Delete } from "@element-plus/icons-vue"

// A computed attribute, controls whether the person in charge search box is displayed or not. If the user is admin, returns true, otherwise returns false.
const showOwnerSearch = computed(() => {
	const roleList = getRoleList()
	return roleList.indexOf("admin") !== -1
})

// A computed attribute, displays different options based on the preferred language stored in storage.
const budgetOptions = computed(() => {
	const preferredLanguage = getPreferredLanguage()
	switch (preferredLanguage) {
		case 1:
			return budgetRangeUSD
		case 2:
			return budgetRangeRMB
		case 3:
			return budgetRangeJPY
		default:
			return budgetRangeUSD
	}
})

// SearchForm data
const searchForm = ref({
	name: "",
	timeRange: "",
	budget: "",
	region: 1,
})

// Marketing campaigns list data
const marketingList = ref([])

// total number of campaigns
const total = ref(0)
// Current page number
const currentPage = ref(1)
// Number of items displayed per page
const pageSize = ref(PAGE_SIZE)

// Get the list of marketing campaigns
const getMarketingList = async () => {
	const params = {
		page: currentPage.value,
		size: pageSize.value,
	}
	const res = await api.getActivityList(params)
	if (res.code === 200) {
		marketingList.value = res.data.rows
		total.value = res.data.total
		// Process marketingList and add the cost attribute to each item. The value is costRMB/costUSD/costJPY. The specific value depends on preferredLanguage.
		const preferredLanguage = getPreferredLanguage()
		switch (preferredLanguage) {
			case 1:
				marketingList.value.forEach(item => {
					item.cost = item.costUsd
				})
				break
			case 2:
				marketingList.value.forEach(item => {
					item.cost = item.costRmb
				})
				break
			case 3:
				marketingList.value.forEach(item => {
					item.cost = item.costJpy
				})
		}
		console.log("marketingList: ", marketingList.value)
	}
}

onMounted(() => {
	getMarketingList()
})

const handleCurrentChange = val => {
	currentPage.value = val
	getMarketingList()
}

// Add campaign
const addMarketing = () => {
	console.log("addMarketing")
}

// View campaign details
const showMarketingDetails = row => {
	console.log("showMarketingDetails", row)
}

// Edit campaign
const showEditMarketing = row => {
	console.log("showEditMarketing", row)
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
	const region = regionData.find(item => item.value === cellValue)
	return region ? region.name : "未知地区"
}

// Format time
const timeFormatter = (row, column, cellValue, index) => {
	return formatTime(cellValue)
}

const search = () => {
	console.log("search", searchForm.value)
}

const reset = () => {
	if (showOwnerSearch.value) {
		searchForm.value = {
			owner: "",
			name: "",
			timeRange: "",
			budget: "",
			region: 1,
		}
	} else {
		searchForm.value = {
			name: "",
			timeRange: "",
			budget: "",
			region: 1,
		}
	}
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
