<!-- Edit marketing activity remark pop-up window -->
<template>
	<el-dialog
		title="编辑市场活动备注"
		v-model="dialogVisible"
		width="60%"
		:before-close="handleClose"
	>
		<el-form :model="editMarketingRemarkForm" ref="editMarketingRemarkFormRef" :rules="rules">
			<el-form-item prop="noteContent">
				<el-input
					v-model="editMarketingRemarkForm.noteContent"
					type="textarea"
					:rows="8"
					placeholder="请输入备注内容"
				/>
			</el-form-item>
		</el-form>
		<!-- Cancel and OK buttons -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel(editMarketingRemarkFormRef)">取消</el-button>
				<el-button
					type="primary"
					@click="editMarketingRemark"
					:disabled="editMarketingRemarkLoading"
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

const dialogVisible = ref(false)
const editMarketingRemarkForm = ref({
	noteContent: "",
})
const editMarketingRemarkFormRef = ref(null)
const rules = ref({
	noteContent: [
		{ required: true, message: "请输入备注内容", trigger: "blur" },
		{ max: 5000, message: "长度在 1 到 5000 个字符", trigger: "blur" },
	],
})

const props = defineProps(["remark"])

watchEffect(() => {
	// When the marketing activity information changes, update the form data
	Object.assign(editMarketingRemarkForm.value, props.remark)
})

// Control pop-up window display
const showEditMarketingRemarkDialog = () => {
	dialogVisible.value = !dialogVisible.value
}
defineExpose({
	showEditMarketingRemarkDialog,
})
// Obtain getMarketingList method from the parent component
const emits = defineEmits(["getMarketingRemarkList"])
// Add state control to confirm button
const editMarketingRemarkLoading = ref(false)

const editMarketingRemark = () => {
	editMarketingRemarkFormRef.value.validate(async valid => {
		if (valid) {
			editMarketingRemarkLoading.value = true
			try {
				const res = await api.editActivityRemark(editMarketingRemarkForm.value)
				if (res?.code === 200 && res?.data == 1) {
					messageTip("success", "修改成功!")
					handleCancel(editMarketingRemarkFormRef.value)
					emits("getMarketingRemarkList")
				} else {
					messageTip("error", res.msg || "修改失败!请重试！")
				}
			} finally {
				editMarketingRemarkLoading.value = false
			}
		}
	})
}

const handleCancel = formEl => {
	formEl.resetFields()
	dialogVisible.value = false
}

const handleClose = () => {
	handleCancel(editMarketingRemarkFormRef.value)
}
</script>
