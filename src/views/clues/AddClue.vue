<!-- Add marketing lead/clue page -->
<template>
	<el-form :model="addClueForm" label-width="100px" :rules="rules" ref="addClueFormRef">
		<el-form-item label="负责人" prop="ownerId" v-if="showOwnerSearch">
			<el-select
				v-model="addClueForm.ownerId"
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
		<el-form-item label="所属活动" prop="activityId">
			<el-select
				v-model="addClueForm.activityId"
				placeholder="请选择所属活动"
				width="200px"
				clearable
			>
				<el-option
					v-for="item in activityOptions"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="姓名" prop="fullName">
			<el-input v-model="addClueForm.fullName" placeholder="请输入客户姓名" />
		</el-form-item>
		<el-form-item label="性别" prop="gender">
			<el-select
				v-model="addClueForm.gender"
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
		<el-form-item label="地区" prop="region">
			<!--Monitor option changes and dynamically load the currency unit based on the region value -->
			<!--When the region value is cleared, clear the currency unit as well -->
			<el-select
				v-model="addClueForm.region"
				placeholder="请选择线索所在区域"
				@change="handleRegionChange"
				@clear="addClueForm.currencyUnit = null"
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
		<el-form-item label="手机" prop="phone">
			<el-input v-model="addClueForm.phone" placeholder="请输入客户手机号码" />
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="addClueForm.email" placeholder="请输入客户邮箱" />
		</el-form-item>
		<el-form-item label="其他联系方式" prop="otherContactDetails">
			<el-input
				v-model="addClueForm.otherContactDetails"
				placeholder="请输入客户其他联系方式"
			/>
		</el-form-item>
		<el-form-item label="年龄" prop="age">
			<el-input v-model="addClueForm.age" placeholder="请输入客户年龄" type="number" />
		</el-form-item>
		<el-form-item label="职业" prop="job">
			<el-input v-model="addClueForm.job" placeholder="请输入客户职业" />
		</el-form-item>
		<el-form-item label="收入" prop="yearIncome" class="content">
			<el-input
				v-model="addClueForm.yearIncome"
				placeholder="请输入客户年收入"
				type="number"
				style="flex: 1"
			/>
			<div class="currency-unit">{{ addClueForm.currencyUnit || "" }}</div>
		</el-form-item>
		<el-form-item label="住址" prop="address">
			<el-input v-model="addClueForm.address" placeholder="请输入客户住址" />
		</el-form-item>
		<el-form-item label="是否贷款" prop="needLoan">
			<el-select
				v-model="addClueForm.needLoan"
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
				v-model="addClueForm.intentionState"
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
				v-model="addClueForm.intentionProduct"
				placeholder="请选择客户的意向产品"
				width="200px"
				clearable
			>
				<el-option
					v-for="item in productOptions"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="线索状态" prop="state">
			<el-select
				v-model="addClueForm.state"
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
				v-model="addClueForm.source"
				placeholder="请选择线索来源"
				width="200px"
				clearable
			>
				<el-option
					v-for="item in clueSourceOptions"
					:key="item.id"
					:label="item.name"
					:value="item.id"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="线索描述" prop="description">
			<el-input
				v-model="addClueForm.description"
				placeholder="请输入线索描述"
				type="textarea"
				:rows="4"
			/>
		</el-form-item>
		<el-form-item label="下次联系时间" prop="nextContactTime">
			<el-date-picker
				v-model="addClueForm.nextContactTime"
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
			<el-button @click="handleBack(addClueFormRef)">返回</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

import { showOwnerSearch, messageTip, formatTime } from "@/utils/utils"
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
import api from "@/http/api"

const marketingStore = useMarketingStore()
const productStore = useProductStore()

const { ownerOptions, activityOptions } = marketingStore
const { productOptions } = productStore

const router = useRouter()

const addClueForm = ref({
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
const addClueFormRef = ref(null)

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
	// Age must be a number, decimals are also acceptable
	age: [{ pattern: /^\d+(\.\d+)?$/, message: "客户年龄必须为数字值", trigger: "blur" }],
	job: [{ max: 64, message: "客户职业不能超过64个字符", trigger: "blur" }],
	// Annual income must be a number, decimals are also acceptable
	yearIncome: [{ pattern: /^\d+(\.\d+)?$/, message: "客户年收入必须为数字值", trigger: "blur" }],
	address: [{ max: 128, message: "客户住址不能超过128个字符", trigger: "blur" }],
	description: [{ max: 1024, message: "客户描述不能超过1024个字符", trigger: "blur" }],
}

const handleRegionChange = value => {
	addClueForm.value.currencyUnit = null
	// Set currency unit based on selected region, 万元 for 1, 万円 for 2, and thousand USD for others
	switch (value) {
		case 1:
			addClueForm.value.currencyUnit = "万元"
			break
		case 2:
			addClueForm.value.currencyUnit = "万円"
			break
		default:
			addClueForm.value.currencyUnit = "thousand USD"
	}
}

const submitClue = async () => {
	addClueFormRef.value.validate(async valid => {
		if (!valid) return
		addClueForm.value.nextContactTime = formatTime(addClueForm.value.nextContactTime)
		submitClueLoading.value = true
		try {
			const res = await api.addClue(addClueForm.value)
			if (res.code === 200 && res.data == 1) {
				messageTip("success", "添加线索成功!")
				addClueFormRef.value.resetFields()
			} else {
				messageTip("error", res.msg || "添加线索失败!请重试！")
			}
		} finally {
			submitClueLoading.value = false
		}
	})
}

const handleBack = () => {
	addClueForm.value = {}
	router.back()
}
</script>

<style scoped lang="scss">
.currency-unit {
	margin-left: 5px;
	text-align: right;
}
</style>
