<template>
    <div id="currency-overview">
        <el-row :gutter="30" class="market-part">
            <el-col :span="8">
                <div class="card market-card cap">
                    <div class="icon">
                        <img src="../../../../static/img/github.png">
                    </div>
                    <div class="instruction">
                        <span>
                            {{customerParseFloat(currencyPrice['market_cap_usd'], '$')}}
                            <br/>
                            <em>Market Cap</em>
                        </span>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="card market-card volume">
                    <div class="icon">
                        <img src="../../../../static/img/github.png">
                    </div>
                    <div class="instruction">
                        <span>
                            {{customerParseFloat(currencyPrice['24h_volume_usd'], '$')}}
                            <br/>
                            <em>Volume(24H)</em>
                        </span>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="card market-card volume">
                    <div class="icon">
                        <img src="../../../../static/img/github.png">
                    </div>
                    <div class="instruction">
                        <span>
                            {{customerParseFloat(currencyPrice['available_supply'])}}
                            <br/>
                            <em>Available</em>
                        </span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="30" class="basic-part">
            <el-col :span="9">
                <div class="card basic-card info">
                    <div class="raise-info">
                        <p class="label">Project Info</p>
                        <p class="name">{{currencyPrice.name}}<em>{{`(${currencyPrice.symbol})`}}</em></p>
                        <div class="raise-detail"  v-if="currencyAdditionInfo_myToken">
                            <p>{{currencyAdditionInfo_myToken.ico_date_display}}</p>
                            <p>{{currencyAdditionInfo_myToken.exchange_rate_display}}</p>
                            <p>{{currencyAdditionInfo_myToken.raised_amount_display}}</p>
                        </div>
                        <div v-else>
                            Temporarily no data
                        </div>
                    </div>
                    <div class="website-button">
                        website
                    </div>
                </div>
            </el-col>
            <el-col :span="9">
                <div class="card basic-card trend">
                    <p class="label">The price trend</p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="card basic-card tool">
                    sss
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import net_util from '../../../assets/js/net_utils'
    import config from '../../../assets/js/config'
    import utils from '../../../assets/js/utils'
    import consts from '../../../assets/js/consts'
    import echarts from 'echarts'

    export default {
        name: "overview",
        data(){
            return {
                id: this.$route.query.id,
                name: this.$route.query.name,
                currencyPrice: '',
                historyPrice: '',
                currencyAdditionInfo_myToken: '',
            }
        },
        methods: {
            init(){
                this.getCurrencyPrice().then(() => {
                    this.getAdditionalInfo()
                }).then(() => {
                    console.log('completed')
                }).catch(() => {
                    console.log('fail')
                })
            },
            // 获取货币的价格信息
            getCurrencyPrice () {
                return new Promise((resolve, reject) => {
                    let url = config.PYTHONBASEDOMAIN + `/currency/price`;
                    let data = {
                        id: this.id,
                        history: true
                    };
                    let succ = res => {
                        this.currencyPrice = res['current_price'][0];
                        this.historyPrice = res['history_price']['data'];
                        resolve()
                    };
                    let fail = reject;
                    net_util.getRequest(url, data, succ, fail)
                });
            },
            //获取和货币相关的额外信息
            getAdditionalInfo () {
                return new Promise((resolve, reject) => {
                    let url = config.PYTHONBASEDOMAIN + `/currency/addition/info`;
                    let data = {
                        name: this.currencyPrice['name']
                    };
                    let succ = res => {
                        if(res.mytoken){
                            this.currencyAdditionInfo_myToken = res['mytoken']
                        }
                        resolve()
                    };
                    let fail = reject;
                    net_util.getRequest(url, data, succ, fail)
                });
            },
            customerParseFloat: utils.customerParseFloat,
        },
        mounted(){
            this.init()
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

    .card
        background #FFF

    .basic-part
        height 350px
        margin-left 0!important
        margin-right 0!important
        margin-top 20px
        .info
            background none!important
            padding 0!important
            .raise-info
                background #FFF
                height 250px
                padding 20px
                .raise-detail
                    margin-top 120px
            .website-button
                height 70px
                margin-top 30px
                background linear-gradient(-179deg, #78d25e 2%, #42bb77 94%)
        .basic-card
            height 350px
            padding 20px
            background #FFF
            .label
                font-size 16px
                color #b7c4d4
            .name
                font-size 30px
                margin 5px 0
                em
                    font-style normal
                    font-size 16px
                    color #b7c4d4

    .market-part
        margin 0!important
        height 140px
        .market-card
            height 140px
            padding 0 30px
            .icon
                float left
                line-height 140px
                margin-right 10px
                img
                    width 30px
                    height 30px
                    vertical-align: middle;
            .instruction
                line-height 140px
                margin-left 50px
                span
                    font-family PingFangSC-Regular
                    display inline-block
                    font-size 24px
                    line-height 30px
                    vertical-align middle
                    em
                        font-style normal
                        font-size 16px
                        color #999999
</style>
