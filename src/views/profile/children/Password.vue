<template>
    <div id="passwordManager">
        <h3>Change password</h3>
        <p>Manage your account password.</p>
        <el-form :model="changePwdForm"
                 :rules="rules"
                 ref="changePwdForm"
                 status-icon
                 label-position="top"
                 class="change-password-form">
            <el-form-item label="Old password" prop="oldPwd">
                <el-input v-model.trim="changePwdForm.oldPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="New password" prop="newPwd">
                <el-input v-model.trim="changePwdForm.newPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="Confirm new password" prop="confirmNewPwd">
                <el-input v-model.trim="changePwdForm.confirmNewPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item class="operate-button-group">
                <el-button type="primary" @click="submitForm('changePwdForm', updatePassword)">
                    Update Password
                </el-button>
                <el-button @click="resetForm('changePwdForm')">
                    Reset
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import net_util from '../../../assets/js/net_utils'
    import config from '../../../assets/js/config'

    export default {
        name: "Password",
        data(){
            let validateConfirmPwd = (rule, value, callback) => {
                if(value !== this.changePwdForm.newPwd){
                    callback(new Error('Password confirmation doesn\'t match the password.'))
                }else{
                    callback()
                }
            };
            return {
                changePwdForm:{
                    oldPwd: '',
                    newPwd: '',
                    confirmNewPwd: ''
                },
                rules: {
                    oldPwd: [
                        {required: true, message: 'Old password is required.'}
                    ],
                    newPwd: [
                        {required: true, message: 'New password is required.'},
                        { min: 6, max: 16, message: 'Password is limited in 6 to 16 characters.', trigger: 'blur' }
                    ],
                    confirmNewPwd: [
                        {required: true, message: 'Confirm New Password is required.'},
                        {validator: validateConfirmPwd, trigger: 'blur'}
                    ],
                }
            }
        },
        methods:{
            updatePassword(){
                let url = config.JAVABASEDOMAIN + `/user/update/pwd`;
                let data = {
                    oldPwd: this.changePwdForm.oldPwd,
                    newPwd: this.changePwdForm.newPwd
                };
                let succ = res => {
                    if (!res.errorMsg) {
                        this.$message({type: 'success', message: this.$t('success')});
                        resetForm('changePwdForm')
                    }
                };
                let fail = res => {
                    this.$message({type: 'error', message: this.$t('error')})
                };
                net_util.getRequest(url, data, succ, fail)
            },
            submitForm(name, cb){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        cb()
                    } else {
                        return false;
                    }
                });
            },
            resetForm(name){
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    #passwordManager
        h3
            margin 0
            font-size 30px
            font-weight normal
        p
            margin-top 5px
            margin-bottom 20px
            font-size 14px
        .operate-button-group
            margin-top 40px
</style>
