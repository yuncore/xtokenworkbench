<template>
    <div id="apiKey">
        <h2>API Key</h2>
        <div class="key-list">
            <el-button @click="apiFormVisible = !apiFormVisible">add</el-button>
        </div>
        <transition name="el-zoom-in-top">
            <el-form v-show="apiFormVisible" :model="APIForm" ref="APIForm" label-width="100px" class="api-form">
                <el-form-item label="Name" prop="name">
                    <el-input v-model="APIForm.name"></el-input>
                </el-form-item>
                <el-form-item label="API Key" prop="apiKey" required>
                    <el-input v-model="APIForm.apiKey" required></el-input>
                </el-form-item>
                <el-form-item label="Secret Key" prop="secretKey" required>
                    <el-input v-model="APIForm.secretKey"></el-input>
                </el-form-item>
                <el-form-item label="Exchange" prop="exchange" required>
                    <el-select v-model="APIForm.exchange" placeholder="">
                        <el-option
                            v-for="item in exchangeList"
                            :key="item.id"
                            :label="item.bourseName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('APIForm', addAPIKey)">Save</el-button>
                    <el-button @click="resetForm('APIForm')">Reset</el-button>
                </el-form-item>
            </el-form>
        </transition>
    </div>
</template>

<script>
    import net_util from '../../../assets/js/net_utils'
    import config from '../../../assets/js/config'
    import utils from '../../../assets/js/utils'

    export default {
        name: "APIKey",
        data(){
            return {
                apiFormVisible: false,
                APIForm: {
                    name: '',
                    apiKey: '',
                    secretKey: '',
                    exchange: '',
                },
                exchangeList: []
            }
        },
        methods:{
            getExchangeList(){
                let url = config.JAVABASEDOMAIN + `/user/bourse/list`;
                let succ = res => {
                    if (!res.errorMsg) {
                        this.exchangeList = res.result
                    }
                };
                let fail = res => {

                };
                net_util.getRequest(url, {}, succ, fail)
            },
            addAPIKey(){
                let url = config.JAVABASEDOMAIN + `/user/bourse/bind`;
                let data = {
                    type: this.APIForm.exchange,
                    key: this.APIForm.apiKey,
                    secret: this.APIForm.secretKey,
                    name: this.APIForm.name
                };
                let succ = res => {
                    if (!res.errorMsg) {
                        this.$message({type: 'success', message: this.$t('success')})
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
        },
        mounted(){
            this.getExchangeList()
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
