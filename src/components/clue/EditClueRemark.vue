<!-- Edit marketing clue/lead remark pop-up window -->
<template>
	<el-dialog
		title="编辑市场线索备注"
		v-model="dialogVisible"
		width="60%"
		:before-close="handleClose"
	>
		<el-form :model="editClueRemarkForm" ref="editClueRemarkFormRef" :rules="rules">
			<el-form-item prop="noteContent" label="跟踪内容">
				<el-input
					v-model="editClueRemarkForm.noteContent"
					type="textarea"
					:rows="8"
					placeholder="请输入跟踪内容"
				/>
			</el-form-item>
			<el-form-item prop="contactMethod" label="跟踪方式">
				<el-select
					v-model="editClueRemarkForm.contactMethod"
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
				<el-button @click="handleCancel(editClueRemarkFormRef)">取消</el-button>
				<el-button type="primary" @click="editClueRemark" :disabled="editClueRemarkLoading"
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
const editClueRemarkForm = ref({
	noteContent: null,
	contactMethod: null,
})
const editClueRemarkFormRef = ref(null)
const rules = ref({
	noteContent: [
		{ required: true, message: "请输入备注内容", trigger: "blur" },
		{ max: 5000, message: "长度在 1 到 5000 个字符", trigger: "blur" },
	],
	contactMethod: [{ required: true, message: "请选择跟踪方式", trigger: "blur" }],
})

const props = defineProps(["remark"])

watchEffect(() => {
	// When the marketing clue information changes, update the form data
	Object.assign(editClueRemarkForm.value, props.remark)
})

// Control pop-up window display
const showEditClueRemarkDialog = () => {
	dialogVisible.value = !dialogVisible.value
}
// Expose showAddUserDialog function to parent component
defineExpose({
	showEditClueRemarkDialog,
})
// Obtain getClueRemarkList method from the parent component
const emits = defineEmits(["getClueRemarkList"])
// Add state control to confirm button
const editClueRemarkLoading = ref(false)

const editClueRemark = () => {
	editClueRemarkFormRef.value.validate(async valid => {
		if (valid) {
			editClueRemarkLoading.value = true
			try {
				const res = await api.editClueRemark(editClueRemarkForm.value)
				if (res?.code === 200 && res?.data == 1) {
					messageTip("success", "修改成功!")
					handleCancel(editClueRemarkFormRef.value)
					emits("getClueRemarkList")
				} else {
					messageTip("error", res.msg || "修改失败!请重试！")
				}
			} finally {
				editClueRemarkLoading.value = false
			}
		}
	})
}

const handleCancel = formEl => {
	formEl.resetFields()
	dialogVisible.value = false
}

const handleClose = () => {
	handleCancel(editClueRemarkFormRef.value)
}
</script>
