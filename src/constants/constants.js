import {
	PieChart,
	List,
	User,
	ShoppingCart,
	Box,
	Setting,
	Notebook,
	Avatar,
	DeleteFilled,
} from "@element-plus/icons-vue"

// Menu list data in sidebar of Dashboard page
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
		children: [
			{ index: "/dashboard/user", title: "用户管理", icon: User },
			{ index: "/dashboard/user-recycle", title: "回收站", icon: DeleteFilled },
		],
	},
	{
		index: "/dashboard/system",
		title: "系统管理",
		icon: Setting,
		children: [{ index: "/dashboard/system", title: "系统管理", icon: Setting }],
	},
]

// region list data
export const regionData = [
	{ name: "中国", value: 1 },
	{ name: "日本", value: 2 },
	{ name: "美国", value: 3 },
	{ name: "英国", value: 4 },
	{ name: "法国", value: 5 },
	{ name: "德国", value: 6 },
	{ name: "新加坡", value: 7 },
	{ name: "印度", value: 8 },
	{ name: "澳大利亚", value: 9 },
	{ name: "韩国", value: 10 },
	{ name: "其他", value: 11 },
]

// An array of different marketing campaign budget range, currency unit is RMB
export const budgetRangeRMB = [
	"0-5000",
	"5001-10000",
	"10001-50000",
	"50001-100000",
	"100001-500000",
	"500001-1000000",
	"1000000+",
]

// An array of different marketing campaign budget range, currency unit is USD
export const budgetRangeUSD = [
	"0-1000",
	"1001-5000",
	"5001-10000",
	"10001-50000",
	"50001-100000",
	"100000+",
]
// An array of different marketing campaign budget range, currency unit is JPY
export const budgetRangeJPY = ["0-100000", "100001-1000000", "1000001-10000000", "10000000+"]

// The number of items per page by default
export const PAGE_SIZE = 10
