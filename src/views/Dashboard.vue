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
				:router="true"
			>
				<MenuItem
					v-for="item in menuDataList"
					:key="item.index"
					:menu-item="item"
					class="menu-item"
				/>
			</el-menu>
		</el-aside>
		<el-container>
			<el-header class="header">
				<!-- Menu collapse/expand button -->
				<el-button @click="toggleCollapse">
					<!-- When the menu is collapsed, the menu icon is displayed, otherwise the left arrow icon is displayed. -->
					<el-icon v-if="isCollapsed">
						<MenuIcon />
					</el-icon>
					<el-icon v-else>
						<ArrowLeftIcon />
					</el-icon>
				</el-button>
				<!-- User information display, drop-down menu -->
				<div class="user-menu">
					<el-dropdown @command="handleCommand">
						<span class="el-dropdown-link">
							<el-icon style="margin-right: 8px"><User /></el-icon>
							<span>{{ userInfo.name }}</span>
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
				<router-view />
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
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
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
	ElMessageBox,
} from "element-plus"
import { Menu as MenuIcon, ArrowLeft as ArrowLeftIcon } from "@element-plus/icons-vue"
import MenuItem from "@/components/MenuItem.vue"
import api from "@/http/api"
import { messageTip, clearStorage, getRoleList } from "@/utils/utils"
import { menuData } from "@/constants/constants"
import { useUserStore } from "@/stores/userStore"
import { useMarketingStore } from "@/stores/marketingStore"
import { useProductStore } from "@/stores/productStore"
import { useClueStore } from "@/stores/clueStore"
import { useCustomerStore } from "@/stores/customerStore"

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const marketingStore = useMarketingStore()
const productStore = useProductStore()
const clueStore = useClueStore()
const customerStore = useCustomerStore()

const { userInfo } = userStore

const isCollapsed = ref(false)
// Logout button state control
const logoutLoading = ref(false)

const activeMenu = ref("")

// The active menu item
const getActiveMenu = () => {
	// Get the first layer of the current page path. For example, the current page path is "/dashboard/marketing-details/1", then the first layer is "/dashboard/marketing".
	const activePath = route.path.split("-")[0]
	// When the user just enters the system, send a request to backend to automatically check whether the token is valid or not.
	if (activePath == "/dashboard") {
		api.getProductOptionList()
	} else {
		// When the user clicks on a menu, the corresponding menu item will be highlighted. Even if the user enters a sub-page (like "/dashboard/marketing-details/1") and refresh the page, the corresponding menu item will still be highlighted in the menu sidebar.
		activeMenu.value = activePath
	}
}

// Menu data in the sidebar
const menuDataList = ref([])

const toggleCollapse = () => {
	isCollapsed.value = !isCollapsed.value
}

const handleCommand = async command => {
	if (command === "logout") {
		logoutLoading.value = true
		// Send a logout request to the backend and delete the token in redis
		const res = await api.logout()
		if (res?.code === 200) {
			// Logout success, a pop-up window shows to tell logout is successful.
			messageTip("success", "退出成功!")
			// Clear data in localStorage or sessionStorage, and in Pinia
			clearStorage()
			userStore.clearUserData()
			marketingStore.clearAll()
			productStore.clearAll()
			clueStore.clearAll()
			customerStore.clearAll()
			// After 2 seconds, jump to the login page
			setTimeout(() => {
				router.push("/")
			}, 2000)
		} else {
			// In case of exit exception, a pop-up box will ask the user whether he or she needs to force exit. If necessary, clear the token in local storage or session storage and jump to the login page.
			ElMessageBox.confirm("退出异常，是否需要强制退出？", "确认是否要强制退出", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
				// Confirm to force exit, clear the data in local storage or session storage, and then jump to the login page.
				clearStorage()
				// After 2 seconds, jump to the login page
				setTimeout(() => {
					router.push("/")
				}, 2000)
			})
		}
		logoutLoading.value = false
	} else if (command === "profile") {
		console.log("Viewing profile...")
		// Handle viewing profile
	} else if (command === "change-password") {
		console.log("Changing password...")
		// Handle changing password
	}
}

// Get roleList from storage and determine whether the user has an administrator role. If not, delete the "User Management" menu item in menuData to prevent users from accessing this module.
const authorize = () => {
	const roleList = getRoleList()
	// Deep copy menuData
	let newMenuData = JSON.parse(JSON.stringify(menuData))
	// If user is neither an administrator nor a financing staff, delete the "User Management" menu item and assign it to menuDataList.
	if (roleList.indexOf("admin") === -1 && roleList.indexOf("financing") === -1) {
		newMenuData = newMenuData.filter(item => item.index !== "/dashboard/user")
		// If user does not have the role of "marketing", delete the "/dashboard/marketing" menu item in menuDataList to prevent user from accessing this page.
		if (roleList.indexOf("marketing") === -1) {
			newMenuData = newMenuData.filter(item => item.index !== "/dashboard/marketing")
		}
		// If user does not have the role of "saler" or "manager", delete the "/dashboard/clues", "/dashboard/customer", and "/dashboard/transaction" in menuDataList to prevent user from accessing these pages.
		if (roleList.indexOf("saler") === -1 && roleList.indexOf("manager") === -1) {
			newMenuData = newMenuData.filter(
				item =>
					item.index !== "/dashboard/clues" &&
					item.index !== "/dashboard/customer" &&
					item.index !== "/dashboard/transaction"
			)
		}
		// Assign deep-copied newMenuData to menuDataList
		menuDataList.value = newMenuData
	} else {
		// If user is an administrator or financing staff, deep copy menuData and assign it to menuDataList.
		menuDataList.value = JSON.parse(JSON.stringify(menuData))
	}
}

onMounted(() => {
	authorize()
	getActiveMenu()
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
			transition: all 0.5s ease;
			opacity: 0;
			margin-left: 8px;
			transform: rotate(0deg);
		}
	}

	.el-dropdown-link:hover {
		color: #409eff;

		.arrow-icon {
			opacity: 1;
			transform: rotate(-90deg);
		}
	}
}
</style>
