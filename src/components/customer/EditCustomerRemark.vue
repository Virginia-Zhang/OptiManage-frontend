<!-- Edit customer remark pop-up window -->
<template>
	<el-dialog title="编辑客户备注" v-model="dialogVisible" width="60%" :before-close="handleClose">
		<el-form :model="editCustomerRemarkForm" ref="editCustomerRemarkFormRef" :rules="rules">
			<el-form-item prop="noteContent" label="跟踪内容">
				<el-input
					v-model="editCustomerRemarkForm.noteContent"
					type="textarea"
					:rows="8"
					placeholder="请输入跟踪内容"
				/>
			</el-form-item>
			<el-form-item prop="contactMethod" label="跟踪方式">
				<el-select
					v-model="editCustomerRemarkForm.contactMethod"
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
		</el-form>
		<!-- Cancel and OK buttons -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel(editCustomerRemarkFormRef)">取消</el-button>
				<el-button
					type="primary"
					@click="editCustomerRemark"
					:disabled="editCustomerRemarkLoading"
					>确定</el-button
				>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, watchEffect } from "vue"

import api from "@/http/api"
import { messageTip } from "@/utils/utils"
import { contactMethodOptions } from "@/constants/constants"

const dialogVisible = ref(false)
const editCustomerRemarkForm = ref({
	noteContent: null,
	contactMethod: null,
})
const editCustomerRemarkFormRef = ref(null)
const rules = ref({
	noteContent: [
		{ required: true, message: "请输入备注内容", trigger: "blur" },
		{ max: 5000, message: "长度在 1 到 5000 个字符", trigger: "blur" },
	],
	contactMethod: [{ required: true, message: "请选择跟踪方式", trigger: "blur" }],
})

const props = defineProps(["remark"])

watchEffect(() => {
	// When the customer information changes, update the form data
	Object.assign(editCustomerRemarkForm.value, props.remark)
})

// Control pop-up window display
const showEditCustomerRemarkDialog = () => {
	dialogVisible.value = !dialogVisible.value
}
// Expose showAddUserDialog function to parent component
defineExpose({
	showEditCustomerRemarkDialog,
})
// Obtain getCustomerRemarkList method from the parent component
const emits = defineEmits(["getCustomerRemarkList"])
// Add state control to confirm button
const editCustomerRemarkLoading = ref(false)

const editCustomerRemark = () => {
	editCustomerRemarkFormRef.value.validate(async valid => {
		if (valid) {
			editCustomerRemarkLoading.value = true
			try {
				const res = await api.editCustomerRemark(editCustomerRemarkForm.value)
				if (res.code === 200 && res.data == 1) {
					messageTip("success", "修改成功!")
					handleCancel(editCustomerRemarkFormRef.value)
					emits("getCustomerRemarkList")
				} else {
					messageTip("error", res.msg || "修改失败!请重试！")
				}
			} finally {
				editCustomerRemarkLoading.value = false
			}
		}
	})
}

const handleCancel = formEl => {
	formEl.resetFields()
	dialogVisible.value = false
}

const handleClose = () => {
	handleCancel(editCustomerRemarkFormRef.value)
}
</script>

<style scoped lang="scss"></style>
