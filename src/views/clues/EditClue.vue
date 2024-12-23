<!-- Edit marketing clues/leads page -->
<template>
	<el-form :model="editClueForm" label-width="100px" :rules="rules" ref="editClueFormRef">
		<el-form-item label="地区" prop="region" v-if="showRegion">
			<el-select
				v-model="editClueForm.region"
				placeholder="请选择线索所在区域"
				@change="handleRegionChange"
				@clear="handleRegionClear"
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
		<el-form-item label="负责人" prop="ownerId" v-if="showOwnerSearch">
			<el-select
				v-model="editClueForm.ownerId"
				placeholder="请选择负责人"
				width="200px"
				clearable
			>
				<template #empty>
					<span>请先选择地区！</span>
				</template>
				<el-option
					v-for="item in owners"
					:key="item.id"
					:label="item.loginAct"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="所属活动" prop="activityId">
			<el-select
				v-model="editClueForm.activityId"
				placeholder="请选择所属活动"
				width="200px"
				@clear="editClueForm.activityName = null"
				clearable
			>
				<template #empty>
					<span>请先选择地区！</span>
				</template>
				<el-option
					v-for="item in activities"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="姓名" prop="fullName">
			<el-input v-model="editClueForm.fullName" placeholder="请输入客户姓名" />
		</el-form-item>
		<el-form-item label="性别" prop="gender">
			<el-select
				v-model="editClueForm.gender"
				placeholder="请选择客户性别"
				width="200px"
				clearable
			>
				<el-option
					v-for="item in genderOptions"
					:key="item.value"
					:label="item.name"
					:value="item.value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="手机" prop="phone">
			<el-input v-model="editClueForm.phone" placeholder="请输入客户手机号码" />
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="editClueForm.email" placeholder="请输入客户邮箱" />
		</el-form-item>
		<el-form-item label="其他联系方式" prop="otherContactDetails">
			<el-input
				v-model="editClueForm.otherContactDetails"
				placeholder="请输入客户其他联系方式"
			/>
		</el-form-item>
		<el-form-item label="年龄" prop="age">
			<el-input v-model="editClueForm.age" placeholder="请输入客户年龄" type="number" />
		</el-form-item>
		<el-form-item label="职业" prop="job">
			<el-input v-model="editClueForm.job" placeholder="请输入客户职业" />
		</el-form-item>
		<el-form-item label="收入" prop="yearIncome" class="content">
			<el-input
				v-model="editClueForm.yearIncome"
				placeholder="请输入客户年收入"
				type="number"
				style="flex: 1"
			/>
			<div class="currency-unit">{{ editClueForm.currencyUnit || "" }}</div>
		</el-form-item>
		<el-form-item label="住址" prop="address">
			<el-input v-model="editClueForm.address" placeholder="请输入客户住址" />
		</el-form-item>
		<el-form-item label="是否贷款" prop="needLoan">
			<el-select
				v-model="editClueForm.needLoan"
				placeholder="请选择客户是否贷款"
				width="200px"
				clearable
			>
				<el-option
					v-for="item in needLoanOptions"
					:key="item.value"
					:label="item.name"
					:value="item.value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="意向状态" prop="intentionState">
			<el-select
				v-model="editClueForm.intentionState"
				placeholder="请选择客户的意向状态"
				width="200px"
				clearable
			>
				<el-option
					v-for="item in intentionStateOptions"
					:key="item.value"
					:label="item.name"
					:value="item.value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="意向产品" prop="intentionProduct">
			<el-select
				v-model="editClueForm.intentionProduct"
				placeholder="请选择客户的意向产品"
				width="200px"
				@clear="editClueForm.intentionProductName = null"
				clearable
			>
				<template #empty>
					<span>请先选择地区！</span>
				</template>
				<el-option
					v-for="item in products"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="线索状态" prop="state">
			<el-select
				v-model="editClueForm.state"
				placeholder="请选择线索状态"
				width="200px"
				clearable
			>
				<el-option
					v-for="item in clueStateOptions"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="线索来源" prop="source">
			<el-select
				v-model="editClueForm.source"
				placeholder="请选择线索来源"
				width="200px"
				clearable
			>
				<template #empty>
					<span>请先选择地区！</span>
				</template>
				<el-option
					v-for="item in clueSources"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="线索描述" prop="description">
			<el-input
				v-model="editClueForm.description"
				placeholder="请输入线索描述"
				type="textarea"
				:rows="4"
			/>
		</el-form-item>
		<el-form-item label="下次联系时间" prop="nextContactTime">
			<el-date-picker
				v-model="editClueForm.nextContactTime"
				type="datetime"
				placeholder="请选择下次联系时间"
				format="YYYY-MM-DD HH:mm:ss"
				date-format="YYYY/MM/DD ddd"
				time-format="A hh:mm:ss"
				style="width: 100%"
			/>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitClue" :disabled="submitClueLoading"
				>提交</el-button
			>
			<el-button @click="handleBack(editClueFormRef)">返回</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue"
import { useRouter } from "vue-router"

import { showOwnerSearch, messageTip, formatTime, showRegion } from "@/utils/utils"
import {
	genderOptions,
	needLoanOptions,
	intentionStateOptions,
	clueStateOptions,
	clueSourceOptions,
	regionData,
} from "@/constants/constants"
import { useMarketingStore } from "@/stores/marketingStore"
import { useProductStore } from "@/stores/productStore"
import { useClueStore } from "@/stores/clueStore"
import api from "@/http/api"

const marketingStore = useMarketingStore()
const productStore = useProductStore()
const clueStore = useClueStore()

const { ownerOptions, activityOptions } = marketingStore
const { productOptions } = productStore

const router = useRouter()

const editClueForm = ref({
	activityId: null,
	fullName: null,
	gender: null,
	region: null,
	phone: null,
	email: null,
	otherContactDetails: null,
	age: null,
	job: null,
	yearIncome: null,
	currencyUnit: null,
	address: null,
	needLoan: null,
	intentionState: null,
	intentionProduct: null,
	state: null,
	source: null,
	description: null,
	nextContactTime: null,
})
const editClueFormRef = ref(null)

// According to the region selected by the user, the owner options list of the corresponding region is displayed.
const owners = computed(() => {
	return ownerOptions.filter(item => item.region === editClueForm.value.region)
})
// According to the region selected by the user, the activity options list of the corresponding region is displayed.
const activities = computed(() => {
	return activityOptions.filter(item => item.region === editClueForm.value.region)
})
// According to the region selected by the user, the product options list of the corresponding region is displayed.
const products = computed(() => {
	return productOptions.filter(item => item.region === editClueForm.value.region)
})
// According to the region selected by the user, the clue source options list of the corresponding region is displayed.
const clueSources = computed(() => {
	return clueSourceOptions.filter(item => item.region.includes(editClueForm.value.region))
})

watchEffect(() => {
	Object.assign(editClueForm.value, clueStore.selectedClue)
})

const submitClueLoading = ref(false)
const rules = {
	ownerId: [{ required: true, message: "请选择负责人", trigger: "blur" }],
	fullName: [{ max: 64, message: "客户姓名不能超过64个字符", trigger: "blur" }],
	region: [{ required: true, message: "客户地区不能为空", trigger: "blur" }],
	phone: [{ max: 30, message: "客户手机号码不能超过30个字符", trigger: "blur" }],
	email: [
		{ max: 128, message: "客户邮箱不能超过128个字符", trigger: "blur" },
		{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
	],
	otherContactDetails: [
		{ max: 500, message: "客户其他联系方式不能超过500个字符", trigger: "blur" },
	],
	age: [{ pattern: /^\d+$/, message: "客户年龄必须为整数", trigger: "blur" }],
	job: [{ max: 64, message: "客户职业不能超过64个字符", trigger: "blur" }],
	// Annual income must be a number, decimals are also acceptable
	yearIncome: [{ pattern: /^\d+(\.\d+)?$/, message: "客户年收入必须为数字值", trigger: "blur" }],
	address: [{ max: 128, message: "客户住址不能超过128个字符", trigger: "blur" }],
	description: [{ max: 1024, message: "客户描述不能超过1024个字符", trigger: "blur" }],
}

const handleRegionChange = value => {
	editClueForm.value.currencyUnit = null
	editClueForm.value.ownerId = null
	editClueForm.value.activityId = null
	editClueForm.value.intentionProduct = null
	editClueForm.value.source = null
	// Set currency unit based on selected region, 万元 for 1, 万円 for 2, and thousand USD for others
	switch (value) {
		case 1:
			editClueForm.value.currencyUnit = "万元"
			break
		case 2:
			editClueForm.value.currencyUnit = "万円"
			break
		default:
			editClueForm.value.currencyUnit = "thousand USD"
	}
	// According to the new region value, filter out the items in the corresponding region from the original options.
	owners.value = ownerOptions.filter(item => item.region === value)
	activities.value = activityOptions.filter(item => item.region === value)
	products.value = productOptions.filter(item => item.region === value)
	clueSources.value = clueSourceOptions.filter(item => item.region.includes(value))
}

const handleRegionClear = () => {
	owners.value = []
	activities.value = []
	products.value = []
	clueSources.value = []
	editClueForm.value.currencyUnit = null
	editClueForm.value.ownerId = null
	editClueForm.value.activityId = null
	editClueForm.value.intentionProduct = null
	editClueForm.value.source = null
}

const submitClue = async () => {
	editClueFormRef.value.validate(async valid => {
		if (!valid) return
		// If the state is 1 -Transferred customer, check whether the fields of intentionProduct, description, and nextContactTime are not empty. If empty, prompt the user.
		if (editClueForm.value.state === 1) {
			if (!editClueForm.value.intentionProduct) {
				return messageTip("error", "请选择意向产品！")
			}
			if (!editClueForm.value.description || editClueForm.value.description.trim() === "") {
				return messageTip("error", "请填写客户描述！")
			}
			if (!editClueForm.value.nextContactTime) {
				return messageTip("error", "请选择下次联系时间！")
			}
		}
		editClueForm.value.nextContactTime = formatTime(editClueForm.value.nextContactTime)
		submitClueLoading.value = true
		try {
			const res = await api.editClue(editClueForm.value)
			if (res?.code === 200 && res?.data == 1) {
				messageTip("success", "编辑线索成功!")
				setTimeout(() => {
					router.back()
				}, 2000)
			} else {
				messageTip("error", res.msg || "编辑线索失败!请重试！")
			}
		} finally {
			submitClueLoading.value = false
		}
	})
}

const handleBack = formEl => {
	if (!formEl) return
	formEl.resetFields()
	router.back()
}
</script>

<style scoped lang="scss">
.currency-unit {
	margin-left: 5px;
	text-align: right;
}
</style>
