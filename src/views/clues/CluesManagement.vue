<!-- Marketing lead/clue management page -->
<template>
	<!-- Search form -->
	<el-form
		:inline="true"
		:model="searchForm"
		class="demo-form-inline"
		:rules="rules"
		ref="searchFormRef"
	>
		<el-form-item label="线索ID" prop="id">
			<el-input v-model="searchForm.id" placeholder="请输入线索ID" type="number" clearable />
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
		<el-button type="primary" :icon="Plus" @click="addClue" v-permission="'clue:add'"
			>录入线索</el-button
		>
		<el-button
			type="danger"
			:icon="Delete"
			@click="batchDelete"
			v-permission="'clue:delete'"
			v-show="clueList.length"
			>批量删除</el-button
		>
		<el-button
			type="success"
			:icon="DocumentCopy"
			@click="exportAll"
			v-permission="'clue:export'"
			v-show="clueList.length"
			>全部导出（Excel）</el-button
		>
		<el-button
			type="info"
			:icon="DocumentCopy"
			@click="exportSelected"
			v-permission="'clue:export'"
			v-show="clueList.length"
			>选择导出（Excel）</el-button
		>
	</div>
	<!-- Table area to display the list of marketing clues -->
	<el-table
		ref="clueTableRef"
		:data="clueList"
		:border="true"
		stripe
		style="width: 100%"
		@selection-change="handleSelectionChange"
		v-loading="clueListLoading"
	>
		<!-- Use the empty slot to define what is displayed when the data is empty. -->
		<template #empty>
			<el-empty description="没有数据" v-if="!clueListLoading" />
		</template>
		<el-table-column type="selection" width="55" fixed="left" />
		<el-table-column type="index" width="60" fixed="left" />
		<el-table-column property="ownerAct" label="负责人" width="150" show-overflow-tooltip />
		<el-table-column
			property="activityName"
			label="所属活动"
			width="260"
			:formatter="emptyFormatter"
			show-overflow-tooltip
		/>
		<el-table-column
			property="fullName"
			label="姓名"
			width="150"
			show-overflow-tooltip
			:formatter="emptyFormatter"
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
			width="150"
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
			:formatter="emptyFormatter"
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
			width="180"
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
			width="90"
			:formatter="regionFormatter"
			show-overflow-tooltip
		/>
		<el-table-column fixed="right" label="操作" :width="actionsBarWidth">
			<template #default="scope">
				<el-button
					type="primary"
					size="small"
					@click="showClueDetails(scope.row)"
					v-permission="'clue:details'"
					>详情</el-button
				>
				<el-button
					type="success"
					size="small"
					@click="editClue(scope.row)"
					v-permission="'clue:edit'"
					>编辑</el-button
				>
				<el-button
					type="danger"
					size="small"
					@click="deleteClues([scope.row.id])"
					v-permission="'clue:delete'"
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
		v-show="clueList.length"
	/>
</template>

<script setup>
import { ref, onMounted, watchEffect, nextTick } from "vue"
import { useRouter } from "vue-router"

import {
	showOwner,
	getOwnerList,
	formatTime,
	messageTip,
	useCalculateActionsBarWidth,
	showRegion,
	getRegion,
	emptyFormatter,
} from "@/utils/utils"
import {
	clueStateOptions,
	clueSourceOptions,
	regionData,
	PAGE_SIZE,
	genderOptions,
	needLoanOptions,
	intentionStateOptions,
	clueExcelHeaders,
} from "@/constants/constants"
import api from "@/http/api"
import { useMarketingStore } from "@/stores/marketingStore"
import { useProductStore } from "@/stores/productStore"
import { useClueStore } from "@/stores/clueStore"

import { Search, Plus, Delete, MapLocation, Refresh, DocumentCopy } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"
import * as XLSX from "xlsx"
import dayjs from "dayjs"

const marketingStore = useMarketingStore()
const productStore = useProductStore()
const clueStore = useClueStore()
// Calculate the width of the action bar
const actionsBarWidth = useCalculateActionsBarWidth(["clue:details", "clue:edit", "clue:delete"])

const router = useRouter()

const searchForm = ref({
	id: null,
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
const searchFormRef = ref(null)
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
// Get the list of activities options
const activityOptions = ref([])
// Get the list of products options
const productOptions = ref([])
// Get the list of clue sources options
const clueSourceOptionsList = ref([])

// Clue Table instance
const clueTableRef = ref(null)
// Clue list
const clueList = ref([])
const clueListLoading = ref(false)

// total number of clues
const total = ref(0)
// Current page number
const currentPage = ref(1)
// Number of items displayed per page
const pageSize = ref(PAGE_SIZE)

// The ids of the clues to be deleted
const deletedIds = []
// The clue data to be exported
const exportedClues = []

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

// If the user is not a super administrator or super financing staff, only the list of lead/clue source options in the user's region will be displayed.
const getClueSourceOptionList = () => {
	// Get the current user's region
	const region = getRegion()
	// If the user is not a super admin or super financing staff, filter out clue sources that do not belong to the current user's region
	if (!showRegion.value) {
		clueSourceOptionsList.value = clueSourceOptions.filter(item => item.region.includes(region))
	} else {
		// If the user is a super Admin or super financing staff, show all lead/clue source options
		clueSourceOptionsList.value = clueSourceOptions
	}
}

// Search parameters
let params = {
	page: currentPage.value,
	pageSize: pageSize.value,
}
// Get the list of marketing clues
const getClueList = async params => {
	clueListLoading.value = true
	try {
		const res = await api.getClueList(params)
		if (res?.code === 200) {
			clueList.value = res.data.rows
			total.value = res.data.total || 0
		}
	} catch (error) {
		console.error("Error fetching clue list:", error)
	} finally {
		clueListLoading.value = false
	}
}

const handleCurrentChange = val => {
	currentPage.value = val
	params.page = currentPage.value
	getClueList(params)
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

// Intention state formatter
// 0 no intention, 1 has intention, 2 intention unknown
const intentionStateFormatter = (row, column, cellValue, index) => {
	if (!cellValue) return "--"
	switch (cellValue) {
		case 0:
			return "无意向"
		case 1:
			return "有意向"
		default:
			return "意向不明"
	}
}

// Clue state formatter
const stateFormatter = (row, column, cellValue, index) => {
	if (!cellValue) return "--"
	const state = clueStateOptions.find(item => item.id === cellValue)
	return state ? state.name : "未知状态"
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
	// Get the list of users who can be selected as the owner of the clues
	getOwnerList()
	// Get the list of activities
	getActivityOptionList()
	// Get the list of products
	getProductOptionList()
	getClueSourceOptionList()
	getClueList(params)
})

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

		searchLoading.value = true
		await getClueList(params)
		searchLoading.value = false
	})
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
	exportedClues.length = 0
	selectedClues.forEach(item => {
		deletedIds.push(item.id)
		exportedClues.push(item)
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
			if (res?.code === 200) {
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

/**
 *	Process the values ​​of specific fields when exporting excel according to mapping rules, including gender, needLoan, intentionState, state, source, region
	gender: 1-male, 2-female, other-unknown
	needLoan: 0-no need, 1-need, other-unknown
	intentionState: value in intentionStateOptions, corresponding to intentionStateName
	state: id in clueStateOptions, corresponding to stateName
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

const mapIntentionState = intentionStateValue => {
	const intentionState = intentionStateOptions.find(item => item.value === intentionStateValue)
	return intentionState ? intentionState.name : "--"
}

const mapState = stateId => {
	const state = clueStateOptions.find(option => option.id === stateId)
	return state ? state.name : "--"
}

const mapSource = sourceId => {
	const source = clueSourceOptions.find(option => option.id === sourceId)
	return source ? source.name : "--"
}

const mapRegion = regionId => {
	const region = regionData.find(r => r.id === regionId)
	return region ? region.name : "--"
}

// Export incoming clue data to excel
const exportExcel = clueData => {
	// Dynamically generate formatted data
	const formattedData = clueData.map(item => {
		const formattedItem = {}

		// Traverse the mapped fields and map the actual data fields to the header names
		clueExcelHeaders.forEach(field => {
			const key = field.key
			let value = item[key]

			// Perform value conversions for specific fields
			switch (key) {
				case "gender":
					value = mapGender(value) // Map gender
					break
				case "needLoan":
					value = mapNeedLoan(value) // Map whether need loan
					break
				case "intentionState":
					value = mapIntentionState(value) // Map intention state
					break
				case "state":
					value = mapState(value) // Map clue state
					break
				case "source":
					value = mapSource(value) // Map clue sources
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
	XLSX.utils.book_append_sheet(wb, ws, "marketing lead Data")

	// Use dayjs to get the current date and format the file name
	const fileName = `Marketing lead Data ${dayjs().format("YYYYMMDD")}.xlsx`

	// Export Excel file
	XLSX.writeFile(wb, fileName)
}

// Export all clue data
const exportAll = async () => {
	// A confirmation box pops up, asking the user to confirm exporting all clue data.
	ElMessageBox.confirm("确认导出全部市场线索数据吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		// Query all clue data without pagination
		const result = await api.getClueListWithoutPagination()
		// Export data to excel
		if (result.code == 200 && result.data?.length > 0) {
			exportExcel(result.data)
		}
	})
}

// Export selected clue data
const exportSelected = () => {
	// If no data is selected, a pop-up window shows to prompt the user
	if (exportedClues.length === 0) {
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
			exportExcel(exportedClues)
			// Clear the selected clues array
			exportedClues.length = 0
			clueTableRef.value.clearSelection()
		})
		.catch(() => {
			// Click Cancel to clear the selected clues array
			exportedClues.length = 0
			clueTableRef.value.clearSelection()
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
