<template>
    <div>
        <div id="head">
            <router-link :to="{name: 'currencyList', query: {page: this.$route.query.page}}">
                <img src="../../../static/img/logo.svg" class="logo">
            </router-link>
        </div>
        <div id="content">
            <div class="card">
                <div class="collapse-head">
                    <h3>分组管理</h3>
                </div>
                <div class="collapse-body"
                     v-loading="loading"
                     :element-loading-text="$t('loading')"
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0, 0, 0, 0.8)"
                     header-cell-class-name='currency-table-head-cell'>
                    <div class="add-tag">
                        <el-form :inline="true" :model="groupForm" label-width="80px">
                            <el-form-item label="添加分组">
                                <el-input v-model.trim="groupForm.groupName" placeholder="分组名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="text" @click="addGroup">{{$t('create')}}</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="info-tag">
                        <ul>
                            <li v-for="group in groups">
                                <img src="../../../static/img/red_error.svg" @click="deleteGroup(group)">
                                {{group['groupName']}}
                            </li>
                            <div style="display: none; clear: both"></div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import net_util from '../../assets/js/net_utils'
    import config from '../../assets/js/config'
    import utils from '../../assets/js/utils'
    import consts from '../../assets/js/consts'

    export default {
        data: function () {
            return {
                groupForm: {
                    groupName: ''
                },
                groups: [],
                loading: false
            }
        },
        methods:{
            addGroup(){
                if(this.groupForm.groupName === ''){
                    this.$message({type: 'warning', message: this.$t('page.tagManage.a1')})
                    return false
                }
                let url = config.JAVABASEDOMAIN + `/pros/group/create`;
                let data = {
                    groupName: this.groupForm.groupName
                };
                let succ = res => {
                    if (!res.errorMsg) {
                        this.loading = false
                        this.$message({type: 'success', message: this.$t('success')})
                        this.getGroupList()
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.loading = false
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                this.loading = true
                net_util.getRequest(url, data, succ, fail)
            },
            deleteGroup(group){
                let url = config.JAVABASEDOMAIN + `/pros/group/del`
                let data = {
                    groupId: group['id']
                };
                let succ = res => {
                    if (!res.errorMsg) {
                        this.loading = false
                        this.$message({type: 'success', message: this.$t('success')})
                        this.getGroupList()
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.loading = false
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                this.loading = true
                net_util.getRequest(url, data, succ, fail)
            },
            getGroupList(){
                let url = config.JAVABASEDOMAIN + `/pros/group/list`
                let succ = res => {
                    if (!res.errorMsg) {
                        this.loading = false
                        this.groups = res.result
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.loading = false
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                this.loading = true
                net_util.getRequest(url, {}, succ, fail)
            },
        },
        mounted(){
            this.getGroupList()
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .card
        padding 0
        .collapse-head
            height 72px
            background-color #fafafa
            h3
                line-height 72px
                padding-left 20px
        .collapse-body
            min-height 200px
            padding 20px
            .info-tag
                ul
                    border-top 1px solid #E4E7ED
                    margin-top 10px
                    li
                        position relative
                        display inline-block
                        padding 0 20px
                        margin-right 40px
                        margin-top 40px
                        line-height 32px
                        background rgba(42,154,225,0.05)
                        border 1px solid #2a9ae1
                        border-radius 5px
                        color #2a9ae1
                        font-size 13px
                        min-width 120px
                        text-align center
                        &:hover
                            img
                                display block
                        img
                            display none
                            position absolute
                            top: -10px
                            right -10px
                            width 20px
                            height 20px
                            cursor pointer
                            &:hover
                                opacity 0.8

</style>
