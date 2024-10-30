import {
	PieChart,
	List,
	User,
	ShoppingCart,
	Box,
	Setting,
	Notebook,
	Avatar,
} from "@element-plus/icons-vue"

export const menuData = [
	{
		index: "/dashboard/marketing",
		title: "市场活动",
		icon: PieChart,
		children: [{ index: "/dashboard/marketing", title: "市场活动", icon: PieChart }],
	},
	{
		index: "/dashboard/clue",
		title: "线索管理",
		icon: List,
		children: [{ index: "/dashboard/clue", title: "线索管理", icon: List }],
	},
	{
		index: "/dashboard/customer",
		title: "客户管理",
		icon: Avatar,
		children: [{ index: "/dashboard/customer", title: "客户管理", icon: Avatar }],
	},
	{
		index: "/dashboard/transaction",
		title: "交易管理",
		icon: ShoppingCart,
		children: [{ index: "/dashboard/transaction", title: "交易管理", icon: ShoppingCart }],
	},
	{
		index: "/dashboard/product",
		title: "产品管理",
		icon: Box,
		children: [{ index: "/dashboard/product", title: "产品管理", icon: Box }],
	},
	{
		index: "/dashboard/dictionary",
		title: "字典管理",
		icon: Notebook,
		children: [{ index: "/dashboard/dictionary", title: "字典管理", icon: Notebook }],
	},
	{
		index: "/dashboard/user",
		title: "用户管理",
		icon: User,
		children: [{ index: "/dashboard/user", title: "用户管理", icon: User }],
	},
	{
		index: "/dashboard/system",
		title: "系统管理",
		icon: Setting,
		children: [{ index: "/dashboard/system", title: "系统管理", icon: Setting }],
	},
]
