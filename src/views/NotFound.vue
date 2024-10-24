// 404 Not Found page
<template>
	<div class="not-found-page">
		<el-container class="content-wrapper">
			<el-row justify="center">
				<el-col :span="12">
					<img
						src="/404-error-1024x590.webp"
						alt="Page Not Found"
						class="not-found-image"
					/>
				</el-col>
			</el-row>
			<el-row justify="center">
				<el-col :span="18">
					<h1>404 - 页面找不到了</h1>
					<p>抱歉，您访问的页面不存在。请检查您输入的URL或返回上一页。</p>
					<el-button type="primary" @click="router.back()">返回上一页</el-button>
				</el-col>
			</el-row>
		</el-container>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router"
const router = useRouter()
</script>

<style lang="scss" scoped>
.not-found-page {
	text-align: center;
	padding: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	box-sizing: border-box;

	.content-wrapper {
		background: #f5f5f5;
		padding: 30px;
		border-radius: 8px;

		.not-found-image {
			max-width: 100%;
			height: auto;
		}

		h1 {
			margin-top: 20px;
			font-size: 32px;
			color: #333;
		}
		p {
			font-size: 18px;
			color: #666;
			margin: 10px 0;
		}
		.el-button {
			margin-top: 20px;
		}
	}
}
</style>
