<template>
	<el-container class="layout">
		<el-aside :width="isCollapsed ? '64px' : '200px'" class="left-aside">
			<div class="title" v-show="!isCollapsed">@优客易CRM管理系统</div>
			<!-- Let the menu area display a light gray background color, and the text content in the menu can still be seen normally. -->
			<el-menu
				:default-active="activeMenu"
				class="el-menu-vertical-demo"
				:collapse="isCollapsed"
				background-color="#334157"
				text-color="#fff"
				:collapse-transition="false"
				:unique-opened="true"
			>
				<MenuItem
					v-for="item in menuData"
					:key="item.index"
					:menu-item="item"
					class="menu-item"
				/>
			</el-menu>
		</el-aside>
		<el-container>
			<el-header class="header">
				<!-- 菜单折叠/展开按钮 -->
				<el-button @click="toggleCollapse">
					<!-- When the menu is collapsed, the menu icon is displayed, otherwise the left arrow icon is displayed. -->
					<el-icon v-if="isCollapsed">
						<MenuIcon />
					</el-icon>
					<el-icon v-else>
						<ArrowLeftIcon />
					</el-icon>
				</el-button>
				<!-- 用户信息展示，下拉菜单 -->
				<div class="user-menu">
					<el-dropdown @command="handleCommand">
						<span class="el-dropdown-link">
							<el-icon style="margin-right: 8px"><User /></el-icon>
							<span>{{ userName }}</span>
							<el-icon class="arrow-icon"><ArrowLeftIcon /></el-icon>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="profile">我的资料</el-dropdown-item>
								<el-dropdown-item command="change-password"
									>修改密码</el-dropdown-item
								>
								<el-dropdown-item command="logout" divided
									>退出登录</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</el-header>
			<el-main class="main-content">
				<div>Main</div>
			</el-main>
			<el-footer class="footer">
				<div class="footer-text">
					© 2024 优客易 OptiManage | Empowering your business growth.
				</div>
			</el-footer>
		</el-container>
	</el-container>
</template>

<script setup>
import { ref, shallowRef, onMounted } from "vue"
import {
	ElMenu,
	ElButton,
	ElIcon,
	ElContainer,
	ElAside,
	ElHeader,
	ElMain,
	ElFooter,
	ElDropdown,
	ElDropdownMenu,
	ElDropdownItem,
} from "element-plus"
import {
	Menu as MenuIcon,
	ArrowLeft as ArrowLeftIcon,
	PieChart,
	List,
	User,
	ShoppingCart,
	Box,
	Setting,
	Notebook,
	Avatar,
} from "@element-plus/icons-vue"
import MenuItem from "@/components/MenuItem.vue"
import api from "@/http/api"

const isCollapsed = ref(false)
const activeMenu = ref("1")
const userName = ref("test")

// Use shallowRef to ensure that menuData is only responsive on the first layer, and will not perform responsiveness on the icon component object in depth to avoid system warnings.
const menuData = shallowRef([
	{
		index: "1",
		title: "市场活动",
		icon: PieChart,
		children: [{ index: "1-1", title: "市场活动", icon: PieChart }],
	},
	{
		index: "2",
		title: "线索管理",
		icon: List,
		children: [{ index: "2-1", title: "线索管理", icon: List }],
	},
	{
		index: "3",
		title: "客户管理",
		icon: Avatar,
		children: [{ index: "3-1", title: "客户管理", icon: Avatar }],
	},
	{
		index: "4",
		title: "交易管理",
		icon: ShoppingCart,
		children: [{ index: "4-1", title: "交易管理", icon: ShoppingCart }],
	},
	{
		index: "5",
		title: "产品管理",
		icon: Box,
		children: [{ index: "5-1", title: "产品管理", icon: Box }],
	},
	{
		index: "6",
		title: "字典管理",
		icon: Notebook,
		children: [{ index: "6-1", title: "字典管理", icon: Notebook }],
	},
	{
		index: "7",
		title: "用户管理",
		icon: User,
		children: [{ index: "7-1", title: "用户管理", icon: User }],
	},
	{
		index: "8",
		title: "系统管理",
		icon: Setting,
		children: [{ index: "8-1", title: "系统管理", icon: Setting }],
	},
])

const toggleCollapse = () => {
	isCollapsed.value = !isCollapsed.value
}

const handleCommand = command => {
	if (command === "logout") {
		console.log("Logging out...")
		// Handle logout logic here
	} else if (command === "profile") {
		console.log("Viewing profile...")
		// Handle viewing profile
	} else if (command === "change-password") {
		console.log("Changing password...")
		// Handle changing password
	}
}

// 获取用户信息
const fetchUserInfo = async () => {
	const res = await api.getUserInfo()
	console.log("userInfo: ", res)
	// userName.value = res.name
}

onMounted(() => {
	fetchUserInfo()
})
</script>

<style scoped lang="scss">
.layout {
	height: 100vh;
	background-color: #f0f2f5;
}

.left-aside {
	background: #1a1a1a;

	.title {
		font-size: 16px;
		font-weight: bold;
		height: 60px;
		line-height: 60px;
		color: #fff;
		text-align: center;
	}

	.el-menu {
		border-right: none;
	}
}

.header {
	background-color: #ffffff;
	padding: 10px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.main-content {
	background-color: #ffffff;
	padding: 20px;
	margin: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
}

.footer {
	background-color: #334157;
	padding: 20px;
	color: #fff;
	text-align: center;

	.footer-text {
		font-size: 14px;
	}
}

.user-menu {
	cursor: pointer;
	display: flex;
	align-items: center;

	.el-dropdown-link {
		display: flex;
		align-items: center;
		color: #333;
		text-decoration: none;
		outline: none;

		.arrow-icon {
			transition: opacity 0.5s ease;
			opacity: 0;
			margin-left: 8px;
			transform: rotate(-90deg);
		}
	}

	.el-dropdown-link:hover {
		color: #409eff;

		.arrow-icon {
			opacity: 1;
		}
	}
}
</style>
