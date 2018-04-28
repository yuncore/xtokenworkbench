<template>
    <div>
        <div id="head">
            <router-link :to="{name: 'currencyList', query: {page: this.$route.query.page}}">
                <img src="../../static/img/logo.svg" class="logo">
            </router-link>
        </div>
        <div id="content">
            <h1>{{userName}}</h1>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="card">
                        <div ref="userHistoryChartPie" style="width: 100%; height: 600px; margin: 0 auto">
                        </div>
                        <div id="userHistoryLineChart" ref="userHistoryChartLine" style="width: 100%; height: 600px; margin: 0 auto">
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="card coins">
                        <el-table :data="general_data"
                                  ref="KOLTable"
                                  v-loading="historyLoading"
                                  @selection-change="handleSelectionChange"
                                  element-loading-text="数据加载中"
                                  element-loading-spinner="el-icon-loading"
                                  element-loading-background="rgba(0, 0, 0, 0.8)">
                            <el-table-column
                                align="center"
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column label="项目名" align="center">
                                <template slot-scope="scope">
                                    <div class="btn" @click="toCurrencyDetail(scope.row)">
                                        {{scope.row['1']}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="评论数" align="center">
                                <template slot-scope="scope">
                                    {{scope.row['2']}}
                                </template>
                            </el-table-column>
                            <el-table-column label="缩略图" align="center">
                                <template slot-scope="scope">
                                    <div :ref="'userThumbnail'+scope.$index" class="user-thumbnail">
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
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
    import hcharts from 'highcharts'

    export default {
        data: function () {
            return {
                user_id: '',
                userName: '',
                general_data: [],
                arr_data: [],
                series: [],
                historyLoading: false
            }
        },
        watch: {
            series: function (val) {
                this.drawUserHistoryLine()
                this.scrollToElement()
            }
        },
        methods: {
            scrollToElement(){
                let chart = document.getElementById('userHistoryLineChart')
                chart.scrollIntoView(false)
            },
            getUserHistory(user_id){
                this.historyLoading = true
                let url = config.PYTHONBASEDOMAIN + `/bitcointalk/user/history`
                let data = {
                    user_id: user_id
                }
                let succ = res => {
                    this.historyLoading = false
                    this.user_id = res.user_id
                    this.user_name = res.user_name
                    let general_data = JSON.parse(res.general_data)
                    let arr_data = res.arr_data
                    this.general_data = general_data
                    this.arr_data = arr_data
                    this.drawUserHistoryLine()
                    this.drawUserHistoryPie()
                    this.$nextTick(function () {
                        this.selectionTop3()
                        for(let i=0; i < general_data.length; i++){
                            let currency_name = general_data[i][1]
                            for(let j=0; j<arr_data.length; j++){
                                if(arr_data[j]['currency_name'] === currency_name){
                                    this.drawUserHistoryThumbnail(arr_data[j]['data'], i)
                                    break
                                }
                            }
                        }
                    })
                }
                let fail = res => {
                    this.historyLoading = false
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            drawUserHistoryLineByEChart(){
                let myChart = echarts.init(this.$refs.userHistoryChartLine)
                myChart.clear()
                let series = []
                let legend = []
                let chart_series = []
                for(let i=0; i<this.series.length; i++){
                    let index = this.series[i]
                    let currency_name = this.general_data[index]['1']
                    for(let j=0; j<this.arr_data.length; j++){
                        if(currency_name === this.arr_data[j]['currency_name']){
                            series.push(this.arr_data[j])
                            break
                        }
                    }
                }
                for(let i=0; i<series.length; i++){
                    let currency_name = series[i].currency_name
                    let time_data = JSON.parse(series[i].data)
                    legend.push(currency_name)
                    let data = []
                    if(time_data){
                        for(let j=0; j<time_data.length; j++){
                            let point_data = time_data[j]
                            data.push({
                                name: point_data[0],
                                value: [this.getSmpFormatDateByLong(point_data[0], false), point_data[1]]
                            })
                        }
                    }
                    let series_data = {
                        name: currency_name,
                        type:'line',
                        data: data,
                        stack: '总量',
                        areaStyle: {normal: {}},
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1,
                            }
                        },
                    }
                    chart_series.push(series_data)
                }
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legend
                    },
                    xAxis:  {
                        type: 'time',
                        splitLine: {
                            show: false
                        },
                        axisPointer: {
                            z: 100
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: chart_series
                }
                myChart.setOption(option)
            },
            drawUserHistoryLine(){
                let series = []
                let legend = []
                let chart_series = []
                for(let i=0; i<this.series.length; i++){
                    let index = this.series[i]
                    let currency_name = this.general_data[index]['1']
                    for(let j=0; j<this.arr_data.length; j++){
                        if(currency_name === this.arr_data[j]['currency_name']){
                            series.push(this.arr_data[j])
                            break
                        }
                    }
                }
                for(let i=0; i<series.length; i++){
                    let currency_name = series[i].currency_name
                    let time_data = JSON.parse(series[i].data)
                    legend.push(currency_name)
                    let data = []
                    if(time_data){
                        for(let j=0; j<time_data.length; j++){
                            let point_data = time_data[j]
                            data.push(point_data)
                        }
                    }
                    let series_data = {
                        name: currency_name,
                        data: data,
                    }
                    chart_series.push(series_data)
                }
                let option = {
                    chart: {
                        type: 'area'
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f}) <br/>',
                        shared: true,
                        dateTimeLabelFormats: {
                            millisecond: '%H:%M:%S.%L',
                            second: '%H:%M:%S',
                            minute: '%H:%M',
                            hour: '%H:%M',
                            day: '%Y-%m-%d',
                            week: '%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        }
                    },
                    legend: {
                        data: legend
                    },
                    xAxis:  {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            millisecond: '%H:%M:%S.%L',
                            second: '%H:%M:%S',
                            minute: '%H:%M',
                            hour: '%H:%M',
                            day: '%m-%d',
                            week: '%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Percent'
                        }
                    },
                    plotOptions: {
                        area: {
                            stacking: 'percent',
                            lineColor: '#ffffff',
                            lineWidth: 1,
                            marker: {
                                lineWidth: 1,
                                lineColor: '#ffffff'
                            }
                        }
                    },
                    series: chart_series
                }
                $('#userHistoryLineChart').highcharts(option);
            },
            drawUserHistoryPie(){
                let myChart = echarts.init(this.$refs.userHistoryChartPie)
                myChart.clear()
                let general_data = this.general_data
                let seriesData = []
                let legendData = []
                let other = {
                    name: 'other',
                    value: 0
                }
                for(let i=0; i<general_data.length; i++){
                    if(i < 10){
                        legendData.push(general_data[i][1])
                        seriesData.push({name: general_data[i][1], value: general_data[i][2]})
                    }else{
                        other.value += general_data[i][2]
                    }
                }
                if(other.value > 0){
                    seriesData.push(other)
                    legendData.push('other')
                }
                let option = {
                    title : {
                        text: '项目足迹分布',
                        x:'center',
                        top: 10
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: legendData,
                    },
                    series : [
                        {
                            name: '项目',
                            type: 'pie',
                            radius : '55%',
                            center: ['40%', '50%'],
                            data: seriesData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
                myChart.setOption(option)
            },
            drawUserHistoryThumbnail(str_data, index){
                let chart = echarts.init(this.$refs['userThumbnail' + index])
                let data = JSON.parse(str_data)
                let line_data = []
                for(let i=0; i<data.length; i++){
                    line_data.push({
                        name: data[i][0],
                        value: [this.getSmpFormatDateByLong(data[i][0], false), data[i][1]]
                    })
                }
                chart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        position: [0, 0],
                        formatter: '{c}',
                        backgroundColor: 'rgba(50,50,50,0)',
                        textStyle: {
                            color: '#606266'
                        }
                    },
                    xAxis: {
                        show: false,
                        type: 'time',
                        splitNumber: 1,
                        splitLine: {show: false}
                    },
                    yAxis: {
                        show: false,
                        max: function(value) {
                            return value.max < 5 ? 5 : value.max
                        },
                        splitNumber: 1,
                        splitLine: {show: false}
                    },
                    series: {
                        type: 'line',
                        showSymbol: false,
                        data: line_data,
                        lineStyle: {
                            normal: {
                                width: 1,
                                color: 'rgb(251, 133, 50)'
                            }
                        },
                    }
                })
            },
            toCurrencyDetail(row){
                let currency_name = row['1']
                let url = config.PYTHONBASEDOMAIN + `/currency`
                let data = {
                    name: currency_name
                }
                let succ = res => {
                    let query = {
                        id: res.id
                    }
                    this.$router.push({path: '/currency', query: query})
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            handleSelectionChange(val){
                let series_index = []
                for(let i=0; i<val.length; i++){
                    for(let j=0; j<this.general_data.length; j++){
                        if(this.general_data[j][0] === val[i][0]){
                            series_index.push(j)
                            break
                        }
                    }
                }
                this.series = series_index
            },
            selectionTop3(){
                for(let i=0; i<3; i++){
                    this.$refs.KOLTable.toggleRowSelection(this.general_data[i]);
                }
            },
            getSmpFormatDateByLong: utils.getSmpFormatDateByLong,
        },
        mounted(){
            this.user_id = this.$route.query.user_id
            this.userName = this.$route.query.user_name
            this.getUserHistory(this.user_id)
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .card
        padding 0

    .user-thumbnail
        width 300px
        height 60px

    .coins .btn
        cursor pointer
        color #409EFF
</style>
