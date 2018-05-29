<template>
    <div>
        <div id="history-rank" class="container">
            <div class="card market-cap-card">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="chart" ref="marketcap_chart" style="height: 600px">
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="info">
                            <div class="head">
                                <div class="date">
                                    <div class="left">
                                        <i class="el-icon-arrow-left" @click="getLastDay"></i>
                                    </div>
                                    <div class="center">
                                        <span v-show="!dateSelectShow"
                                            @click="showDateSelect">
                                            <i class="el-icon-date"></i>
                                            {{getSmpFormatDateByLong(new Date(time).getTime(), false)}}
                                        </span>
                                        <el-date-picker
                                            ref="datePicker"
                                            v-show="dateSelectShow"
                                            v-model="time"
                                            @blur="hiddenDatePick"
                                            type="date"
                                            placeholder="选择日期">
                                        </el-date-picker>
                                    </div>
                                    <div class="right">
                                        <i class="el-icon-arrow-right" @click="getNextDay"></i>
                                    </div>
                                </div>
                                <p class="intro">
                                    <span class="title"><img src="../../../static/img/cap.svg">market cap: </span>
                                    <span class="text">{{'$' + customerParseFloat(market_cap_total)}}</span>
                                </p>
                                <p class="intro">
                                    <span class="title"><img src="../../../static/img/usd.svg">volume usd: </span>
                                    <span class="text">{{'$' + customerParseFloat(volume_usd_total)}}</span>
                                </p>
                            </div>
                            <el-tabs v-loading="coindesk_news_loading"
                                     element-loading-text="数据加载中"
                                     element-loading-spinner="el-icon-loading"
                                     element-loading-background="rgba(0, 0, 0, 0.8)">
                                <el-tab-pane>
                                    <span slot="label"><i class="el-icon-tickets"></i> 市值排名 </span>
                                    <el-table
                                        :data="currency_data"
                                        height="800px"
                                        :default-sort="{prop: 'market_cap', order: 'descending'}"
                                        @sort-change="sortChange"
                                        style="width: 100%; height: 800px">
                                        <el-table-column label="#" align="center">
                                            <template slot-scope="scope">
                                                {{scope.$index + 1}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            align="center"
                                            prop="currency_id"
                                            label="currency_id">
                                            <template slot-scope="scope">
                                                <el-button type="text" size="mini" @click="toCurrencyDetail(scope.row)">
                                                    <span style="font-size: 14px">{{scope.row.currency_id}}</span>
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            sortable
                                            width="150px"
                                            align="center"
                                            prop="market_cap"
                                            label="market_cap">
                                            <template slot-scope="scope">
                                                {{customerParseFloat(scope.row['market_cap'], '$')}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            sortable
                                            align="center"
                                            prop="price_btc"
                                            label="price_btc">
                                        </el-table-column>
                                        <el-table-column
                                            sortable
                                            align="center"
                                            prop="price_usd"
                                            label="price_usd">
                                        </el-table-column>
                                    </el-table>
                                </el-tab-pane>
                                <el-tab-pane >
                                    <span slot="label"><i class="el-icon-document"></i> coindesk news </span>
                                    <div class="news"
                                         :style="{height: (panel_content_height) + 'px'}">
                                        <ul>
                                            <li class="post-info" v-for="item in coindesk_news">
                                                <div class="picture">
                                                    <img :src="item['img']">
                                                </div>
                                                <div class="detail">
                                                    <h3>
                                                        <a class="fade" :href="item['url']" target="_blank">{{item['title']}}</a>
                                                    </h3>
                                                    <p class="time-author">
                                                        <span>{{getSmpFormatDateByLong(item['time'] * 1000)}}</span> |
                                                        <span>
                                                        <a class="author" :href="item['author_url']" target="_blank">{{item['author']}}</a>
                                                    </span>
                                                    </p>
                                                    <p>{{item['intro']}}</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
    import net_util from '../../assets/js/net_utils'
    import config from '../../assets/js/config'
    import utils from '../../assets/js/utils'
    import consts from '../../assets/js/consts'
    import echarts from 'echarts'

    export default {
        data: function () {
            return {
                time: '',
                dateSelectShow: false,
                price_data_loading: false,
                coindesk_news_loading: false,
                currency_data: [],
                coindesk_news: [],
                market_cap_altcoin: '',
                volume_usd_altcoin: '',
                market_cap_total: '',
                volume_usd_total: '',
                //height: window.innerHeight - 100 - 100,
                //panel_content_height: window.innerHeight - 100 - 100 - 160
            }
        },
        watch:{
            time(val){
                this.getCurrencyData(val)
                this.getCoindeskNews(val.getTime())
            }
        },
        methods: {
            showDateSelect(){
                this.dateSelectShow = true
                this.$nextTick(function () {
                    let p = this.$refs.datePicker
                    p.focus()
                })
            },
            hiddenDatePick(){
                this.dateSelectShow = false
            },
            getCurrencyData (val) {
                let time_long = val.getTime() / 1000
                let url = config.PYTHONBASEDOMAIN + `/stat/history/rank`
                let data = {
                    time: time_long
                }
                let succ = res => {
                    let data = []
                    try{
                        let price_btc = res['data']['price_btc']
                        let price_usd = res['data']['price_usd']
                        let market_cap = res['data']['market_cap']
                        this.market_cap_altcoin = res['data']['market_cap_altcoin']
                        this.volume_usd_altcoin = res['data']['volume_usd_altcoin']
                        this.market_cap_total = res['data']['market_cap_total']
                        this.volume_usd_total = res['data']['volume_usd_total']
                        let coin_names = new Set([...Object.keys(price_btc), ...Object.keys(price_usd), ...Object.keys(market_cap)])
                        for(let coin_name of coin_names.keys()){
                            data.push({
                                'currency_id': coin_name,
                                'price_btc': price_btc[coin_name],
                                'price_usd': price_usd[coin_name],
                                'market_cap': market_cap[coin_name],
                            })
                        }
                    }catch (e){

                    }finally {
                        this.time = val
                        this.price_data_loading = false
                        this.currency_data = data
                    }
                }
                let fail = res => {
                    this.price_data_loading = false
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                }
                this.price_data_loading = true
                net_util.getRequest(url, data, succ, fail)
            },
            getTotalMarket(){
                let url = config.PYTHONBASEDOMAIN + `/stat/history/total`
                let data = {}
                let succ = res => {
                    this.price_data_loading = false
                    if(res){
                        let data = JSON.parse(res)
                        this.drawTotalMarketCapChart(data)
                    }
                }
                let fail = res => {
                    this.price_data_loading = false
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                }
                this.price_data_loading = true
                net_util.getRequest(url, data, succ, fail)
            },
            getCoindeskNews(time){
                let url = config.PYTHONBASEDOMAIN + `/coindesk/news`
                let data = {
                    //time: this.getSmpFormatDateByLong(time, false)
                    time: time
                }
                let succ = res => {
                    this.coindesk_news_loading = false
                    this.coindesk_news = res
                }
                let fail = res => {
                    this.coindesk_news_loading = false
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                }
                this.coindesk_news_loading = true
                net_util.getRequest(url, data, succ, fail)
            },
            drawTotalMarketCapChart(data){
                let myChart = echarts.init(this.$refs.marketcap_chart);
                myChart.clear();
                let market_cap = []
                let volume_usd = []
                data['market_cap_by_available_supply'].forEach((item, index) => {
                    market_cap.push({
                        name: new Date(item[0]),
                        value: item
                    })
                })
                data['volume_usd'].forEach((item, index) => {
                    volume_usd.push({
                        name: new Date(item[0]),
                        value: item
                    })
                })
                myChart.setOption({
                    title: {
                        text: 'Total Market Capitalization'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    axisPointer: {
                        link: {xAxisIndex: 'all'},
                        label: {
                            backgroundColor: '#777'
                        }
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 0,
                            end: 100,
                            xAxisIndex: [0, 1]
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            start: 0,
                            end: 100,
                            xAxisIndex: [0, 1]
                        }
                    ],
                    legend: {
                        data:['Market Cap', '24h Vol'],
                        right: '8%'
                    },
                    grid: [
                        {
                            left: '10%',
                            right: '8%',
                            height: '60%'
                        },
                        {
                            left: '10%',
                            right: '8%',
                            top: '70%',
                            height: '16%'
                        }
                    ],
                    xAxis: [
                        {
                            type: 'time',
                            min: 'dataMin',
                            max: 'dataMax',
                            axisPointer: {
                                z: 100
                            },
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            },
                        },
                        {
                            type: 'time',
                            min: 'dataMin',
                            max: 'dataMax',
                            gridIndex: 1,
                            axisPointer: {
                                z: 100
                            },
                            splitLine: {
                                show: false
                            },
                        },
                    ],
                    yAxis:[
                        {
                            type: 'value',
                            name: 'Market Cap (Billion)',
                            splitArea: {
                                show: true
                            },
                            axisLabel: {
                                formatter: function (value, index) {
                                    return `${value / 1000000000}`
                                }
                            }
                        },
                        {
                            type: 'value',
                            gridIndex: 1,
                            name: '24h Vol',
                            nameLocation: 'middle',
                            splitNumber: 2,
                            splitArea: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            }
                        },
                    ],
                    series: [
                        {
                            name:'Market Cap',
                            type:'line',
                            data: market_cap,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                }
                            },
                        },
                        {
                            name:'24h Vol',
                            type:'line',
                            data: volume_usd,
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            showSymbol: false,
                            areaStyle:{
                                normal: {}
                            },
                            lineStyle: {
                                normal: {
                                    width: 1,
                                }
                            },
                        },
                    ]
                })
                myChart.getZr().on('click',params=>{
                    const pointInPixel = [params.offsetX, params.offsetY];
                    if (myChart.containPixel('grid',pointInPixel)) {
                        let xIndex = myChart.convertFromPixel({seriesIndex: 0},[params.offsetX, params.offsetY])[0];
                        /*事件处理代码书写位置*/
                        let temp_date = new Date(xIndex)
                        this.time = new Date(temp_date.getFullYear(), temp_date.getMonth(), temp_date.getDate())
                    }
                });
            },
            getLastDay(){
                let temp_date = new Date(new Date(this.time).getTime() - 24 * 3600 * 1000)
                this.time = new Date(temp_date.getFullYear(), temp_date.getMonth(), temp_date.getDate())
            },
            getNextDay(){
                let temp_date = new Date(new Date(this.time).getTime() + 24 * 3600 * 1000)
                this.time = new Date(temp_date.getFullYear(), temp_date.getMonth(), temp_date.getDate())
            },
            toCurrencyDetail (row) {
                let query = {
                    id: row.currency_id,
                }
                this.$router.push({name: 'CurrencyDetail', query: query})
            },
            customerParseFloat: utils.customerParseFloat,
            getSmpFormatDateByLong: utils.getSmpFormatDateByLong
        },
        mounted(){
            this.getCurrencyData(new Date())
            this.getTotalMarket()
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../static/css/base.styl"

    .market-cap-card
        margin-top 0
        .head
            .date
                position relative
                height 30px
                .left
                    position absolute
                    left 0
                    top 0
                    width 200px
                    height 100%
                    font-size 20px
                    text-align center
                    vertical-align middle
                    cursor pointer
                    &:hover
                        opacity 0.8
                        color #409EFF
                .center
                    margin 0 220px
                    height 100%
                    text-align center
                    font-size 20px
                    line-height 20px
                    vertical-align middle
                    span
                        cursor pointer
                .right
                    position absolute
                    right 0
                    top 0
                    width 200px
                    height 100%
                    font-size 20px
                    text-align center
                    vertical-align middle
                    cursor pointer
                    &:hover
                        opacity 0.8
                        color #409EFF
            .intro
                margin 10px 0
                img
                    margin 0 5px
                    vertical-align middle
        .news
            height 550px
            margin-top 10px
            overflow auto
            .post-info
                border-bottom: solid 1px #e8e8e8;
                vertical-align: top;
                padding: 10px 0;
                display table
                .picture
                    display table-cell
                    vertical-align middle
                    img
                        width 150px
                        margin 10px
                .detail
                    display table-cell
                    .time-author
                        color #888
                        font-size 14px
                        .author
                            color #888
                            font-size 14px
                            &:hover
                             color #409EFF
                    a
                        display: inline-block;
                        color: #353536;
                        &:hover
                            color #409EFF
                    p
                        margin 10px 0
                        line-height 20px
                    h3
                        margin 10px 0

</style>
