<!-- Marketing activity details page -->
<template>
	<el-descriptions title="市场活动详情" :column="1" :border="true">
		<el-descriptions-item label="活动ID">{{
			selectedMarketingActivity.id
		}}</el-descriptions-item>
		<el-descriptions-item label="负责人">{{
			selectedMarketingActivity.ownerAct
		}}</el-descriptions-item>
		<el-descriptions-item label="活动名称">{{
			selectedMarketingActivity.name
		}}</el-descriptions-item>
		<el-descriptions-item label="开始时间">{{
			selectedMarketingActivity.startTime
		}}</el-descriptions-item>
		<el-descriptions-item label="结束时间">{{
			selectedMarketingActivity.endTime
		}}</el-descriptions-item>
		<el-descriptions-item label="活动地区">{{
			convertRegionToText(selectedMarketingActivity.region)
		}}</el-descriptions-item>
		<el-descriptions-item label="活动预算">{{
			selectedMarketingActivity.cost
		}}</el-descriptions-item>

		<el-descriptions-item label="货币单位">{{
			selectedMarketingActivity.currencyUnit
		}}</el-descriptions-item>
		<el-descriptions-item label="活动描述">
			<!-- Use v-html to replace the newline character \n with the <br> tag to make the newline take effect -->
			<div v-html="selectedMarketingActivity.description.replace(/\n/g, '<br>')"></div>
		</el-descriptions-item>
		<el-descriptions-item label="创建时间">{{
			formatTime(selectedMarketingActivity.createTime)
		}}</el-descriptions-item>
		<el-descriptions-item label="创建人">{{
			selectedMarketingActivity.createByAct
		}}</el-descriptions-item>
		<el-descriptions-item label="编辑时间">{{
			selectedMarketingActivity.editTime
				? formatTime(selectedMarketingActivity.editTime)
				: "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="编辑人">{{
			selectedMarketingActivity.editByAct ? selectedMarketingActivity.editByAct : "--"
		}}</el-descriptions-item>
		<el-descriptions-item label="填写备注">如有需要，请在下方输入活动备注</el-descriptions-item>
	</el-descriptions>
	<!-- Marketing activity remark form-->
	<el-form ref="remarkFormRef" :model="remarkForm" :rules="remarkRules" style="margin-top: 20px">
		<el-form-item prop="noteContent">
			<el-input
				v-model="remarkForm.noteContent"
				type="textarea"
				:rows="4"
				placeholder="请输入备注"
			/>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitRemark" :disabled="submitRemarkLoading"
				>提交</el-button
			>
			<el-button @click="handleCancel(remarkFormRef)">返回</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

import { useMarketingStore } from "@/stores/marketingStore"
import { formatTime, messageTip } from "../utils/utils"
import { regionData } from "@/constants/constants"
import api from "@/http/api"

const router = useRouter()
const marketingStore = useMarketingStore()

// Get the currently selected marketing activity data from the marketing store
const { selectedMarketingActivity } = marketingStore

const remarkForm = ref({
	activityId: selectedMarketingActivity.id,
	noteContent: "",
})
const remarkRules = {
	noteContent: [
		{ required: true, message: "请输入备注内容", trigger: "blur" },
		{ min: 1, max: 5000, message: "备注内容长度在1-5000个字符", trigger: "blur" },
	],
}
const remarkFormRef = ref(null)
const submitRemarkLoading = ref(false)

// Convert the value of region into the corresponding text and display it on the page
const convertRegionToText = region => {
	// Traverse regionData, find the corresponding text, and return
	for (const item of regionData) {
		if (item.id === region) {
			return item.name
		}
	}
}

const submitRemark = () => {
	remarkFormRef.value.validate(async valid => {
		if (!valid) return
		submitRemarkLoading.value = true
		try {
			const res = await api.addActivityRemark(remarkForm.value)
			if (res.code === 200 && res.data == 1) {
				messageTip("success", "添加备注成功!")
				remarkFormRef.value.resetFields()
			} else {
				messageTip("error", res.msg || "添加备注失败!请重试！")
			}
		} finally {
			submitRemarkLoading.value = false
		}
	})
}

const handleCancel = formEl => {
	// Reset form data
	formEl.resetFields()
	// Back to the previous page
	router.back()
}
</script>
<style scoped lang="scss"></style>
