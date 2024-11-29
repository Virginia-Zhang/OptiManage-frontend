<!-- Market Lead/Clue Recycle Bin -->
<template>
	<div class="btn-group">
		<el-button type="primary" :icon="RefreshRight" @click="batchRestore">批量恢复</el-button>
	</div>
	<!-- Table area to display the list of deleted marketing clues -->
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
		<el-table-column fixed="right" label="操作" min-width="140">
			<template #default="scope">
				<el-button type="primary" size="small" @click="showClueDetails(scope.row)"
					>详情</el-button
				>
				<el-button type="success" size="small" @click="restoreClues([scope.row.id])"
					>恢复</el-button
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

import { formatTime, messageTip } from "@/utils/utils"
import { regionData, PAGE_SIZE, clueStateOptions, clueSourceOptions } from "@/constants/constants"
import api from "@/http/api"
import { useClueStore } from "@/stores/clueStore"

import { RefreshRight } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"

const clueStore = useClueStore()

const router = useRouter()

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

// The ids of the clues to be restored
const restoredIds = []

// Search parameters
let params = {
	page: currentPage.value,
	pageSize: pageSize.value,
	isDeleted: 1,
}
// Get the list of deleted marketing clues
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
	getClueList(params)
})

const handleSelectionChange = selectedClues => {
	restoredIds.length = 0
	selectedClues.forEach(item => {
		restoredIds.push(item.id)
	})
}

// restore marketing clues
const restoreClues = ids => {
	ElMessageBox.confirm("确定要恢复吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	})
		.then(async () => {
			const data = {
				ids,
				isDeletedValue: 0,
			}
			const res = await api.updateClues(data)
			if (res.code === 200) {
				messageTip("success", "恢复成功!")
				currentPage.value = 1
				params.page = currentPage.value
				getClueList(params)
			} else {
				messageTip("error", "恢复失败!请重试！")
			}
		})
		.catch(() => {
			// Click Cancel to clear the selected clues array
			restoredIds.length = 0
			clueTableRef.value.clearSelection()
		})
}

// Delete clues in bulk
const batchRestore = () => {
	if (!restoredIds.length) return messageTip("warning", "请选择市场线索！")
	restoreClues(restoredIds)
}

// Show clue details
const showClueDetails = row => {
	clueStore.setSelectedClue(row)
	router.push({ name: "clues-details", params: { id: row.id } })
}
</script>

<style scoped lang="scss">
.btn-group {
	margin-bottom: 20px;
}

.el-pagination {
	margin-top: 20px;
}
</style>
