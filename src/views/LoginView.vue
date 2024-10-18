<template>
     <!-- 请用element-plus帮我写一个左右布局的登录页面，左侧放图片，右侧放登录表单、按钮、记住我复选框 -->
    <div class="login-container">
        <div class="login-left">
            <img src="../assets/loginBox.svg" alt="OptiManage">
            <div class="login-text">欢迎使用优客易CRM管理系统</div>
        </div>
        <div class="login-right">
            <h2 class="login-title">欢迎登录</h2>
            <div class="login-form">
                <el-form :model="form" label-width="80px">
                    <el-form-item label="账号">
                        <el-input v-model="form.username" />
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.password" type="password" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" class="login-button">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="checked">记住我</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
    username: '',
    password: ''
})

const onSubmit = () => {
    console.log('submit!')
}

const checked = ref(false)


</script>

<style scoped lang="scss">
.login-container {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;

    .login-left {
        width: 40%;
        height: 100%;
        background-color: #409eff;
        text-align: center;

        img {
            width: 100%;
            height: 60%;
        }

        .login-text {
            color: #fff;
            font-size: 24px;
            text-align: center;
            margin-top: 20px;
        }
    }

    .login-right {
        width: 60%;
        height: 100%;
        background-color: #f0f2f5;

        .login-title {
            text-align: center;
            margin: 100px 0 30px 0;
        }

        .login-form {
            width: 500px;
            margin: 0 auto;

            .login-button {
                width: 100%;
            }
        }
    }
}
</style>