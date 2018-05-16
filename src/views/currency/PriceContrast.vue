<template>
    <div>
        <div id="head">
            <router-link :to="{name: 'currencyList', query: {}}">
                <img src="../../../static/img/logo.svg" class="logo">
            </router-link>
        </div>
        <div id="content">
            <div class="card">
                <div class="top cf">
                    <div class="left">
                        <el-select
                            v-model="chooseCurrencyList"
                            multiple
                            filterable
                            remote
                            reserve-keyword
                            :remote-method="headSearchMethod"
                            :loading="headSearchLoading"
                            @change="headSearchChange"
                            class="search-field">
                            <el-option
                                v-for="(item, index) in headSearchOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="right">
                        <el-button @click="priceType = 1" :type="priceType === 1 ? 'primary' : ''" round>BTC</el-button>
                        <el-button @click="priceType = 2" :type="priceType === 2 ? 'primary' : ''" round>USD</el-button>
                    </div>
                </div>
                <div ref="currencyPriceChart" class="charts">

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
    import echarts from 'echarts'

    export default {
        name: "PriceContrast",
        data: function(){
            return {
                baseCurrency: '',
                baseCurrencyPrice: '',
                chooseCurrencyList: [],
                headSearchLoading: false,
                headSearchOptions: [],
                priceCardLoading: false,
                priceDataList: [],
                /*priceType: {1: price_btc, 2: price_usd}*/
                priceType: 1,
            }
        },
        watch:{
            priceType(){
                this.drawPriceCharts()
            }
        },
        methods:{
            headSearchMethod(query){
                if (query !== '' && query.length >= 2) {
                    this.loading = true;
                    let url = config.PYTHONBASEDOMAIN + '/currency/search';
                    let succ = res => {
                        this.headSearchOptions = res.data
                    };
                    let fail = res => {
                        this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                    };
                    net_util.getRequest(url, {keyword: query}, succ, fail)
                } else {
                    this.headSearchOptions = []
                }
            },
            headSearchChange(){
                this.priceDataList = [];
                if (this.chooseCurrencyList.length > 0) {
                    this.getAllCurrencyPrice()
                } else {
                    this.drawPriceCharts()
                }
            },
            // 获取所有货币的价格
            getAllCurrencyPrice(){
                let promises = this.chooseCurrencyList.map(item => {
                    return this.getCurrencyPrice(item)
                });
                Promise.all(promises).then(res => {
                    this.drawPriceCharts()
                }).catch(res => {

                })
            },
            // 获取货币价格信息
            getCurrencyPrice (id, base=false) {
                return new Promise((resolve, reject) => {
                    let url = config.PYTHONBASEDOMAIN + `/currency/price`;
                    let data = {
                        id: id,
                        history: true
                    };
                    let succ = res => {
                        if(base){
                            this.baseCurrencyPrice = {id: id, price: res['history_price']['data']}
                        }else{
                            this.priceDataList.push({id: id, price: res['history_price']['data']});
                        }
                        resolve(res)
                    };
                    let fail = res => {
                        reject(res)
                    };
                    net_util.getRequest(url, data, succ, fail)
                })
            },
            // 绘制价格图
            drawPriceCharts(){
                let myChart = echarts.init(this.$refs.currencyPriceChart);
                myChart.clear();
                let all_prices = [...this.priceDataList, this.baseCurrencyPrice];
                let legend_data = [];
                let series = [];
                all_prices.forEach(item => {
                    let data =  JSON.parse(item.price);
                    let price_data;
                    let format_data = [];
                    let time_data = [];
                    if(this.priceType === 1){
                        price_data = data['price_btc']
                    }else{
                        price_data = data['price_usd']
                    }
                    price_data.forEach((item) => {
                        let t = this.getGMT8Time(item[0]);
                        let long_t = t.getTime();
                        if(!(time_data.indexOf(long_t) > -1)){
                            time_data.push(long_t);
                            format_data.push({
                                name: t,
                                value: [
                                    this.getSmpFormatDateByLong(long_t),
                                    item[1]
                                ]
                            })
                        }else{

                        }
                    });
                    let series_data = {
                        name: item.id,
                        type:'line',
                        data: format_data,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1,
                            }
                        },
                    };
                    legend_data.push(item.id);
                    series.push(series_data)
                });
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    axisPointer: {
                        link: {xAxisIndex: 'all'},
                        label: {
                            backgroundColor: '#777'
                        }
                    },
                    legend: {
                        data: legend_data
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            yAxisIndex: 0,
                            filterMode: 'empty',
                            left: 20
                        },
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            filterMode: 'empty',
                            bottom: 0
                        }
                    ],
                    xAxis: [
                        {
                            type: 'time',
                            splitLine: {
                                show: false
                            },
                            min: 'dataMin',
                            max: 'dataMax',
                            axisPointer: {
                                z: 100
                            }
                        },
                    ],
                    yAxis:[
                        {
                            type: 'value',
                            position: 'left',
                            name: this.priceType === 1 ? 'BTC' : 'USD',
                            splitLine: {
                                show: false
                            },
                        },
                    ],
                    series: series
                });
            },
            getGMT8Time(t){
                let d = new Date(t);
                d.setHours(8);
                d.setMinutes(0);
                d.setSeconds(0);
                return d
            },
            getSmpFormatDateByLong: utils.getSmpFormatDateByLong,
        },
        mounted(){
            let query = this.$route.query;
            this.baseCurrency = query.id;
            this.getCurrencyPrice(this.baseCurrency, true).then(res => {
                this.drawPriceCharts()
            }).catch(res => {
                console.log('初始化失败')
            })
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .charts
        width 100%
        height 600px
        margin 10px
    .search-field
        width 500px
</style>
