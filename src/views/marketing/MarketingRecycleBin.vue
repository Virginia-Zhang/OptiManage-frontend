<!-- Marketing campaign/activity recycle bin page -->
<template>
	<div class="btn-group">
		<el-button type="primary" :icon="RefreshRight" @click="batchRestore">批量恢复</el-button>
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
		<el-table-column fixed="right" label="操作" min-width="140">
			<template #default="scope">
				<el-button type="primary" size="small" @click="showMarketingDetails(scope.row)"
					>详情</el-button
				>
				<el-button type="success" size="small" @click="restoreMarketings([scope.row.id])"
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

import { PAGE_SIZE, regionData } from "@/constants/constants"
import { formatTime, messageTip } from "@/utils/utils"
import api from "@/http/api"
import { useMarketingStore } from "@/stores/marketingStore"

import { RefreshRight } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"

const router = useRouter()
const marketingStore = useMarketingStore()

// Marketing campaigns list data
const marketingList = ref([])
// Marketing table instance
const marketingTableRef = ref(null)

// total number of campaigns
const total = ref(0)
// Current page number
const currentPage = ref(1)
// Number of items displayed per page
const pageSize = ref(PAGE_SIZE)

// The ids of the activities to be deleted
const restoredIds = []

// Query parameters
const params = {
	page: currentPage.value,
	pageSize: pageSize.value,
	isDeleted: 1,
}
// Get the list of deleted marketing campaigns
const getMarketingList = async params => {
	const res = await api.getActivityList(params)
	if (res.code === 200) {
		marketingList.value = res.data.rows
		total.value = res.data.total
	}
}

onMounted(() => {
	getMarketingList(params)
})

const handleCurrentChange = val => {
	currentPage.value = val
	params.page = currentPage.value
	getMarketingList(params)
}

// View campaign details
const showMarketingDetails = row => {
	// Save selected marketing activity data to pinia
	marketingStore.setSelectedMarketingActivity(row)
	// Jump to the marketing activity details page, and carry the activity ID in the route
	router.push({ name: "marketing-details", params: { id: row.id } })
}

const handleSelectionChange = selectedActivities => {
	restoredIds.length = 0
	selectedActivities.forEach(item => {
		restoredIds.push(item.id)
	})
}

// Restore marketing campaigns
const restoreMarketings = ids => {
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
			const res = await api.updateActivities(data)
			if (res.code === 200) {
				messageTip("success", "恢复成功!")
				currentPage.value = 1
				params.page = currentPage.value
				getMarketingList(params)
			} else {
				messageTip("error", "恢复失败!请重试！")
			}
		})
		.catch(() => {
			// Click Cancel to clear the selected activity array
			restoredIds.length = 0
			marketingTableRef.value.clearSelection()
		})
}

// Restore campaigns in bulk
const batchRestore = () => {
	if (!restoredIds.length) return messageTip("warning", "请选择市场活动！")
	restoreMarketings(restoredIds)
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
</script>

<style scoped lang="scss">
.btn-group {
	margin-bottom: 20px;
}

.el-pagination {
	margin-top: 20px;
}
</style>
