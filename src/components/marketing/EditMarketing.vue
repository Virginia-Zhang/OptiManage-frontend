<!--Edit marketing activity pop-up window -->
<template>
	<el-dialog title="编辑市场活动" v-model="dialogVisible" width="60%" :before-close="handleClose">
		<!-- form -->
		<el-form
			:model="editMarketingForm"
			label-width="100px"
			ref="editMarketingFormRef"
			:rules="rules"
		>
			<el-form-item label="负责人" prop="ownerId" v-if="showOwner">
				<el-select
					v-model="editMarketingForm.ownerId"
					placeholder="请选择负责人"
					width="200px"
					clearable
				>
					<el-option
						v-for="item in ownerOptions"
						:key="item.id"
						:label="item.loginAct"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="活动名称" prop="name">
				<el-input v-model="editMarketingForm.name" placeholder="请输入活动名称" />
			</el-form-item>
			<el-form-item label="开始时间" prop="startTime">
				<el-date-picker
					v-model="editMarketingForm.startTime"
					type="datetime"
					placeholder="请选择开始时间"
					format="YYYY-MM-DD HH:mm:ss"
					date-format="YYYY/MM/DD ddd"
					time-format="A hh:mm:ss"
					style="width: 100%"
				/>
			</el-form-item>
			<el-form-item label="结束时间" prop="endTime">
				<el-date-picker
					v-model="editMarketingForm.endTime"
					type="datetime"
					placeholder="请选择结束时间"
					format="YYYY-MM-DD HH:mm:ss"
					date-format="YYYY/MM/DD ddd"
					time-format="A hh:mm:ss"
					style="width: 100%"
				/>
			</el-form-item>
			<el-form-item label="地区" prop="region" v-if="showRegion">
				<!--Traverse regionData and generate options -->
				<!--Monitor option changes and dynamically load the currency unit of the activity budget based on the region value -->
				<!--When the region value is cleared, clear the currency unit as well -->
				<el-select
					v-model="editMarketingForm.region"
					placeholder="请选择地区"
					@change="handleRegionChange"
					@clear="currencyUnit = ''"
					clearable
				>
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
			<el-form-item label="活动预算" prop="cost">
				<el-input
					v-model="editMarketingForm.cost"
					placeholder="请输入活动预算"
					style="width: 740px"
				/>
				<span style="margin-left: 5px">{{ editMarketingForm.currencyUnit || "" }}</span>
			</el-form-item>
			<el-form-item label="活动描述" prop="description">
				<el-input
					v-model="editMarketingForm.description"
					type="textarea"
					placeholder="请输入活动描述"
					:rows="4"
				/>
			</el-form-item>
		</el-form>
		<!-- Cancel and OK buttons -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel(editMarketingFormRef)">取消</el-button>
				<el-button type="primary" @click="editMarketing" :disabled="editMarketingLoading"
					>确定</el-button
				>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from "vue"

import api from "@/http/api"
import {
	messageTip,
	getRoleList,
	formatTime,
	parseTime,
	showRegion,
	showOwner,
} from "@/utils/utils"
import { regionData } from "@/constants/constants"

import { MapLocation } from "@element-plus/icons-vue"

const props = defineProps(["ownerOptions", "activity"])

// Variables that control the display and hiding of the pop-up window
const dialogVisible = ref(false)
// form reference
const editMarketingFormRef = ref(null)
// form data
const editMarketingForm = ref({
	name: null,
	startTime: null,
	endTime: null,
	region: null,
	cost: null,
	currencyUnit: null,
	description: null,
})
// Form validation rules
const rules = reactive({
	ownerId: [{ required: true, message: "请选择负责人", trigger: "blur" }],
	name: [
		{ required: true, message: "请输入活动名称", trigger: "blur" },
		{ max: 128, message: "活动名称长度不能超过128个字符", trigger: "blur" },
	],
	startTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
	endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
	region: [{ required: true, message: "请选择地区", trigger: "blur" }],
	cost: [
		{ required: true, message: "请输入活动预算", trigger: "blur" },
		// Must be a positive integer or two decimal places or less
		{ pattern: /^[1-9]\d*(\.\d{1,2})?$/, message: "活动预算必须为正整数或两位及以下的小数" },
	],
	description: [
		{ required: true, message: "请输入活动描述", trigger: "blur" },
		{ max: 1024, message: "活动描述长度不能超过1024个字符", trigger: "blur" },
	],
})

watchEffect(() => {
	// When the marketing activity information changes, update the form data
	Object.assign(editMarketingForm.value, props.activity)
})

// Control pop-up window display
const showEditMarketingDialog = () => {
	dialogVisible.value = !dialogVisible.value
}
// Expose showAddUserDialog function to parent component
defineExpose({
	showEditMarketingDialog,
})
// Obtain getMarketingList method from the parent component
const emits = defineEmits(["getMarketingList"])
// Add state control to confirm button
const editMarketingLoading = ref(false)

const handleRegionChange = value => {
	editMarketingForm.value.currencyUnit = ""
	// Set currency unit based on selected region, RMB for 1, JPY for 2, and USD for others
	switch (value) {
		case 1:
			editMarketingForm.value.currencyUnit = "RMB"
			break
		case 2:
			editMarketingForm.value.currencyUnit = "JPY"
			break
		default:
			editMarketingForm.value.currencyUnit = "USD"
	}
}

// edit marketing activity/campaign
const editMarketing = () => {
	// Verify whether form data is legal
	editMarketingFormRef.value.validate(async valid => {
		if (!valid) return
		// Check whether the end time is later than the start time, if not, prompt the user with an error message
		// Convert startTime and endTime into timestamps, and then compare them
		if (
			parseTime(editMarketingForm.value.startTime) >
			parseTime(editMarketingForm.value.endTime)
		) {
			messageTip("error", "结束时间不能早于开始时间！")
			return
		}
		// Format startTime and endTime
		editMarketingForm.value.startTime = formatTime(editMarketingForm.value.startTime)
		editMarketingForm.value.endTime = formatTime(editMarketingForm.value.endTime)
		editMarketingForm.value.cost = Number(editMarketingForm.value.cost)
		// Open loading
		editMarketingLoading.value = true
		try {
			const res = await api.editActivity(editMarketingForm.value)
			if (res?.code === 200 && res?.data == 1) {
				// edited successfully, close pop-up window, reset form data, and then refresh marketing list data
				messageTip("success", "编辑成功!")
				handleCancel(editMarketingFormRef.value)
				// Trigger the getMarketingList method of the parent component
				emits("getMarketingList")
			} else {
				messageTip("error", res.msg || "添加失败!请重试！")
			}
		} finally {
			// Close loading
			editMarketingLoading.value = false
		}
	})
}

const handleCancel = formEl => {
	// Reset form data
	formEl.resetFields()
	// Close pop-up window
	showEditMarketingDialog()
}

const handleClose = () => {
	handleCancel(editMarketingFormRef.value)
}
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
	margin-right: 10px;
}
.el-input__wrapper {
	flex-grow: 0;
}
</style>
