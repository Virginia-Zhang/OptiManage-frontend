/**
 * @description Project environment configuration
 */
// environment variables
const ENV = import.meta.env.MODE || "prod"

const EnvConfig = {
	// development environment
	dev: {
		baseApi: "/api",
	},
	// test environment
	test: {
		baseApi: "//test.futureFront.com/api",
	},
	// production environment
	prod: {
		baseApi: "//futureFront.com/api",
	},
}

export default {
	ENV,
	// The namespace of this project in local/session storage
	namespace: "OptiManage",
	...EnvConfig[ENV],
}
