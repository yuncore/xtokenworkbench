<template>
    <div>
        <div id="head">
            <router-link :to="{name: 'currencyList', query: {page: this.$route.query.page}}">
                <img src="../../static/img/logo.svg" class="logo">
            </router-link>
        </div>
        <div id="content">
            <el-row :gutter="20">
                <el-col :span="8">
                    <h1>Keyword</h1>
                    <div class="card keyword">
                        <el-table :data="keywords"
                                  v-loading="keywordsLoading"
                                  element-loading-text="数据加载中"
                                  element-loading-spinner="el-icon-loading"
                                  element-loading-background="rgba(0, 0, 0, 0.8)">
                            <el-table-column label="关键词" align="center">
                                <template slot-scope="scope">
                                    <div @click="toKeywordStat(scope.row)" class="btn">
                                        {{scope.row['keyword']}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="提及人数" align="center">
                                <template slot-scope="scope">
                                    {{scope.row['user_count']}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="16">
                    <h1>Kol</h1>
                    <div class="card kol">
                        <el-table :data="kolList"
                                  v-loading="kolLoading"
                                  element-loading-text="数据加载中"
                                  element-loading-spinner="el-icon-loading"
                                  element-loading-background="rgba(0, 0, 0, 0.8)">
                            <el-table-column align="center" width="55">
                                <template slot-scope="scope">
                                    <div @click="userNameClick(scope.row)">
                                        <img :src="subList.indexOf(scope.row['user_name']) > -1 ?'static/img/star_active.png' : 'static/img/star_not_active.png'">
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Name" align="center">
                                <template slot-scope="scope">
                                    <div @click="toUserDetail(scope.row)" class="btn">
                                        {{scope.row['user_name']}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Activity" align="center">
                                <template slot-scope="scope">
                                    {{scope.row['activity']}}
                                </template>
                            </el-table-column>
                            <el-table-column label="Grade" align="center">
                                <template slot-scope="scope">
                                    {{scope.row['grade']}}
                                </template>
                            </el-table-column>
                            <el-table-column label="Comment" align="center">
                                <template slot-scope="scope">
                                    {{scope.row['num']}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="page-wrap">
                        <el-pagination
                            background
                            layout="total, prev, pager, next, jumper"
                            style="display: inline-block; vertical-align: middle"
                            :total="KOLCount"
                            :current-page="KOLCurrentPage"
                            :page-size=KOLCurrentNum
                            @current-change="handleKOLPageChange">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import net_util from '../assets/js/net_utils'
    import config from '../assets/js/config'
    import utils from '../assets/js/utils'
    import consts from '../assets/js/consts'
    import echarts from 'echarts'

    export default {
        data: function () {
            return {
                keywords: [],
                kolList: [],
                subList: [],
                KOLCount: 0,
                KOLCurrentPage: 0,
                KOLCurrentNum: 10,
                keywordsLoading: false,
                kolLoading: false,
                SITETYPE: consts.SITETYPE
            }
        },
        methods: {
            userNameClick(row){
                if (this.subList.indexOf(row.user_name) > -1) {
                    this.$alert(`确定取消对${row.user_name}的关注？`, '取消关注', {
                        confirmButtonText: '确定'
                    }).then(() => {
                        this.unSubUser(row.user_name)
                    })
                } else {
                    this.$alert(`确定将${row.user_name}加入我的关注？`, '关注用户', {
                        confirmButtonText: '确定'
                    }).then(() => {
                        this.subUser(row.user_name)
                    })
                }
            },
            getSubList(){
                let url = config.JAVABASEDOMAIN + '/subs/person/list'
                let succ = res => {
                    if (!res.errorMsg) {
                        let list = []
                        if (res.result && res.result.length > 0) {
                            res.result.forEach(item => {
                                if(item['type'] === 1){
                                    list.push(item['person'])
                                }
                            })
                        }
                        this.subList = list
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: '获取订阅列表失败'})
                }
                net_util.getRequest(url, {}, succ, fail)
            },
            unSubUser(userName){
                let url = config.JAVABASEDOMAIN + '/subs/person/del'
                let data = {type: this.SITETYPE.btt, person: userName}
                let succ = res => {
                    if (!res.errorMsg) {
                        this.getSubList()
                        this.$message({type: 'success', message: '取消成功'})
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: '连接失败'})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            subUser(userName){
                let url = config.JAVABASEDOMAIN + '/subs/person/add'
                let data = {type: this.SITETYPE.btt, person: userName}
                let succ = res => {
                    if (!res.errorMsg) {
                        this.getSubList()
                        this.$message({type: 'success', message: '关注成功'})
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: '连接失败'})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            getKeywords (params, keyword) {
                this.keywordsLoading = true
                let url = config.PYTHONBASEDOMAIN + `/stat/keywords`
                let data = {
                }
                let succ = res => {
                    this.keywordsLoading = false
                    this.keywords = res
                }
                let fail = res => {
                    this.keywordsLoading = false
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            getKolList(page=1, num=10){
                this.kolLoading = true
                let url = config.PYTHONBASEDOMAIN + `/bitcointalk/kol/list`
                let data = {
                    page: page,
                    num: num
                }
                let succ = res => {
                    this.kolLoading = false
                    this.kolList = res['data']
                    this.KOLCount = res['count']
                    this.KOLCurrentNum = num
                    this.KOLCurrentPage = page
                }
                let fail = res => {
                    this.kolLoading = false
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            handleKOLPageChange(val){
                this.getKolList(val)
            },
            toUserDetail(row){
                let query = {
                    user_id: row['user_id'],
                    user_name: row['user_name']
                }
                this.$router.push({path: '/btt/user/history', query: query})
            },
            toKeywordStat(row){
                let query = {
                    keyword: row['keyword']
                }
                this.$router.push({path: '/keyword', query: query})
            }
        },
        mounted(){
            this.getKeywords()
            this.$nextTick(() => {
                this.getKolList()
                this.getSubList()
            })
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .card
        padding: 0

    .page-wrap
        margin 10px
        text-align right

    .keyword .btn
        cursor pointer
        color #409EFF

    .kol .btn
        cursor pointer
        color #409EFF

</style>
