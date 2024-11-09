<!--Edit user pop-up component -->
<template>
	<el-dialog title="编辑用户" v-model="dialogVisible" width="60%" :before-close="handleClose">
		<el-form
			ref="editUserFormRef"
			:model="editUserForm"
			:rules="editUserFormRules"
			label-width="120px"
		>
			<el-form-item label="账号" prop="loginAct">
				<el-input v-model="editUserForm.loginAct" />
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="editUserForm.name" />
			</el-form-item>
			<el-form-item label="手机" prop="phone">
				<el-input v-model="editUserForm.phone" />
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="editUserForm.email" />
			</el-form-item>
			<el-form-item label="地区" prop="region">
				<!--Traverse regionData and generate options -->
				<el-select v-model="editUserForm.region" clearable>
					<template #prefix>
						<el-icon><MapLocation /></el-icon>
					</template>
					<el-option
						v-for="item in regionData"
						:key="item.value"
						:label="item.name"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="账号是否过期" prop="accountNoExpired">
				<el-select v-model="editUserForm.accountNoExpired">
					<el-option label="是" :value="0"></el-option>
					<el-option label="否" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="密码是否过期" prop="credentialsNoExpired">
				<el-select v-model="editUserForm.credentialsNoExpired">
					<el-option label="是" :value="0"></el-option>
					<el-option label="否" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="账号是否锁定" prop="accountNoLocked">
				<el-select v-model="editUserForm.accountNoLocked">
					<el-option label="是" :value="0"></el-option>
					<el-option label="否" :value="1"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<!-- Cancel and OK buttons -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel(editUserFormRef)">取消</el-button>
				<el-button type="primary" @click="editUser" :disabled="editUserLoading"
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
import { regionData } from "@/constants/constants"

import { MapLocation } from "@element-plus/icons-vue"

const emit = defineEmits(["getUserList"])
const props = defineProps({
	// Receive user information passed by the parent component
	user: Object,
})
const editUserForm = ref({})

watchEffect(() => {
	// When the user information changes, update the form data
	Object.assign(editUserForm.value, props.user)
})

const editUserFormRef = ref(null)
const editUserFormRules = ref({
	// Form validation rules
	loginAct: [{ required: true, message: "请输入账号", trigger: "blur" }],
	name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
	phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
	email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
	region: [{ required: true, message: "请输入地区", trigger: "blur" }],
	accountNoExpired: [{ required: true, message: "请选择账号是否过期", trigger: "blur" }],
	credentialsNoExpired: [{ required: true, message: "请选择密码是否过期", trigger: "blur" }],
	accountNoLocked: [{ required: true, message: "请选择账号是否锁定", trigger: "blur" }],
})
const dialogVisible = ref(false)
const editUserLoading = ref(false)

// Control pop-up window display
const showEditUserDialog = () => {
	dialogVisible.value = !dialogVisible.value
}

// Expose showEditUserDialog function to parent component
defineExpose({
	showEditUserDialog,
})

const handleCancel = formEl => {
	// Reset the form data
	formEl.resetFields()
	showEditUserDialog()
}

const handleClose = done => {
	// Reset form data
	editUserFormRef.value.resetFields()
	// Close pop-up window
	done()
}

const editUser = async () => {
	// Validate the form data
	await editUserFormRef.value.validate()
	editUserLoading.value = true
	// Send the form data to the server
	const res = await api.editUser(editUserForm.value)
	// Display the result message
	if (res.code === 200 && res.data == 1) {
		messageTip("success", "编辑成功!")
		showEditUserDialog()
		editUserFormRef.value.resetFields()
		emit("getUserList")
	} else {
		messageTip("error", "编辑失败!请重试！")
	}
	editUserLoading.value = false
}
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>
