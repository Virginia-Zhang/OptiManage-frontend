<!-- Marketing activity details page -->
<template>
	<el-descriptions title="市场活动详情" :column="1" :border="true" label-width="120px">
		<el-descriptions-item label="活动ID">{{
			selectedMarketingActivity.id
		}}</el-descriptions-item>
		<el-descriptions-item label="负责人">{{
			selectedMarketingActivity.ownerAct
		}}</el-descriptions-item>
		<el-descriptions-item label="活动名称">{{
			selectedMarketingActivity.name
		}}</el-descriptions-item>
		<el-descriptions-item label="开始时间">{{
			selectedMarketingActivity.startTime
		}}</el-descriptions-item>
		<el-descriptions-item label="结束时间">{{
			selectedMarketingActivity.endTime
		}}</el-descriptions-item>
		<el-descriptions-item label="活动地区">{{
			convertRegionToText(selectedMarketingActivity.region)
		}}</el-descriptions-item>
		<el-descriptions-item label="活动预算">{{
			selectedMarketingActivity.cost
		}}</el-descriptions-item>

		<el-descriptions-item label="货币单位">{{
			selectedMarketingActivity.currencyUnit
		}}</el-descriptions-item>
		<el-descriptions-item label="活动描述">
			<!-- Use v-html to replace the newline character \n with the <br> tag to make the newline take effect -->
			<div v-html="selectedMarketingActivity.description?.replace(/\n/g, '<br>')"></div>
		</el-descriptions-item>
		<el-descriptions-item label="创建时间">{{
			formatTime(selectedMarketingActivity.createTime)
		}}</el-descriptions-item>
		<el-descriptions-item label="创建人">{{
			selectedMarketingActivity.createByAct
		}}</el-descriptions-item>
		<el-descriptions-item
			:label="selectedMarketingActivity.isDeleted ? '删除时间' : '编辑时间'"
			>{{
				selectedMarketingActivity.editTime
					? formatTime(selectedMarketingActivity.editTime)
					: "--"
			}}</el-descriptions-item
		>
		<el-descriptions-item :label="selectedMarketingActivity.isDeleted ? '删除人' : '编辑人'">{{
			selectedMarketingActivity.editByAct ? selectedMarketingActivity.editByAct : "--"
		}}</el-descriptions-item>
		<el-descriptions-item
			label="填写备注"
			v-if="!selectedMarketingActivity.isDeleted"
			v-permission="'activityRemark:add'"
			>如有需要，请在下方输入活动备注</el-descriptions-item
		>
	</el-descriptions>
	<!-- Marketing activity remark form-->
	<el-form
		ref="remarkFormRef"
		:model="remarkForm"
		:rules="remarkRules"
		style="margin-top: 20px"
		v-if="!selectedMarketingActivity.isDeleted"
		v-permission="'activityRemark:add'"
	>
		<el-form-item prop="noteContent">
			<el-input
				v-model="remarkForm.noteContent"
				type="textarea"
				:rows="4"
				placeholder="请输入备注"
			/>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitRemark" :disabled="submitRemarkLoading"
				>提交</el-button
			>
			<el-button @click="handleCancel(remarkFormRef)">返回</el-button>
		</el-form-item>
	</el-form>
	<!-- Table area to display marketing activity remarks -->
	<el-table
		:data="remarkList"
		:border="true"
		stripe
		style="width: 100%; margin-top: 20px"
		table-layout="auto"
	>
		<el-table-column type="index" width="60" fixed="left" />
		<el-table-column property="noteContent" label="备注内容" width="400">
			<template #default="scope">
				<div v-html="scope.row.noteContent.replace(/\n/g, '<br>')"></div>
			</template>
		</el-table-column>
		<el-table-column
			property="createTime"
			label="创建时间"
			width="170"
			:formatter="timeFormatter"
			show-overflow-tooltip
		/>
		<el-table-column property="createByAct" label="创建人" show-overflow-tooltip />
		<el-table-column
			property="editTime"
			label="编辑时间"
			width="170"
			:formatter="timeFormatter"
			show-overflow-tooltip
		/>
		<el-table-column property="editByAct" label="编辑人" show-overflow-tooltip />
		<!-- Because "activityRemark:edit" and "activityRemark:delete" are always together, we can directly use one of them to control the display of the entire actions bar -->
		<el-table-column
			fixed="right"
			label="操作"
			:width="actionsBarWidth"
			v-if="!selectedMarketingActivity.isDeleted"
			v-permission="'activityRemark:edit'"
		>
			<template #default="scope">
				<el-button
					type="success"
					size="small"
					@click="showEditMarketingRemark(scope.row)"
					v-permission="'activityRemark:edit'"
					>编辑</el-button
				>
				<el-button
					type="danger"
					size="small"
					@click="deleteMarketingRemark(scope.row.id)"
					v-permission="'activityRemark:delete'"
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
		style="margin-top: 20px"
	/>
	<el-button type="primary" @click="router.back()" v-if="showBackButton" style="margin-top: 20px"
		>返回</el-button
	>
	<EditMarketingRemark
		ref="editMarketingRemarkRef"
		:remark="remark"
		@getMarketingRemarkList="getMarketingRemarkList"
		v-if="!selectedMarketingActivity.isDeleted"
	/>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"

import { useMarketingStore } from "@/stores/marketingStore"
import { useUserStore } from "@/stores/userStore"
import { formatTime, messageTip, useCalculateActionsBarWidth } from "@/utils/utils"
import { regionData } from "@/constants/constants"
import api from "@/http/api"
import EditMarketingRemark from "@/components/marketing/EditMarketingRemark.vue"

import { ElMessageBox } from "element-plus"

const router = useRouter()
const marketingStore = useMarketingStore()
const userStore = useUserStore()
const permissionItems = ["activityRemark:edit", "activityRemark:delete"]
const actionsBarWidth = useCalculateActionsBarWidth(permissionItems)

// Get the currently selected marketing activity data from the marketing store
const { selectedMarketingActivity } = marketingStore
const { permissionList } = userStore

// Remark form data
const remarkForm = ref({
	activityId: selectedMarketingActivity.id,
	noteContent: "",
})
// Remark form validation rules
const remarkRules = {
	noteContent: [
		{ required: true, message: "请输入备注内容", trigger: "blur" },
		{ min: 1, max: 5000, message: "备注内容长度在1-5000个字符", trigger: "blur" },
	],
}
// Remark form reference
const remarkFormRef = ref(null)
// Submit button loading status
const submitRemarkLoading = ref(false)

// Remark list
const remarkList = ref([])
const total = ref(0)
const pageSize = ref(5)
const currentPage = ref(1)

// Remark editing component reference
const editMarketingRemarkRef = ref(null)
// Remark data, which is used as props passed to the editing component
const remark = ref({})

// If the current activity is deleted or the user's permissionList does not include "activityRemark:add", display the back button
const showBackButton = computed(() => {
	return selectedMarketingActivity.isDeleted || !permissionList.includes("activityRemark:add")
})

// Convert the value of region into the corresponding text and display it on the page
const convertRegionToText = region => {
	// Traverse regionData, find the corresponding text, and return
	for (const item of regionData) {
		if (item.id === region) {
			return item.name
		}
	}
}

const submitRemark = () => {
	remarkFormRef.value.validate(async valid => {
		if (!valid) return
		submitRemarkLoading.value = true
		try {
			const res = await api.addActivityRemark(remarkForm.value)
			if (res?.code === 200 && res?.data == 1) {
				messageTip("success", "添加备注成功!")
				remarkFormRef.value.resetFields()
				getMarketingRemarkList()
			} else {
				messageTip("error", res.msg || "添加备注失败!请重试！")
			}
		} finally {
			submitRemarkLoading.value = false
		}
	})
}

const handleCancel = formEl => {
	// Reset form data
	formEl.resetFields()
	// Back to the previous page
	router.back()
}

const getMarketingRemarkList = async () => {
	const res = await api.getActivityRemarkList({
		page: currentPage.value,
		pageSize: pageSize.value,
		activityId: selectedMarketingActivity.id,
	})
	if (res?.code === 200) {
		remarkList.value = res.data.rows
		total.value = res.data.total
	}
}
const handleCurrentChange = async page => {
	currentPage.value = page
	await getMarketingRemarkList()
}

onMounted(() => {
	getMarketingRemarkList()
})

// Convert timestamp to readable time
const timeFormatter = (row, column, cellValue, index) => {
	return formatTime(cellValue)
}

// Show edit remark dialog
const showEditMarketingRemark = row => {
	remark.value = row
	editMarketingRemarkRef.value.showEditMarketingRemarkDialog()
}

// Delete remark by id
const deleteMarketingRemark = id => {
	ElMessageBox.confirm("确定要删除吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		try {
			const res = await api.deleteActivityRemarkById(id)
			if (res?.code === 200 && res?.data == 1) {
				messageTip("success", "删除备注成功!")
				getMarketingRemarkList()
			} else {
				messageTip("error", res.msg || "删除备注失败!请重试！")
			}
		} catch (error) {
			messageTip("error", "删除备注失败!请重试！")
		}
	})
}
</script>
<style scoped lang="scss"></style>
