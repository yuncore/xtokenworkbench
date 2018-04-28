<template>
    <div>
        <div id="head">
            <router-link :to="{name: 'currencyList', query: {page: this.$route.query.page}}">
                <img src="../../static/img/logo.svg" class="logo">
            </router-link>
        </div>
        <div id="content">
            <div class="card"
                 v-loading="loading"
                 element-loading-text="数据加载中"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-row>
                    <el-col :span="8">
                        <ul class="kw">
                            <li :class="{active: activeKeywordIndex === index}"
                                @click="keywordClick(index)"
                                v-for="(item, index) in keywords">
                                {{item[0]}}
                            </li>
                        </ul>
                    </el-col>
                    <el-col :span="16">
                        <div ref="chart2" style="width: 80%; height: 600px; margin: auto"></div>
                    </el-col>
                </el-row>
            </div>
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
                sr_name: "NEO",
                keywords: [],
                activeKeywordIndex: -1,
                stats: [],
                loading: false
            }
        },
        watch:{
            activeKeywordIndex: function (val) {
                this.drawKeywordStatChart(val)
            }
        },
        methods: {
            keywordClick(index){
                this.activeKeywordIndex = index
            },
            getCurrencyRelatedKeywords(){
                let url = config.PYTHONBASEDOMAIN + `/stat/reddit/related/keywords`
                let data = {
                    sr_name: this.sr_name
                }
                this.loading = true
                net_util.getRequest(url, data, res => {
                    this.loading = false
                    this.keywords = res
                    this.activeKeywordIndex = 0
                }, res => {
                    this.loading = false
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                })
            },
            drawKeywordStatChart(val){
                let link= JSON.parse(this.keywords[val][2])
                let comment = JSON.parse(this.keywords[val][3])
                let link_data = link.map((item, index) => {
                   return {
                       name: this.getSmpFormatDateByLong(item[0]),
                       value: item
                   }
                })
                let comment_data = comment.map((item, index) => {
                    return {
                        name: this.getSmpFormatDateByLong(item[0]),
                        value: item
                    }
                })
                let myChart = echarts.init(this.$refs.chart2)
                myChart.setOption({
                    legend: {
                        data:['link', 'comment']
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox: {
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '8%',
                        containLabel: true
                    },
                    dataZoom: [
                        {
                            show: true,
                            start: 0,
                            end: 100
                        },
                        {
                            type: 'inside',
                            start: 0,
                            end: 100
                        },
                    ],
                    xAxis : [
                        {
                            type : 'time',
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'link',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            data: link_data
                        },
                        {
                            name:'comment',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            data: comment_data
                        }
                    ]
                })
            },
            getSmpFormatDateByLong: utils.getSmpFormatDateByLong,
        },
        mounted(){
            this.getCurrencyRelatedKeywords()
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .kw
        .active
            color #409EFF
            background-color #e4e4e4
        li
            cursor pointer
            line-height 25px
            margin 5px
            padding 5px
            border-radius 5px
            &:hover
                color #409EFF

</style>
