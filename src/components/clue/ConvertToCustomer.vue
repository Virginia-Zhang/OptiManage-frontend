<!-- Convert clue/lead to customer popup window -->
<template>
	<el-dialog
		title="线索转换为客户"
		v-model="dialogVisible"
		width="60%"
		:before-close="handleClose"
	>
		<el-form :model="convertToCustomerForm" ref="convertToCustomerFormRef" :rules="rules">
			<el-form-item prop="product" label="意向产品">
				<el-select
					v-model="convertToCustomerForm.product"
					placeholder="请选择意向产品"
					width="200px"
					clearable
				>
					<el-option
						v-for="item in products"
						:key="item.id"
						:label="item.name"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item prop="description" label="客户描述">
				<el-input
					v-model="convertToCustomerForm.description"
					type="textarea"
					:rows="8"
					placeholder="请输入客户描述"
				/>
			</el-form-item>
			<el-form-item prop="nextContactTime" label="下次跟踪时间">
				<el-date-picker
					v-model="convertToCustomerForm.nextContactTime"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					placeholder="请选择下次跟踪时间"
				/>
			</el-form-item>
		</el-form>
		<!-- Cancel and OK buttons -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel(convertToCustomerFormRef)">取消</el-button>
				<el-button
					type="primary"
					@click="convertToCustomer"
					:disabled="convertToCustomerLoading"
					>转换</el-button
				>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { computed, ref } from "vue"

import { useProductStore } from "@/stores/productStore"
import { useClueStore } from "@/stores/clueStore"
import api from "@/http/api"
import { messageTip } from "@/utils/utils"

const productStore = useProductStore()
const clueStore = useClueStore()

const dialogVisible = ref(false)
const convertToCustomerForm = ref({
	product: null,
	description: null,
	nextContactTime: null,
})
const convertToCustomerFormRef = ref(null)
const rules = ref({
	product: [{ required: true, message: "请选择意向产品", trigger: "blur" }],
	description: [
		{ required: true, message: "请输入客户描述", trigger: "blur" },
		{ max: 1000, message: "长度在 1 到 1000 个字符", trigger: "blur" },
	],
	nextContactTime: [{ required: true, message: "请选择下次跟踪时间", trigger: "blur" }],
})

// Get the list of product options in the region of ​​the currently selected lead/clue
const products = computed(() => {
	return productStore.productOptions.filter(item => item.region === clueStore.selectedClue.region)
})

// Control pop-up window display
const showConvertToCustomerDialog = () => {
	dialogVisible.value = !dialogVisible.value
}
// Expose showAddUserDialog function to parent component
defineExpose({
	showConvertToCustomerDialog,
})

// Add state control to confirm button
const convertToCustomerLoading = ref(false)

const emits = defineEmits(["updateSelectedClue"])

const convertToCustomer = () => {
	convertToCustomerFormRef.value.validate(async valid => {
		if (valid) {
			convertToCustomerLoading.value = true
			convertToCustomerForm.value.clueId = clueStore.selectedClue.id
			convertToCustomerForm.value.region = clueStore.selectedClue.region
			try {
				const res = await api.convertToCustomer(convertToCustomerForm.value)
				if (res.code === 200 && res.data == 1) {
					messageTip("success", "转换成功!")
					// Convert to customer done, trigger updateSelectedClue method in the parent component, update the selected clue data, and refresh the page
					emits("updateSelectedClue")
					handleCancel(convertToCustomerFormRef.value)
					// emits("getClueRemarkList")
				} else {
					messageTip("error", res.msg || "转换失败!请重试！")
				}
			} finally {
				convertToCustomerLoading.value = false
			}
		}
	})
}

const handleCancel = formEl => {
	formEl.resetFields()
	dialogVisible.value = false
}

const handleClose = () => {
	handleCancel(convertToCustomerFormRef.value)
}
</script>

<style scoped lang="scss"></style>
