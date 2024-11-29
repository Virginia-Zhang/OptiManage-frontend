<!-- Market clue/lead details page -->
<template>
	<el-descriptions title="市场线索详情" :column="1" :border="true">
		<el-descriptions-item label="线索ID">{{ selectedClue.id }}</el-descriptions-item>
		<el-descriptions-item label="地区">{{
			convertRegionToText(selectedClue.region)
		}}</el-descriptions-item>
		<el-descriptions-item label="负责人">{{ selectedClue.ownerAct }}</el-descriptions-item>
		<el-descriptions-item label="所属活动">{{
			selectedClue.activityName || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="客户姓名">{{
			selectedClue.fullName || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="客户性别">{{
			(selectedClue.gender && selectedClue.gender == 1 ? "男" : "女") || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="客户手机">{{
			selectedClue.phone || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="客户邮箱">{{
			selectedClue.email || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="其他联系方式">{{
			selectedClue.otherContactDetails || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="年龄">{{ selectedClue.age || "--" }}</el-descriptions-item>
		<el-descriptions-item label="职业">{{ selectedClue.job || "--" }}</el-descriptions-item>
		<el-descriptions-item label="年收入">{{
			selectedClue.yearIncome || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="货币单位">{{
			selectedClue.currencyUnit
		}}</el-descriptions-item>
		<el-descriptions-item label="住址">{{ selectedClue.address || "--" }}</el-descriptions-item>
		<el-descriptions-item label="是否贷款">{{
			(selectedClue.needLoan != null && selectedClue.needLoan == 1 ? "需要" : "不需要") ||
			"--"
		}}</el-descriptions-item>
		<el-descriptions-item label="意向状态">{{
			convertIntentionStateToText(selectedClue.intentionState)
		}}</el-descriptions-item>
		<el-descriptions-item label="意向产品">{{
			selectedClue.intentionProductName || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="线索状态">{{
			convertStateToText(selectedClue.state)
		}}</el-descriptions-item>
		<el-descriptions-item label="线索来源">{{
			convertSourceToText(selectedClue.source)
		}}</el-descriptions-item>
		<el-descriptions-item label="线索描述">
			<!-- Use v-html to replace the newline character \n with the <br> tag to make the newline take effect -->
			<div v-html="selectedClue.description?.replace(/\n/g, '<br>')"></div>
		</el-descriptions-item>
		<el-descriptions-item label="下次联系时间">{{
			formatTime(selectedClue.nextContactTime)
		}}</el-descriptions-item>
		<el-descriptions-item label="创建时间">{{
			formatTime(selectedClue.createTime)
		}}</el-descriptions-item>
		<el-descriptions-item label="创建人">{{ selectedClue.createByAct }}</el-descriptions-item>
		<el-descriptions-item label="编辑时间">{{
			selectedClue.editTime ? formatTime(selectedClue.editTime) : "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="编辑人">{{
			selectedClue.editByAct ? selectedClue.editByAct : "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="填写线索备注" v-if="!selectedClue.isDeleted"
			>如有需要，请在下方输入线索跟踪记录，并选择跟踪方式</el-descriptions-item
		>
	</el-descriptions>
	<!-- Marketing clue remark form-->
	<el-form
		ref="remarkFormRef"
		:model="remarkForm"
		:rules="remarkRules"
		style="margin-top: 20px"
		v-if="!selectedClue.isDeleted"
	>
		<el-form-item prop="noteContent">
			<el-input
				v-model="remarkForm.noteContent"
				type="textarea"
				:rows="4"
				placeholder="请输入跟踪记录"
			/>
		</el-form-item>
		<el-form-item prop="contactMethod">
			<el-select
				v-model="remarkForm.contactMethod"
				placeholder="请选择跟踪方式"
				width="200px"
				clearable
			>
				<el-option
					v-for="item in contactMethodOptions"
					:key="item.value"
					:label="item.name"
					:value="item.value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitRemark" :disabled="submitRemarkLoading"
				>提交</el-button
			>
			<!-- Show this button only for clues/leads that haven't been converted to customers -->
			<el-button type="success" @click="showConvertToCustomer" v-if="selectedClue.state != 1"
				>转换客户</el-button
			>
			<el-button @click="handleCancel(remarkFormRef)">返回</el-button>
		</el-form-item>
	</el-form>
	<!-- Table area to display marketing clue remarks -->
	<el-table
		:data="remarkList"
		:border="true"
		stripe
		style="width: 100%; margin-top: 20px"
		table-layout="auto"
	>
		<el-table-column type="index" width="60" fixed="left" />
		<el-table-column
			property="contactMethod"
			label="跟踪方式"
			width="120"
			:formatter="contactMethodFormatter"
			show-overflow-tooltip
		/>
		<el-table-column property="noteContent" label="跟踪内容" width="400">
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
		<el-table-column fixed="right" label="操作" min-width="115" v-if="!selectedClue.isDeleted">
			<template #default="scope">
				<el-button type="success" size="small" @click="showEditClueRemark(scope.row)"
					>编辑</el-button
				>
				<el-button type="danger" size="small" @click="deleteClueRemark(scope.row.id)"
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
	<el-button
		type="primary"
		@click="router.back()"
		v-if="selectedClue.isDeleted"
		style="margin-top: 20px"
		>返回</el-button
	>
	<!-- Edit clue remark modal -->
	<EditClueRemark
		ref="editClueRemarkRef"
		:remark="remark"
		@getClueRemarkList="getClueRemarkList"
		v-if="!selectedClue.isDeleted"
	/>
	<!-- ConvertToCustomer pop-up window, only displayed for clues/leads that have not been converted to customers -->
	<ConvertToCustomer
		ref="convertToCustomerRef"
		@updateSelectedClue="updateSelectedClue"
		v-if="selectedClue.state != 1"
	/>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

import { useClueStore } from "@/stores/clueStore"
import {
	regionData,
	intentionStateOptions,
	clueSourceOptions,
	clueStateOptions,
	contactMethodOptions,
} from "@/constants/constants"
import { formatTime, messageTip } from "@/utils/utils"
import api from "@/http/api"
import EditClueRemark from "@/components/clue/EditClueRemark.vue"
import ConvertToCustomer from "@/components/clue/ConvertToCustomer.vue"

import { ElMessageBox } from "element-plus"

const router = useRouter()
const clueStore = useClueStore()

// Get the selected marketing clue data from Pinia
const { selectedClue } = clueStore

// Marketing clue/lead remark form
const remarkForm = ref({
	noteContent: null,
	contactMethod: null,
})
// Remark form reference
const remarkFormRef = ref(null)
// Remark form validation rules
const remarkRules = {
	noteContent: [
		{
			required: true,
			message: "请输入跟踪记录",
			trigger: "blur",
		},
	],
	contactMethod: [
		{
			required: true,
			message: "请选择跟踪方式",
			trigger: "change",
		},
	],
}
// Submit loading
const submitRemarkLoading = ref(false)

// Clue remark list
const remarkList = ref([])

// Clue remark list pagination
const pageSize = ref(5)
const currentPage = ref(1)
const total = ref(0)

// Remark editing component reference
const editClueRemarkRef = ref(null)
// Remark data, which is used as props passed to the editing component
const remark = ref({})

// ConvertToCustomer component reference
const convertToCustomerRef = ref(null)

// Convert the value of region into the corresponding text and display it on the page
const convertRegionToText = region => {
	// Traverse regionData, find the corresponding text, and return
	for (const item of regionData) {
		if (item.id === region) {
			return item.name
		}
	}
}

// Convert the value of intentionState into the corresponding text and display it on the page
const convertIntentionStateToText = state => {
	if (state == null) return "--"
	for (const item of intentionStateOptions) {
		if (item.value === state) {
			return item.name
		}
	}
}

// Convert the value of clue source into the corresponding text and display it on the page
const convertSourceToText = source => {
	if (source == null) return "--"
	for (const item of clueSourceOptions) {
		if (item.id === source) {
			return item.name
		}
	}
}

// Convert the value of clue state into the corresponding text and display it on the page
const convertStateToText = state => {
	if (state == null) return "--"
	for (const item of clueStateOptions) {
		if (item.id === state) {
			return item.name
		}
	}
}

const submitRemark = () => {
	remarkFormRef.value.validate(async valid => {
		if (!valid) return
		submitRemarkLoading.value = true
		try {
			// Add clueId to remarkForm
			remarkForm.value.clueId = selectedClue.id
			const res = await api.addClueRemark(remarkForm.value)
			if (res.code === 200 && res.data == 1) {
				messageTip("success", "添加备注成功!")
				remarkFormRef.value.resetFields()
				getClueRemarkList()
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

// Convert the value of contact method into the corresponding text and display it on the page
const contactMethodFormatter = (row, column) => {
	return contactMethodOptions.find(item => item.value === row.contactMethod).name
}

// Convert timestamp to readable time
const timeFormatter = (row, column, cellValue, index) => {
	return formatTime(cellValue)
}

// Get clue remark list
const getClueRemarkList = async () => {
	const res = await api.getClueRemarkList({
		page: currentPage.value,
		pageSize: pageSize.value,
		clueId: selectedClue.id,
	})
	if (res.code === 200) {
		remarkList.value = res.data.rows
		total.value = res.data.total
	}
}

onMounted(() => {
	getClueRemarkList()
})

const handleCurrentChange = async page => {
	currentPage.value = page
	await getClueRemarkList()
}

const showEditClueRemark = row => {
	remark.value = row
	editClueRemarkRef.value.showEditClueRemarkDialog()
}

const deleteClueRemark = id => {
	ElMessageBox.confirm("确定要删除吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		try {
			const res = await api.deleteClueRemarkById(id)
			if (res.code === 200 && res.data == 1) {
				messageTip("success", "删除成功!")
				getClueRemarkList()
			} else {
				messageTip("error", res.msg || "删除失败!请重试！")
			}
		} catch (error) {
			messageTip("error", "删除失败!请重试！")
		}
	})
}

// Show convert to customer dialog
const showConvertToCustomer = () => {
	if (!convertToCustomerRef.value) return
	convertToCustomerRef.value.showConvertToCustomerDialog()
}

// After the client conversion done, change the state of the selected clue stored in Pinia to 1-Converted to client, and refresh the page
const updateSelectedClue = () => {
	clueStore.setSelectedClue({
		...clueStore.selectedClue,
		state: 1,
	})
	window.location.reload()
}
</script>

<style scoped lang="scss"></style>
