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
		children: [
			{ index: "/dashboard/marketing", title: "市场活动", icon: PieChart },
			{ index: "/dashboard/marketing-recycle", title: "回收站", icon: DeleteFilled },
		],
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

// region details
// language: 1-English, 2-Chinese, 3-Japanese
export const regionData = [
	{
		id: 1,
		name: "中国",
		currencyUnit: "RMB",
		language: 2,
	},
	{
		id: 2,
		name: "日本",
		currencyUnit: "JPY",
		language: 3,
	},
	{
		id: 3,
		name: "美国",
		currencyUnit: "USD",
		language: 1,
	},
	{
		id: 4,
		name: "其他",
		currencyUnit: "USD",
		language: 1,
	},
]

// An array of different marketing campaign budget range, currency unit is RMB
export const budgetRangeRMB = [
	"0-5,000",
	"5,000-10,000",
	"10,000-50,000",
	"50,000-100,000",
	"100,000-500,000",
	"500,000-1,000,000",
	"1,000,000+",
]

// An array of different marketing campaign budget range, currency unit is USD
export const budgetRangeUSD = [
	"0-1,000",
	"1,000-5,000",
	"5,000-10,000",
	"10,000-50,000",
	"50,000-100,000",
	"100,000+",
]
// An array of different marketing campaign budget range, currency unit is JPY
export const budgetRangeJPY = [
	"0-100,000",
	"100,000-1,000,000",
	"1,000,000-1,000,0000",
	"10,000,000+",
]

// The number of items per page by default
export const PAGE_SIZE = 10
