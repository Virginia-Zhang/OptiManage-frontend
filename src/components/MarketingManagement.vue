<!-- 市场活动组件 -->
<template>
	<!-- 搜索框表单，包含负责人、活动名称、活动时间（开始时间-结束时间）、活动预算、地区这些搜索条件，还有搜索和重置按钮，请使用el-form来写 -->
	<el-form :inline="true" :model="searchForm" class="demo-form-inline">
		<el-form-item label="负责人">
			<el-input v-model="searchForm.owner" placeholder="请输入负责人" />
		</el-form-item>
		<el-form-item label="活动名称">
			<el-input v-model="searchForm.name" placeholder="请输入活动名称" />
		</el-form-item>
		<!-- 一个datetime选择组件，包含开始时间和结束时间，请使用el-date-picker来写，type为datetimerange -->
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
		<!-- 活动预算显示为一个select下拉菜单，options是不同预算范围的数组，请使用el-select来写，请使用v-model绑定到searchForm.budget上 -->
		<el-form-item label="活动预算">
			<el-select v-model="searchForm.budget" placeholder="请选择活动预算" width="200px">
				<el-option v-for="item in budgetOptions" :key="item" :label="item" :value="item" />
			</el-select>
			<!-- 货币单位，要和左边有间隙 -->
			<span style="margin-left: 5px">元</span>
		</el-form-item>
		<el-form-item label="地区">
			<!-- 一个select下拉菜单，options是不同地区的数组，请使用el-select来写，请使用v-model绑定到searchForm.region上 -->
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
	<!-- 表格区域，展示市场活动列表 -->
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
		<el-table-column property="ownerName" label="负责人" width="150" show-overflow-tooltip />
		<el-table-column property="name" label="活动名称" width="180" show-overflow-tooltip />
		<el-table-column property="startTime" label="开始时间" width="180" show-overflow-tooltip />
		<el-table-column property="endTime" label="结束时间" width="220" show-overflow-tooltip />
		<el-table-column property="cost" label="活动预算（元）" width="150" show-overflow-tooltip />
		<el-table-column
			property="region"
			label="地区"
			width="120"
			:formatter="regionFormatter"
			show-overflow-tooltip
		/>
		<el-table-column property="createTime" label="创建时间" width="180" show-overflow-tooltip />
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
import { budgetRangeRMB, budgetRangeUSD, budgetRangeJPY, PAGE_SIZE } from "../constants/constants"
import { getPreferredLanguage } from "@/utils/utils"

import { Search, Refresh, MapLocation, Plus, Delete } from "@element-plus/icons-vue"

// computed属性，根据storage里存储的preferredLanguage，显示不同的选项
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

// 搜索表单数据
const searchForm = ref({
	owner: "",
	name: "",
	timeRange: "",
	budget: "",
	region: 1,
})

// 市场活动列表数据
// TODO: cost要改，从后端拿到marketingList后，需要对list做加工，给每个item添加cost属性，值为costRMB/costUSD/costJPY，具体是什么根据preferredLanguage而定
const marketingList = ref([
	{
		id: 1,
		ownerId: 1,
		ownerName: "管理员",
		name: "活动1",
		startTime: "2023-04-01 10:00:00",
		endTime: "2023-04-05 12:00:00",
		costRMB: 100,
		costUSD: null,
		costJPY: null,
		region: 1,
		createTime: "2023-04-01 10:00:00",
	},
	{
		id: 2,
		ownerId: 2,
		ownerName: "用户1",
		name: "活动2",
		startTime: "2023-04-06 10:00:00",
		endTime: "2023-04-07 12:00:00",
		costRMB: 200,
		costUSD: null,
		costJPY: null,
		region: 2,
		createTime: "2023-04-06 10:00:00",
	},
])

// 市场活动总数
const total = ref(0)
// 当前页码
const currentPage = ref(1)
// 每页显示条数
const pageSize = ref(PAGE_SIZE)

// 对marketingList进行加工，给每一个item添加cost属性，值为costRMB/costUSD/costJPY，具体是什么根据preferredLanguage而定
const getMarketingList = () => {
	const preferredLanguage = getPreferredLanguage()
	switch (preferredLanguage) {
		case 1:
			marketingList.value.forEach(item => {
				item.cost = item.costUSD
			})
			break
		case 2:
			marketingList.value.forEach(item => {
				item.cost = item.costRMB
			})
			break
		case 3:
			marketingList.value.forEach(item => {
				item.cost = item.costJPY
			})
	}
}

onMounted(() => {
	getMarketingList()
})

const handleCurrentChange = val => {
	currentPage.value = val
}

// 添加市场活动
const addMarketing = () => {
	console.log("addMarketing")
}

// 查看市场活动详情
const showMarketingDetails = row => {
	console.log("showMarketingDetails", row)
}

// 编辑市场活动
const showEditMarketing = row => {
	console.log("showEditMarketing", row)
}

const handleSelectionChange = val => {
	console.log("handleSelectionChange", val)
}

// 删除市场活动
const deleteMarketings = ids => {
	console.log("deleteMarketings", ids)
}

// 批量删除市场活动
const batchDelete = () => {
	console.log("batchDelete")
}

// 地区格式化
const regionFormatter = (row, column, cellValue, index) => {
	const region = regionData.find(item => item.value === cellValue)
	return region ? region.name : "未知地区"
}

const search = () => {
	console.log("search", searchForm.value)
}

const reset = () => {
	searchForm.value = {
		owner: "",
		name: "",
		timeRange: "",
		budget: "",
		region: 1,
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
