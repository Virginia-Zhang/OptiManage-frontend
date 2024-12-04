<!-- Create transaction pop-up window -->
<template>
	<el-dialog title="创建交易" v-model="dialogVisible" width="60%" :before-close="handleClose">
		<el-form :model="createTransactionForm" ref="createTransactionFormRef" :rules="rules">
			<el-form-item prop="amount" label="交易金额">
				<el-input
					v-model="createTransactionForm.amount"
					type="number"
					style="width: 700px"
					placeholder="请输入交易金额"
				/>
				<span style="margin-left: 5px">{{ createTransactionForm.currencyUnit || "" }}</span>
			</el-form-item>
			<el-form-item prop="expectedDate" label="预计成交时间">
				<el-date-picker
					v-model="createTransactionForm.expectedDate"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					placeholder="请选择预计成交时间"
				/>
			</el-form-item>
			<el-form-item prop="stage" label="交易阶段">
				<el-select
					v-model="createTransactionForm.stage"
					placeholder="请选择交易阶段"
					width="200px"
					clearable
				>
					<el-option
						v-for="item in transactionStageOptions"
						:key="item.value"
						:label="item.name"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item prop="description" label="交易描述">
				<el-input
					v-model="createTransactionForm.description"
					type="textarea"
					:rows="8"
					placeholder="请输入交易描述"
				/>
			</el-form-item>
			<el-form-item prop="nextContactTime" label="下次跟踪时间">
				<el-date-picker
					v-model="createTransactionForm.nextContactTime"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					placeholder="请选择下次跟踪时间"
				/>
			</el-form-item>
		</el-form>
		<!-- Cancel and OK buttons -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel(createTransactionFormRef)">取消</el-button>
				<el-button
					type="primary"
					@click="createTransaction"
					:disabled="createTransactionLoading"
					>提交</el-button
				>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref } from "vue"

import api from "@/http/api"
import { messageTip } from "@/utils/utils"
import { useCustomerStore } from "@/stores/customerStore"
import { transactionStageOptions } from "@/constants/constants"

import dayjs from "dayjs"

const customerStore = useCustomerStore()
const { selectedCustomer } = customerStore

const dialogVisible = ref(false)
const createTransactionFormRef = ref(null)
const createTransactionForm = ref({
	customerId: selectedCustomer.id,
	amount: null,
	currencyUnit: selectedCustomer.currencyUnit,
	expectedDate: null,
	stage: null,
	description: null,
	nextContactTime: null,
	region: selectedCustomer.region,
})
const rules = {
	amount: [{ required: true, message: "请输入交易金额", trigger: "blur" }],
	expectedDate: [{ required: true, message: "请选择预计成交时间", trigger: "blur" }],
	stage: [{ required: true, message: "请选择交易阶段", trigger: "blur" }],
	description: [
		{ required: true, message: "请输入交易描述", trigger: "blur" },
		{ max: 1000, message: "长度在 1 到 1000 个字符", trigger: "blur" },
	],
	nextContactTime: [{ required: true, message: "请选择下次跟踪时间", trigger: "blur" }],
}
const createTransactionLoading = ref(false)

// Control pop-up window display
const showCreateTransactionDialog = () => {
	dialogVisible.value = !dialogVisible.value
}
// Expose the function to parent component
defineExpose({
	showCreateTransactionDialog,
})

const createTransaction = () => {
	createTransactionFormRef.value.validate(async valid => {
		if (!valid) return
		// Create a transaction number in the format of customerID + current time (YYYYMMDDHHmmss)
		createTransactionForm.value.tranNo = `${selectedCustomer.id}-${dayjs().format("YYYYMMDDHHmmss")}`
		createTransactionLoading.value = true
		try {
			const res = await api.createTransaction(createTransactionForm.value)
			if (res.code === 200 && res.data == 1) {
				messageTip("success", "创建成功!")
				handleCancel(createTransactionFormRef.value)
				// TODO: 等交易管理页面写完后，加上跳转至交易管理页面的功能
			} else {
				messageTip("error", res.msg || "创建失败!请重试！")
			}
		} finally {
			createTransactionLoading.value = false
		}
	})
}

const handleCancel = formEl => {
	formEl.resetFields()
	dialogVisible.value = false
}

const handleClose = () => {
	handleCancel(createTransactionFormRef.value)
}
</script>

<style scoped lang="scss"></style>
