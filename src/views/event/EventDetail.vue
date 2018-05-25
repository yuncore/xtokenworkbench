<template>
    <div>
        <div class="container">
            <div>
                <div style="width: 400px; float: right">
                    <div class="card stat-card">
                        <div class="head">
                            <div class="left">
                                <h2>{{eventType[eventInfo.type]}}发布投票情况</h2>
                            </div>
                            <div class="right">
                                <p><span>{{(statResult.all0Num + statResult.all1Num) || 0}}</span>票</p>
                                <p>{{timeNowStr}}</p>
                            </div>
                        </div>
                        <div class="content">
                            <p>
                                <img src="../../../static/img/chart.svg"/>
                                <span v-for="(item, index) in statType"
                                      v-if="item.show"
                                      :class='{active: statTypeActiveIndex == index}'
                                      @click="statTypeBtnClick(item.type, index)">
                                    {{item.label}}
                                </span>
                            </p>
                            <div ref="statChart" class="stat-chart">
                            </div>
                            <div class="divider">
                                <div class="line"></div>
                                <div class="dot"></div>
                                <div class="dot" style="right: 0"></div>
                            </div>
                        </div>
                        <div class="foot">
                            <span class="stat-span">{{voteState.text}}</span>
                            <div style="float: right; display: none">
                                <span class="stat-span">官方判断</span>
                                <span class="result-text">涨</span>
                            </div>
                        </div>
                    </div>
                    <div class="card time-select-card">
                        <p><img src="../../../static/img/clock.png"/>投票时间</p>
                        <div class="time-field">
                            <span class="title">开始时间:</span>
                            <span class="text" v-show="!startTimePickerShow">
                                {{eventInfo.voteEndTime ? getSmpFormatDateByLong(eventInfo.voteStartTime) : '- -'}}
                            </span>
                            <i class="el-icon-edit-outline"
                               v-show="!startTimePickerShow"
                               v-if="voteState.type == 0"
                               @click="changeTime('start')"></i>
                            <el-date-picker
                                ref="startTimePicker"
                                v-model="timeSelect"
                                v-show="startTimePickerShow"
                                type="datetime"
                                placeholder="选择日期时间"
                                align="right"
                                size="mini"
                                @blur="onStartTimePickerBlur"
                                style="width: 200px">
                            </el-date-picker>
                            <div style="float: right">
                                <span class="btn"
                                      v-if="voteState.type == 0"
                                      @click="startVote">
                                    立即开始
                                </span>
                            </div>
                        </div>
                        <div class="time-field">
                            <span class="title">结束时间:</span>
                            <span class="text" v-show="!endTimePickerShow">
                                {{eventInfo.voteEndTime ? getSmpFormatDateByLong(eventInfo.voteEndTime) : '- -'}}
                            </span>
                            <i class="el-icon-edit-outline"
                               v-show="!endTimePickerShow"
                               v-if="voteState.type == 0 || voteState.type == 1"
                               @click="changeTime('end')"></i>
                            <el-date-picker
                                ref="endTimePicker"
                                v-model="timeSelect"
                                v-show="endTimePickerShow"
                                type="datetime"
                                placeholder="选择日期时间"
                                align="right"
                                size="mini"
                                @blur="onEndTimePickerBlur"
                                style="width: 200px">
                            </el-date-picker>
                            <div style="float: right">
                                <span class="btn"
                                      v-if="voteState.type == 1"
                                      @click="stopVote">
                                    立即结束
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-right: 420px">
                    <div class="card event-card">
                        <div class="head">
                            <p class="time">Sandra Burns · {{getDateDiff(eventInfo.pusTime)}}</p>
                            <h2><span>{{eventType[eventInfo.type]}})</span>{{eventInfo.title}}</h2>
                        </div>
                        <div v-html="content" class="content">
                        </div>
                        <div class="foot">

                        </div>
                    </div>
                    <div class="card relation-currency-card">
                        <div class="head">
                            <p>关联项目</p>
                        </div>
                        <ul class="coin-select">
                            <li v-for="(item, index) in relationCoinList" :key="index">
                                <img :src="'static/img/coinLogos/'+ item.id + '.png'">
                                <p>{{item['name']}}</p>
                                <p>{{item['symbol']}}</p>
                            </li>
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
    import base64 from '../../assets/js/base64'
    import echarts from 'echarts'

    export default {
        data: function () {
            return {
                eventInfo: '',
                content: '',
                //{type: 0, text: '未开始'}, {type: 1, text: '进行中'}, {type: 2, text: '已结束'}
                voteState: '',
                statType: [
                    {
                        label: '看涨看跌', type: 0, active: false, show: false
                    },
                    {
                        label: '看真看假', type: 1, active: false, show: false
                    }
                ],
                statResult: '',
                relationCoinList: [],
                statTypeActiveIndex: null,
                hasUpOrDown: false,
                hasTrueOrFalse: false,
                timeNowStr: '',
                timeSelect: '',
                startTimePickerShow: false,
                endTimePickerShow: false,
                eventType: consts.eventType
            }
        },
        methods: {
            /**
             * type : 0 获取判断涨跌的投票统计
             * type : 1 获取判断真假的投票统计
             */
            getVoteStat (type, eventId, index) {
                let url = config.JAVABASEDOMAIN + '/event/site/vote/stat'
                let data = {
                    eventId: eventId,
                    type: type
                }
                let succ = res => {
                    if (!res.errorMsg) {
                        this.statResult = res.result
                        this.drawStatChart(res.result, type)
                        this.statTypeActiveIndex = index
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: '连接失败'})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            getCoinInfo(str){
                let url = config.PYTHONBASEDOMAIN + '/currency'
                let succ = res => {
                    this.relationCoinList = res
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                }
                net_util.getRequest(url, {ids: str}, succ, fail)
            },
            stopVote () {
                this.updateEventTime('end', new Date())
            },
            startVote () {
                this.updateEventTime('start', new Date())
            },
            changeTime (type) {
                if (type === 'start') {
                    this.startTimePickerShow = true
                    this.timeSelect = this.eventInfo.voteStartTime
                    this.$nextTick(function () {
                        let p = this.$refs.startTimePicker
                        p.focus()
                    })
                } else {
                    this.endTimePickerShow = true
                    this.timeSelect = this.eventInfo.voteEndTime
                    this.$nextTick(function () {
                        let p = this.$refs.endTimePicker
                        p.focus()
                    })
                }
            },
            onStartTimePickerBlur () {
                this.updateEventTime('start', this.timeSelect)
            },
            onEndTimePickerBlur () {
                this.updateEventTime('end', this.timeSelect)
            },
            updateEventTime (type, value) {
                let confirmText
                let data = {
                    eventId: this.eventInfo.id
                }
                if (type === 'start') {
                    confirmText = '此操作将修改事件的开始时间, 是否继续?'
                    data.startTime = value.getTime()
                    this.startTimePickerShow = false
                } else {
                    confirmText = '此操作将修改事件的结束时间, 是否继续?'
                    data.endTime = value.getTime()
                    this.endTimePickerShow = false
                }
                this.$confirm(confirmText, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    let url = config.JAVABASEDOMAIN + '/event/site/vote/update/time'
                    let succ = res => {
                        if (!res.errorMsg) {
                            this.init(this.eventInfo.id)
                            this.$message({type: 'success', message: '操作成功!'})
                        } else {
                            this.$message({type: 'error', message: res.errorMsg})
                        }
                    }
                    let fail = res => {
                        this.$message({type: 'error', message: '连接失败'})
                    }
                    net_util.getRequest(url, data, succ, fail)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })

            },
            drawStatChart (data, type) {
                let textObj = []
                if (type === 1) {
                    textObj[0] = '看假'
                    textObj[1] = '看真'
                } else {
                    textObj[0] = '看跌'
                    textObj[1] = '看涨'
                }
                let myChart = echarts.init(this.$refs.statChart)
                let data0 = [data.day0Num, data.week0Num, data.all0Num]
                let data1 = [data.day1Num, data.week1Num, data.all1Num]
                let dataAll = [
                    {value: data.all0Num, name: textObj[0], itemStyle: {normal: {color: '#8dd93a'}}},
                    {value: data.all1Num, name: textObj[1], itemStyle: {normal: {color: '#4a90e2'}}}
                ]
                myChart.clear()
                myChart.setOption({
                    tooltip: {},
                    legend: {
                        data: textObj,
                        orient: 'vertical',
                        x: 'left',
                    },
                    grid: [{
                        right: 0,
                        width: '250'
                    }],
                    xAxis: {
                        data: ['本日', '本周', '全部'],
                        inverse: true,
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {
                            margin: 30,
                            textStyle: {
                                fontSize: 14
                            }
                        },
                    },
                    yAxis: {
                        splitLine: {show: false},
                        axisLabel: {show: false},
                        axisTick: {show: false},
                        axisLine: {show: false}
                    },
                    series: [
                        {
                            name: textObj[0],
                            type: 'bar',
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 5,
                                    color: '#8dd93a'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: data0
                        }, {
                            name: textObj[1],
                            type: 'bar',
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 5,
                                    color: '#4a90e2'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: data1
                        }, {
                            type: 'pie',
                            center: ['15%', '50%'],
                            radius: ['40%', '30%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '18'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: dataAll
                        }]
                })
            },
            statTypeBtnClick (type, index) {
                if (index !== this.statTypeActiveIndex) {
                    this.getVoteStat(type, this.eventInfo.id, index)
                }
            },
            calcVoteState () {
                let state = [
                    {type: 0, text: '未开始'},
                    {type: 1, text: '进行中'},
                    {type: 2, text: '已结束'}
                ]
                let now = new Date()
                let start = this.eventInfo.voteStartTime
                let end = this.eventInfo.voteEndTime
                if (now < start) {
                    this.voteState = state[0]
                } else if (now > end) {
                    this.voteState = state[2]
                } else {
                    this.voteState = state[1]
                }
            },
            init(id){
                let url = config.JAVABASEDOMAIN + '/event/site/detail'
                let data = {
                    eventId: id,
                }
                let succ = res => {
                    if (!res.errorMsg) {
                        this.eventInfo = res.result
                        this.calcVoteState()
                        this.getCoinInfo(JSON.stringify(this.eventInfo.proList))
                        let now = new Date()
                        this.timeNowStr = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日'
                        if (this.eventInfo.roseFall === 1) {
                            this.statType[0].show = true
                        }
                        if (this.eventInfo.trueFalse === 1) {
                            this.statType[1].show = true
                        }
                        for (let i = 0; i < this.statType.length; i++) {
                            if (this.statType[i].show === true) {
                                this.getVoteStat(this.statType[i].type, id, i)
                                break
                            }
                        }
                        let urlPath = this.eventInfo.urlPath
                        if(urlPath && urlPath.trim() !== ''){
                            this.getSameUrlBodyContent(config.FILEDOMAIN+urlPath).then(data => {
                                this.content = data
                            })
                        }else{
                            this.content = '<div>无法获取事件内容</div>'
                        }
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: '连接失败'})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            getSmpFormatDateByLong: utils.getSmpFormatDateByLong,
            getDateDiff: utils.getDateDiff,
            getSameUrlBodyContent: utils.getSameUrlBodyContent
        },
        mounted () {
            let eventId = this.$route.query.id
            this.init(eventId)
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../static/css/base.styl"

    .event-card
        height 400px
        padding 35px 50px 15px 50px
        margin-top 0
        background-image url("../../../static/img/blue-angle.png")
        background-position top left
        background-repeat no-repeat
        .head
            height 100px
            p
                font-size 14px
                color #38435b
                margin 10px 0
            h3
                color #38435b
        .content
            overflow scroll
            height 280px

    .relation-currency-card
        height 220px
        p
            font-size 14px
            color #4a90e2

    .coin-select{
        margin-top: 20px;
    }

    .coin-select li{
        position: relative;
        text-align: center;
        display: inline-block;
        width: 150px;
        height: 150px;
        margin-left: 20px;
    }

    .coin-select li:first-child{
        margin-left: 0;
    }

    .coin-select li img{
        height: 42px;
        width: 42px;
        margin: 16px auto;
    }

    .coin-select li p{
        color: #409EFF;
        font-size:14px;
        line-height: 25px;
    }

    .coin-select i{
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 20px;
        cursor: pointer;
    }

    .coin-select i:hover{
        color: #409EFF;
    }

    .stat-card
        height 500px
        padding 0
        margin-top 0
        .head
            height 100px
            background-color #6c7486
            background-image url('../../../static/img/back_img_1.png')
            background-repeat no-repeat
            background-position 3% 25%
            padding 10px 20px
            border-top-right-radius 10px
            border-top-left-radius 10px
            color #ffffff
            .left
                display inline-block
                line-height 100px
                float left
            .right
                display: inline-block
                height 100px
                float right
                span
                    font-size 60px
                    line-height 80px

        .content
            padding 10px 15px
            > p
                margin-bottom: 10px;
                > img
                    float left
                    margin-right 5px
                    height 22px
                    width 22px
                span
                    font-size 14px
                    line-height 22px
                    cursor pointer
                    &:hover
                        color #4a90e2
                .active
                    color #4a90e2
            .stat-chart
                height 250px
            .divider
                position relative
                .line
                    border-top 1px solid #4a90e2
                .dot
                    width 5px
                    height 5px
                    border-radius 3px
                    position absolute
                    top -2px
                    background-color #4a90e2
        .foot
            padding 15px
            .stat-span
                display inline-block
                line-height 42px
                font-size 14px
                padding 0
                color #6b7486
            .left
                float left
            .right
                float right
            .result-text
                width 30px
                margin-left 10px
                font-size 30px

    .time-select-card
        height 170px
        p
            font-size 14px
            line-height 22px
            color #4a90e2
            margin-bottom 20px
            img
                height 22px
                float left
                margin-right 5px
        .time-field
            line-height 30px
            padding 5px
            .title
                font-size 14px
                color #38435b
                margin-right 10px
            .text
                font-size 14px
            .el-icon-edit-outline
                cursor pointer
                color #4a90e2
                font-size 14px
            .btn
                display inline-block
                line-height 25px
                font-size 14px
                padding 0
                color #4a90e2
                cursor pointer
                &:hover
                    border-bottom 1px solid #4a90e2

</style>
