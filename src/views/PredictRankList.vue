<template>
    <div>
        <div id="head">
            <router-link to="/index">
                <img src="../../static/img/logo.svg" class="logo">
            </router-link>
        </div>
        <div id="content">
            <h1 class="title">
                项目关注榜
            </h1>
            <el-table
                fit
                stripe
                :data="predictList">
                <el-table-column
                    width="300"
                    label="排名"
                    align="center">
                    <template slot-scope="scope">
                        <div v-if="currentPage === 1 && scope.$index < 3">
                            <img class="inline-img" :src="`static/img/rank${scope.$index+1}.svg`">
                        </div>
                        <div v-else>
                            {{(scope.$index + 1) + (currentPage - 1) * currentNum}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    width="300"
                    label="项目"
                    align="center">
                    <template slot-scope="scope">
                       <el-button type="text" @click="goDetail(scope.row['currencyId'])">
                           <span style="text-transform: capitalize">{{scope.row['currencyId']}}</span>
                       </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="预测量"
                    prop="nums"
                    align="left">
                </el-table-column>
            </el-table>
            <div class="pagination el-pagination is-background">
                <button class="btn-prev" :class="{'disabled': currentPage === 1}" @click="last">
                    <i class="el-icon el-icon-arrow-left"></i>
                </button>
                <span>{{currentPage}}</span>
                <button class="btn-prev" @click="next">
                    <i class="el-icon el-icon-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import net_util from '../assets/js/net_utils'
    import config from '../assets/js/config'
    import utils from '../assets/js/utils'
    import consts from '../assets/js/consts'

    export default {
        data: function () {
            return {
                predictList: [],
                currentPage: 1,
                currentNum: 10,
            }
        },
        methods:{
            getPredictList(page, num){
                let url = config.JAVABASEDOMAIN + '/predict/rank/list'
                let data = {
                    page: page,
                    num: num
                }
                let succ = res => {
                    if (!res.errorMsg) {
                        if(res.result.length === 0){
                            this.$message({type: 'info', message: '已是最后一页！'})
                            return null
                        }else{
                            this.currentPage = page;
                            this.currentNum = num
                            this.predictList = res.result
                        }
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: '获取列表失败！'})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            next(){
                this.getPredictList(this.currentPage + 1, this.currentNum)
            },
            last(){
                if(this.currentPage === 1){
                    return null
                }else{
                    this.getPredictList(this.currentPage - 1, this.currentNum)
                }
            },
            goDetail(id){
                this.$router.push({path: '/predictDetail', query:{id: id}})
            }
        },
        mounted(){
            this.getPredictList(this.currentPage, this.currentNum)
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .title
        margin-bottom 30px
    .inline-img
        position absolute
        height 30px
        width 30px
        left 50%
        top 50%
        transform translate(-50%, -50%)
    .pagination
        margin-top 20px
        button
            &:hover
                color #409EFF
        span
            text-align center
</style>
