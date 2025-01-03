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
			<el-form-item label="地区" prop="region" v-if="showRegion">
				<!--Traverse regionData and generate options -->
				<el-select v-model="editUserForm.region" clearable>
					<template #prefix>
						<el-icon><MapLocation /></el-icon>
					</template>
					<el-option
						v-for="item in regionData"
						:key="item.id"
						:label="item.name"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="角色" prop="roleIds">
				<!--Traverse roleData and generate options -->
				<el-select v-model="editUserForm.roleIds" multiple clearable>
					<template #prefix>
						<el-icon><User /></el-icon>
					</template>
					<el-option
						v-for="item in roleData"
						:key="item.id"
						:label="item.name"
						:value="item.id"
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
import { messageTip, showRegion } from "@/utils/utils"
import { regionData, PAGE_SIZE, roleData } from "@/constants/constants"

import { MapLocation, User } from "@element-plus/icons-vue"

const emits = defineEmits(["getUserList"])
const props = defineProps({
	// Receive user information passed by the parent component
	user: Object,
})
const editUserForm = ref({})

const dialogVisible = ref(false)
const editUserLoading = ref(false)

// Monitor the changes in props.user and dialogVisible. When the user clicks the edit button to display the pop-up window, and props.user is not empty, assign props.user to editUserForm, and then convert roles(JSON string) to an array.
watchEffect(() => {
	if (props.user?.id && dialogVisible.value) {
		Object.assign(editUserForm.value, props.user)
		if (JSON.parse(props.user.roles)[0] == null) {
			editUserForm.value.roleIds = []
		} else {
			editUserForm.value.roleIds = JSON.parse(props.user.roles)
		}
	}
})

const editUserFormRef = ref(null)
const editUserFormRules = ref({
	// Form validation rules
	loginAct: [{ required: true, message: "请输入账号", trigger: "blur" }],
	name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
	phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
	email: [
		{ required: true, message: "请输入邮箱", trigger: "blur" },
		{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
	],
	region: [{ required: true, message: "请输入地区", trigger: "blur" }],
	roleIds: [{ required: true, message: "请选择角色", trigger: "blur" }],
	accountNoExpired: [{ required: true, message: "请选择账号是否过期", trigger: "blur" }],
	credentialsNoExpired: [{ required: true, message: "请选择密码是否过期", trigger: "blur" }],
	accountNoLocked: [{ required: true, message: "请选择账号是否锁定", trigger: "blur" }],
})

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

const handleClose = () => {
	handleCancel(editUserFormRef.value)
}

const editUser = async () => {
	// Validate the form data
	await editUserFormRef.value.validate()
	// Remove the roles attribute from editUserForm
	delete editUserForm.value.roles
	editUserLoading.value = true
	// Send the form data to the server
	try {
		const res = await api.editUser(editUserForm.value)
		// Display the result message
		if (res?.code === 200 && res?.data == 1) {
			messageTip("success", "编辑成功!")
			handleCancel(editUserFormRef.value)
			// Trigger the getUserList method of the parent component
			emits("getUserList")
		} else {
			messageTip("error", res.msg || "编辑失败!请重试！")
		}
	} finally {
		editUserLoading.value = false
	}
}
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>
