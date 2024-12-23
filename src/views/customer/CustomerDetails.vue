<!-- Customer details page -->
<template>
	<el-descriptions title="客户详情" :column="1" :border="true" label-width="120px">
		<el-descriptions-item label="客户ID">{{ selectedCustomer.id }}</el-descriptions-item>
		<el-descriptions-item label="所属线索ID">{{
			selectedCustomer.clueId
		}}</el-descriptions-item>
		<el-descriptions-item label="地区">{{
			convertRegionToText(selectedCustomer.region)
		}}</el-descriptions-item>
		<el-descriptions-item label="负责人">{{ selectedCustomer.ownerAct }}</el-descriptions-item>
		<el-descriptions-item label="客户姓名">{{
			selectedCustomer.fullName || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="客户性别">{{
			selectedCustomer.gender === 1 ? "男性" : selectedCustomer.gender === 2 ? "女性" : "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="客户手机">{{
			selectedCustomer.phone || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="客户邮箱">{{
			selectedCustomer.email || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="其他联系方式">{{
			selectedCustomer.otherContactDetails || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="年龄">{{ selectedCustomer.age || "--" }}</el-descriptions-item>
		<el-descriptions-item label="职业">{{ selectedCustomer.job || "--" }}</el-descriptions-item>
		<el-descriptions-item label="年收入">{{
			selectedCustomer.yearIncome || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="货币单位">{{
			selectedCustomer.currencyUnit
		}}</el-descriptions-item>
		<el-descriptions-item label="住址">{{
			selectedCustomer.address || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="是否贷款">{{
			selectedCustomer.needLoan === 0
				? "不需要"
				: selectedCustomer.needLoan === 1
					? "需要"
					: "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="意向产品">{{
			selectedCustomer.intentionProductName || "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="来源">{{
			convertSourceToText(selectedCustomer.source)
		}}</el-descriptions-item>
		<el-descriptions-item label="描述">
			<!-- Use v-html to replace the newline character \n with the <br> tag to make the newline take effect -->
			<div v-html="selectedCustomer.description?.replace(/\n/g, '<br>')"></div>
		</el-descriptions-item>
		<el-descriptions-item label="下次联系时间">{{
			formatTime(selectedCustomer.nextContactTime)
		}}</el-descriptions-item>
		<el-descriptions-item label="创建时间">{{
			formatTime(selectedCustomer.createTime)
		}}</el-descriptions-item>
		<el-descriptions-item label="创建人">{{
			selectedCustomer.createByAct
		}}</el-descriptions-item>
		<el-descriptions-item :label="selectedCustomer.isDeleted ? '删除时间' : '编辑时间'">{{
			selectedCustomer.editTime ? formatTime(selectedCustomer.editTime) : "--"
		}}</el-descriptions-item>
		<el-descriptions-item :label="selectedCustomer.isDeleted ? '删除人' : '编辑人'">{{
			selectedCustomer.editByAct ? selectedCustomer.editByAct : "--"
		}}</el-descriptions-item>
		<el-descriptions-item
			label="填写客户备注"
			v-if="!selectedCustomer.isDeleted"
			v-permission="'customerRemark:add'"
			>如有需要，请在下方输入客户跟踪记录，并选择跟踪方式</el-descriptions-item
		>
	</el-descriptions>
	<!-- Customer remark form-->
	<el-form
		ref="remarkFormRef"
		:model="remarkForm"
		:rules="remarkRules"
		style="margin-top: 20px"
		v-if="!selectedCustomer.isDeleted"
		v-permission="'customerRemark:add'"
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
			<el-button type="success" @click="showCreateTransaction">创建交易</el-button>
			<el-button @click="handleCancel(remarkFormRef)">返回</el-button>
		</el-form-item>
	</el-form>
	<!-- Table area to display customer remarks -->
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
		<el-table-column
			fixed="right"
			label="操作"
			:width="actionsBarWidth"
			v-if="!selectedCustomer.isDeleted"
			v-permission="'customerRemark:edit'"
		>
			<template #default="scope">
				<el-button type="success" size="small" @click="showEditCustomerRemark(scope.row)"
					>编辑</el-button
				>
				<el-button type="danger" size="small" @click="deleteCustomerRemark(scope.row.id)"
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
	<!-- Edit customer remark modal -->
	<EditCustomerRemark
		ref="editCustomerRemarkRef"
		:remark="remark"
		@getCustomerRemarkList="getCustomerRemarkList"
	/>
	<!-- Create transaction modal -->
	<CreateTransaction ref="createTransactionRef" />
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"

import { useCustomerStore } from "@/stores/customerStore"
import { useUserStore } from "@/stores/userStore"
import { regionData, clueSourceOptions, contactMethodOptions } from "@/constants/constants"
import { formatTime, messageTip, useCalculateActionsBarWidth } from "@/utils/utils"
import api from "@/http/api"
import EditCustomerRemark from "@/components/customer/EditCustomerRemark.vue"
import CreateTransaction from "@/components/customer/CreateTransaction.vue"

import { ElMessageBox } from "element-plus"

const router = useRouter()
const customerStore = useCustomerStore()
const userStore = useUserStore()
const actionsBarWidth = useCalculateActionsBarWidth([
	"customerRemark:edit",
	"customerRemark:delete",
])

// Get the selected customer data from Pinia
const { selectedCustomer } = customerStore
const { permissionList } = userStore

// Customer remark form
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
		{ max: 5000, message: "跟踪记录不能超过5000字", trigger: "blur" },
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

// Customer remark list
const remarkList = ref([])

// Customer remark list pagination
const pageSize = ref(5)
const currentPage = ref(1)
const total = ref(0)

// Remark editing component reference
const editCustomerRemarkRef = ref(null)
// Remark data, which is used as props passed to the editing component
const remark = ref({})

// CreateTransaction component reference
const createTransactionRef = ref(null)

const submitRemark = () => {
	remarkFormRef.value.validate(async valid => {
		if (!valid) return
		submitRemarkLoading.value = true
		try {
			// Add customerId to remarkForm
			remarkForm.value.customerId = selectedCustomer.id
			const res = await api.addCustomerRemark(remarkForm.value)
			if (res?.code === 200 && res?.data == 1) {
				messageTip("success", "添加备注成功!")
				remarkFormRef.value.resetFields()
				getCustomerRemarkList()
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

// Convert the value of region into the corresponding text and display it on the page
const convertRegionToText = region => {
	// Traverse regionData, find the corresponding text, and return
	for (const item of regionData) {
		if (item.id === region) {
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

// Convert the value of contact method into the corresponding text and display it on the page
const contactMethodFormatter = (row, column) => {
	if (!row) return
	return contactMethodOptions.find(item => item.value === row.contactMethod).name
}

// Convert timestamp to readable time
const timeFormatter = (row, column, cellValue, index) => {
	return formatTime(cellValue)
}

// Get customer remark list
const getCustomerRemarkList = async () => {
	const res = await api.getCustomerRemarkList({
		page: currentPage.value,
		pageSize: pageSize.value,
		customerId: selectedCustomer.id,
	})
	if (res?.code === 200) {
		remarkList.value = res.data.rows
		total.value = res.data.total
	}
}

onMounted(() => {
	getCustomerRemarkList()
})

const handleCurrentChange = async page => {
	currentPage.value = page
	await getCustomerRemarkList()
}

const showEditCustomerRemark = row => {
	remark.value = row
	editCustomerRemarkRef.value.showEditCustomerRemarkDialog()
}

const deleteCustomerRemark = id => {
	ElMessageBox.confirm("确定要删除吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		try {
			const res = await api.deleteCustomerRemarkById(id)
			if (res?.code === 200 && res?.data == 1) {
				messageTip("success", "删除成功!")
				getCustomerRemarkList()
			} else {
				messageTip("error", res.msg || "删除失败!请重试！")
			}
		} catch (error) {
			messageTip("error", "删除失败!请重试！")
		}
	})
}

// Show createTransaction dialog
const showCreateTransaction = () => {
	if (!createTransactionRef.value) return
	createTransactionRef.value.showCreateTransactionDialog()
}

// If the current customer is deleted or the user's permissionList does not include "customerRemark:add", display the back button
const showBackButton = computed(() => {
	return selectedCustomer.isDeleted || !permissionList.includes("customerRemark:add")
})
</script>

<style scoped lang="scss"></style>
