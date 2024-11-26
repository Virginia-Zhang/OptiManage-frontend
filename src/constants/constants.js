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
		index: "/dashboard/clues",
		title: "线索管理",
		icon: List,
		children: [{ index: "/dashboard/clues", title: "线索管理", icon: List }],
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

// Marketing clue state options
export const clueStateOptions = [
	{ name: "已转客户", id: 1 },
	{ name: "虚假线索", id: 2 },
	{ name: "需要条件", id: 3 },
	{ name: "将来联系", id: 4 },
	{ name: "丢失线索", id: 5 },
	{ name: "试图联系", id: 6 },
	{ name: "未联系", id: 7 },
	{ name: "已联系", id: 8 },
]

// Marketing clue source options
export const clueSourceOptions = [
	{ name: "易车网", id: 1 },
	{ name: "员工介绍", id: 2 },
	{ name: "官方网站", id: 3 },
	{ name: "公众号", id: 4 },
	{ name: "门店参观", id: 5 },
	{ name: "懂车帝", id: 6 },
	{ name: "朋友圈", id: 7 },
	{ name: "合作伙伴", id: 8 },
	{ name: "地图", id: 9 },
	{ name: "视频直播", id: 10 },
	{ name: "网络广告", id: 11 },
	{ name: "汽车之家", id: 12 },
	{ name: "车展会", id: 13 },
	{ name: "知乎", id: 14 },
]

// Customer gender options
export const genderOptions = [
	{ name: "男", value: 1 },
	{ name: "女", value: 2 },
]

// Customer need_loan options
export const needLoanOptions = [
	{ name: "不需要", value: 0 },
	{ name: "需要", value: 1 },
]

// Customer intention_state options
export const intentionStateOptions = [
	{ name: "无意向", value: 0 },
	{ name: "有意向", value: 1 },
	{ name: "意向不明", value: 2 },
]
