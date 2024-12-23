<!--Add marketing activity pop-up window -->
<template>
	<el-dialog title="添加市场活动" v-model="dialogVisible" width="60%" :before-close="handleClose">
		<!-- form -->
		<el-form
			:model="addMarketingForm"
			label-width="100px"
			ref="addMarketingFormRef"
			:rules="rules"
		>
			<el-form-item label="负责人" prop="ownerId" v-if="showOwnerSearch">
				<el-select
					v-model="addMarketingForm.ownerId"
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
				<el-input v-model="addMarketingForm.name" placeholder="请输入活动名称" />
			</el-form-item>
			<el-form-item label="开始时间" prop="startTime">
				<el-date-picker
					v-model="addMarketingForm.startTime"
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
					v-model="addMarketingForm.endTime"
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
					v-model="addMarketingForm.region"
					placeholder="请选择地区"
					@change="handleRegionChange"
					@clear="currencyUnit = null"
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
					v-model="addMarketingForm.cost"
					placeholder="请输入活动预算"
					style="width: 740px"
				/>
				<span style="margin-left: 5px">{{ addMarketingForm.currencyUnit || "" }}</span>
			</el-form-item>
			<el-form-item label="活动描述" prop="description">
				<el-input
					v-model="addMarketingForm.description"
					type="textarea"
					placeholder="请输入活动描述"
					:rows="4"
				/>
			</el-form-item>
		</el-form>
		<!-- Cancel and OK buttons -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel(addMarketingFormRef)">取消</el-button>
				<el-button type="primary" @click="addMarketing" :disabled="addMarketingLoading"
					>确定</el-button
				>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue"

import api from "@/http/api"
import { messageTip, getRoleList, formatTime, showRegion, getRegion } from "@/utils/utils"
import { regionData, PAGE_SIZE } from "@/constants/constants"

import { MapLocation } from "@element-plus/icons-vue"

defineProps(["ownerOptions"])

// Variables that control the display and hiding of the pop-up window
const dialogVisible = ref(false)
// form reference
const addMarketingFormRef = ref(null)
// form data
const addMarketingForm = ref({
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

// A computed attribute, controls whether the person in charge search box is displayed or not. If the user is admin, returns true, otherwise returns false.
const showOwnerSearch = computed(() => {
	const roleList = getRoleList()
	return roleList.indexOf("admin") !== -1
})
// Control pop-up window display
const showAddMarketingDialog = () => {
	dialogVisible.value = !dialogVisible.value
}
// Expose showAddUserDialog function to parent component
defineExpose({
	showAddMarketingDialog,
})
// Obtain getUserList method from the parent component
const emits = defineEmits(["getMarketingList"])
// Add state control to confirm button
const addMarketingLoading = ref(false)

const handleRegionChange = value => {
	addMarketingForm.value.currencyUnit = null
	// Set currency unit based on selected region, RMB for 1, JPY for 2, and USD for others
	switch (value) {
		case 1:
			addMarketingForm.value.currencyUnit = "RMB"
			break
		case 2:
			addMarketingForm.value.currencyUnit = "JPY"
			break
		default:
			addMarketingForm.value.currencyUnit = "USD"
	}
}

// Add marketing activity/campaign
const addMarketing = () => {
	// Verify whether form data is legal
	addMarketingFormRef.value.validate(async valid => {
		if (!valid) return
		// Check whether the end time is later than the start time, if not, prompt the user with an error message
		if (addMarketingForm.value.startTime > addMarketingForm.value.endTime) {
			messageTip("error", "结束时间不能早于开始时间！")
			return
		}
		// Format startTime and endTime
		addMarketingForm.value.startTime = formatTime(addMarketingForm.value.startTime)
		addMarketingForm.value.endTime = formatTime(addMarketingForm.value.endTime)
		// Convert cost to number type
		addMarketingForm.value.cost = Number(addMarketingForm.value.cost)
		if (!addMarketingForm.value.region) {
			addMarketingForm.value.region = getRegion()
		}
		// Open loading
		addMarketingLoading.value = true
		try {
			const res = await api.addActivity(addMarketingForm.value)
			if (res?.code === 200 && res?.data == 1) {
				// Added successfully, close pop-up window, reset form data, and then refresh marketing list data
				messageTip("success", "添加成功!")
				handleCancel(addMarketingFormRef.value)
				// Trigger the getMarketingList method of the parent component, pass the params, and display the marketing activity list starting from the first page
				const params = {
					page: 1,
					pageSize: PAGE_SIZE,
				}
				emits("getMarketingList", params)
			} else {
				messageTip("error", res.msg || "添加失败!请重试！")
			}
		} finally {
			// Close loading
			addMarketingLoading.value = false
		}
	})
}

const handleCancel = formEl => {
	// Reset form data
	formEl.resetFields()
	// Reset currency unit
	addMarketingForm.value.currencyUnit = null
	// Close pop-up window
	showAddMarketingDialog()
}

const handleClose = () => {
	handleCancel(addMarketingFormRef.value)
}

// If the user is not a super administrator or super financing staff, assign a value to the currencyUnit field in the form based on the user's region.
const assignValueToCurrencyUnit = () => {
	if (!showRegion.value) {
		const userRegion = getRegion()
		// Find currency unit corresponding to the user's region in regionData and assign it to the currency unit field in the search form
		addMarketingForm.value.currencyUnit = regionData.find(
			item => item.id === userRegion
		).currencyUnit
	}
}

// 监听dialogVisible的变化，每当dialogVisible变为true时，执行assignValueToCurrencyUnit函数，为currencyUnit赋值
watch(
	() => dialogVisible.value,
	newValue => {
		if (newValue) {
			assignValueToCurrencyUnit()
		}
	}
)
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
	margin-right: 10px;
}
.el-input__wrapper {
	flex-grow: 0;
}
</style>
