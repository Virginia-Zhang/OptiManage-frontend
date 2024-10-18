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
                <el-form :model="form" label-width="80px" :rules="rules" ref="ruleFormRef">
                    <el-form-item label="账号" prop="loginAct">
                        <el-input v-model="form.loginAct" />
                    </el-form-item>
                    <el-form-item label="密码" prop="loginPwd">
                        <el-input v-model="form.loginPwd" type="password" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit(ruleFormRef)" class="login-button">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="form.rememberMe">记住我</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import request from '../http/httpRequest'

const form = ref({
    loginAct: '',
    loginPwd: '',
    rememberMe: false
})

const ruleFormRef = ref(null)

const rules = {
    loginAct: [
        { required: true, message: '请输入账号', trigger: 'blur' },
    ],
    loginPwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
    ]
}

// login submit
const onSubmit = (formEl) => {
    if (!formEl) return
    formEl.validate(async valid => {
        if (valid) {
            const res = await request.post('/api/login', form.value)
        }
    })
    
}


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