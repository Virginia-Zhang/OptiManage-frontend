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
]
