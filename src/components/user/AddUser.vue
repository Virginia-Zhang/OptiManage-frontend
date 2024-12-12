<!-- Add user popup component -->
<template>
	<el-dialog title="添加用户" v-model="dialogVisible" width="60%" :before-close="handleClose">
		<!-- form -->
		<el-form :model="addUserForm" label-width="100px" ref="addUserFormRef" :rules="rules">
			<el-form-item label="账号" prop="loginAct">
				<!-- Turn off autofill -->
				<el-input
					v-model="addUserForm.loginAct"
					readonly
					@focus="$event.target.removeAttribute('readonly')"
					placeholder="请输入账号"
				/>
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="addUserForm.name" placeholder="请输入姓名" />
			</el-form-item>
			<el-form-item label="手机" prop="phone">
				<el-input v-model="addUserForm.phone" placeholder="请输入手机" />
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="addUserForm.email" placeholder="请输入邮箱" />
			</el-form-item>
			<el-form-item label="地区" prop="region">
				<!--Traverse regionData and generate options -->
				<el-select v-model="addUserForm.region" placeholder="请选择地区" clearable>
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
				<!--Traverse roleOptions and generate options -->
				<el-select
					v-model="addUserForm.roleIds"
					placeholder="请选择用户角色"
					multiple
					clearable
				>
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
		</el-form>
		<!-- Cancel and OK buttons -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel(addUserFormRef)">取消</el-button>
				<el-button type="primary" @click="addUser" :disabled="addUserLoading"
					>确定</el-button
				>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue"

import api from "@/http/api"
import { messageTip } from "@/utils/utils"
import { regionData, PAGE_SIZE, roleData } from "@/constants/constants"

import { MapLocation, User } from "@element-plus/icons-vue"

// Variables that control the display and hiding of the pop-up window
const dialogVisible = ref(false)
// form reference
const addUserFormRef = ref(null)
// form data
const addUserForm = ref({
	loginAct: null,
	name: null,
	phone: null,
	email: null,
	region: null,
	preferredLanguage: null,
	roleIds: null,
})
// Form validation rules
const rules = reactive({
	loginAct: [{ required: true, message: "请输入账号", trigger: "blur" }],
	name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
	phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
	email: [
		{ required: true, message: "请输入邮箱", trigger: "blur" },
		{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
	],
	region: [{ required: true, message: "请选择地区", trigger: "blur" }],
	roleIds: [{ required: true, message: "请选择用户角色", trigger: "blur" }],
})

// Control pop-up window display
const showAddUserDialog = () => {
	dialogVisible.value = !dialogVisible.value
}
// Expose showAddUserDialog function to parent component
defineExpose({
	showAddUserDialog,
})
// Obtain getUserList method from the parent component
const emits = defineEmits(["getUserList"])
// Add state control to confirm button
const addUserLoading = ref(false)

// Add user
const addUser = () => {
	// Verify whether form data is legal
	addUserFormRef.value.validate(async valid => {
		if (!valid) return
		// Add the preferredLanguage field, and find the language in regionData based on the value of the region field.
		addUserForm.value.preferredLanguage = regionData.find(
			item => item.id === addUserForm.value.region
		).language

		addUserLoading.value = true
		try {
			const res = await api.addUser(addUserForm.value)
			if (res?.code === 200 && res?.data == 1) {
				// Added successfully, close pop-up window, reset form data, and then refresh user list data
				messageTip("success", "添加成功!")
				handleCancel(addUserFormRef.value)
				// Trigger the getUserList method of the parent component, pass the params, and display the user list starting from the first page
				const params = {
					page: 1,
					pageSize: PAGE_SIZE,
					isDeleted: 1,
				}
				emits("getUserList", params)
			} else {
				messageTip("error", res.msg || "添加失败!请重试！")
			}
		} finally {
			addUserLoading.value = false
		}
	})
}

const handleCancel = formEl => {
	// Reset form data
	formEl.resetFields()
	// Close pop-up window
	showAddUserDialog()
}

const handleClose = () => {
	handleCancel(addUserFormRef.value)
}
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>
