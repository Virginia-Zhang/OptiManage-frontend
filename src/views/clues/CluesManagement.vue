<!-- Marketing lead/clue management page -->
<template>
	<!-- Search form -->
	<el-form :inline="true" :model="searchForm" class="demo-form-inline">
		<el-form-item label="负责人" v-if="showOwnerSearch">
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
		<el-form-item label="所属活动">
			<el-select
				v-model="searchForm.activities"
				placeholder="请选择所属活动"
				multiple
				collapse-tags
				collapse-tags-tooltip
				:max-collapse-tags="3"
				style="width: 400px"
				clearable
			>
				<el-option
					v-for="item in activityOptions"
					:key="item.id"
					:label="item.name"
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
		<el-form-item label="意向状态">
			<el-select v-model="searchForm.intentionState" placeholder="请选择意向状态" clearable>
				<el-option
					v-for="item in intentionStateOptions"
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
		<el-form-item label="线索状态">
			<el-select
				v-model="searchForm.states"
				placeholder="请选择线索状态"
				multiple
				collapse-tags
				collapse-tags-tooltip
				:max-collapse-tags="3"
				clearable
			>
				<el-option
					v-for="item in clueStateOptions"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="线索来源">
			<el-select
				v-model="searchForm.sources"
				placeholder="请选择线索来源"
				multiple
				collapse-tags
				collapse-tags-tooltip
				:max-collapse-tags="3"
				clearable
			>
				<el-option
					v-for="item in clueSourceOptions"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
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
		<el-button type="primary" :icon="Plus" @click="addClue">录入线索</el-button>
		<el-button type="danger" :icon="Delete" @click="batchDelete">批量删除</el-button>
	</div>
	<!-- Table area to display the list of marketing clues -->
	<el-table
		ref="clueTableRef"
		:data="clueList"
		:border="true"
		stripe
		style="width: 100%"
		@selection-change="handleSelectionChange"
	>
		<el-table-column type="selection" width="55" fixed="left" />
		<el-table-column type="index" width="60" fixed="left" />
		<el-table-column property="ownerAct" label="负责人" width="150" show-overflow-tooltip />
		<el-table-column
			property="activityName"
			label="所属活动"
			width="260"
			show-overflow-tooltip
		/>
		<el-table-column property="fullName" label="姓名" width="150" show-overflow-tooltip />
		<el-table-column
			property="gender"
			label="性别"
			width="100"
			:formatter="genderFormatter"
			show-overflow-tooltip
		/>
		<el-table-column property="phone" label="手机" width="180" show-overflow-tooltip />
		<el-table-column property="email" label="邮箱" width="220" show-overflow-tooltip />
		<el-table-column
			property="needLoan"
			label="是否贷款"
			width="100"
			:formatter="needLoanFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="intentionState"
			label="意向状态"
			width="100"
			:formatter="intentionStateFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="intentionProductName"
			label="意向产品"
			width="200"
			show-overflow-tooltip
		/>
		<el-table-column
			property="state"
			label="线索状态"
			width="100"
			:formatter="stateFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="source"
			label="线索来源"
			width="120"
			:formatter="sourceFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="nextContactTime"
			label="下次联系时间"
			width="180"
			:formatter="timeFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="region"
			label="地区"
			width="120"
			:formatter="regionFormatter"
			show-overflow-tooltip
		/>
		<el-table-column fixed="right" label="操作" min-width="210">
			<template #default="scope">
				<el-button type="primary" size="small" @click="showClueDetails(scope.row)"
					>详情</el-button
				>
				<el-button type="success" size="small" @click="editClue(scope.row)">编辑</el-button>
				<el-button type="danger" size="small" @click="deleteClues([scope.row.id])"
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
import { ref, onMounted, watchEffect, computed } from "vue"
import { useRouter } from "vue-router"

import { showOwnerSearch, getOwnerList, formatTime, messageTip } from "@/utils/utils"
import {
	clueStateOptions,
	clueSourceOptions,
	regionData,
	PAGE_SIZE,
	genderOptions,
	needLoanOptions,
	intentionStateOptions,
} from "@/constants/constants"
import api from "@/http/api"
import { useMarketingStore } from "@/stores/marketingStore"
import { useProductStore } from "@/stores/productStore"
import { useClueStore } from "@/stores/clueStore"

import { Search, Plus, Delete, MapLocation, Refresh } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"

const marketingStore = useMarketingStore()
const productStore = useProductStore()
const clueStore = useClueStore()

const router = useRouter()

const searchForm = ref({
	activities: null,
	fullName: null,
	gender: null,
	needLoan: null,
	intentionState: null,
	intentionProducts: null,
	states: null,
	sources: null,
	regions: null,
})

// Get the list of owners options
const ownerOptionsList = ref([])
// Get the list of activities options
const activityOptions = ref([])
// Get the list of products options
const productOptions = ref([])

// Clue Table instance
const clueTableRef = ref(null)
// Clue list
const clueList = ref([])

// total number of clues
const total = ref(0)
// Current page number
const currentPage = ref(1)
// Number of items displayed per page
const pageSize = ref(PAGE_SIZE)

// The ids of the clues to be deleted
const deletedIds = []

// Get owner options list from Pinia
watchEffect(() => {
	ownerOptionsList.value = marketingStore.ownerOptions
})

// Get activity options
const getActivityOptionList = async () => {
	const res = await api.getActivityOptionList()
	activityOptions.value = res.data
	marketingStore.setActivityOptions(res.data)
}

// Get product options
const getProductOptionList = async () => {
	const res = await api.getProductOptionList()
	productOptions.value = res.data
	productStore.setProductOptions(res.data)
}

// Search parameters
let params = {
	page: currentPage.value,
	pageSize: pageSize.value,
}
// Get the list of marketing clue
const getClueList = async params => {
	const res = await api.getClueList(params)
	if (res.code === 200) {
		clueList.value = res.data.rows
		total.value = res.data.total
	}
}

const handleCurrentChange = val => {
	currentPage.value = val
	params.page = currentPage.value
	getClueList(params)
}

// Gender formatter
const genderFormatter = (row, column, cellValue, index) => {
	return cellValue === 1 ? "男" : "女"
}

// Whether the loan is needed
const needLoanFormatter = (row, column, cellValue, index) => {
	return cellValue === 1 ? "需要" : "不需要"
}

// Intention state formatter
// 0 no intention, 1 has intention, 2 intention unknown
const intentionStateFormatter = (row, column, cellValue, index) => {
	return cellValue === 0 ? "无意向" : cellValue === 1 ? "有意向" : "意向不明"
}

// Clue state formatter
const stateFormatter = (row, column, cellValue, index) => {
	const state = clueStateOptions.find(item => item.id === cellValue)
	return state ? state.name : "未知状态"
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
	// Get the list of users who can be selected as the owner of the clues
	getOwnerList()
	// Get the list of activities
	getActivityOptionList()
	// Get the list of products
	getProductOptionList()
	getClueList(params)
})

const search = () => {
	// Reset the current page number to 1
	currentPage.value = 1
	// Update the parameters
	params.page = currentPage.value
	params.owners =
		searchForm.value.owners && searchForm.value.owners.length
			? searchForm.value.owners.join(",")
			: null
	params.activities =
		searchForm.value.activities && searchForm.value.activities.length
			? searchForm.value.activities.join(",")
			: null
	params.fullName = searchForm.value.fullName
	params.gender = searchForm.value.gender
	params.needLoan = searchForm.value.needLoan
	params.intentionState = searchForm.value.intentionState
	params.intentionProducts =
		searchForm.value.intentionProducts && searchForm.value.intentionProducts.length
			? searchForm.value.intentionProducts.join(",")
			: null
	params.states =
		searchForm.value.states && searchForm.value.states.length
			? searchForm.value.states.join(",")
			: null
	params.sources =
		searchForm.value.sources && searchForm.value.sources.length
			? searchForm.value.sources.join(",")
			: null
	params.regions =
		searchForm.value.regions && searchForm.value.regions.length
			? searchForm.value.regions.join(",")
			: null
	getClueList(params)
}

const reset = () => {
	searchForm.value = {}
}

// Add a new marketing clue/lead
const addClue = () => {
	router.push({ name: "clues-add" })
}

// Edit a marketing clue/lead
const editClue = row => {
	clueStore.setSelectedClue(row)
	router.push({ name: "clues-edit", params: { id: row.id } })
}

const handleSelectionChange = selectedClues => {
	deletedIds.length = 0
	selectedClues.forEach(item => {
		deletedIds.push(item.id)
	})
}

// Delete marketing clues
const deleteClues = ids => {
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
			const res = await api.updateClues(data)
			if (res.code === 200) {
				messageTip("success", "删除成功!")
				currentPage.value = 1
				params.page = currentPage.value
				getClueList(params)
			} else {
				messageTip("error", "删除失败!请重试！")
			}
		})
		.catch(() => {
			// Click Cancel to clear the selected clues array
			deletedIds.length = 0
			clueTableRef.value.clearSelection()
		})
}

// Delete clues in bulk
const batchDelete = () => {
	if (!deletedIds.length) return messageTip("warning", "请选择市场线索！")
	deleteClues(deletedIds)
}

// Show clue details
const showClueDetails = row => {
	clueStore.setSelectedClue(row)
	router.push({ name: "clues-details", params: { id: row.id } })
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
