<template>
    <div>
        <div id="history" class="container">
            <div class="left sidebar-left">
                <ul>
                    <li v-for="item in bindAPIList" class="active">
                        <img :src="EXCHANGEIMGS[item.id] || EXCHANGEIMGS[0]">
                        {{item.bourseName}}
                    </li>
                </ul>
            </div>
            <div class="content">
                <el-table :data="tradeHistoryList">
                    <el-table-column label="Time" align="center">
                        <template slot-scope="scope">
                            {{getSmpFormatDateByLong(scope.row.time)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Pair" align="center">
                        <template slot-scope="scope">
                            {{scope.row.symbol}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Buy/Sell" align="center">
                        <template slot-scope="scope">
                        <span :style="{color: scope.row.buyer ? '#019933' : '#d14836'}">
                            {{scope.row.buyer ? 'Buy' : 'Sell'}}
                        </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Price" align="center">
                        <template slot-scope="scope">
                            {{scope.row.price}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Filled" align="center">
                        <template slot-scope="scope">
                            {{scope.row.qty}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Fee" align="center">
                        <template slot-scope="scope">
                            {{`${scope.row.commission} ${scope.row.commissionAsset}`}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    layout="total, prev, pager, next, jumper"
                    class="pagination"
                    :total="count"
                    :current-page="currentPage"
                    :page-size=currentNum
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import net_util from '../../assets/js/net_utils'
    import config from '../../assets/js/config'
    import utils from '../../assets/js/utils'

    const EXCHANGEIMGS = [
        'static/img/binance.png',
    ]

    export default {
        name: "tradeHistory",
        data(){
            return {
                bindAPIList: [],
                tradeHistoryList: [],
                currentPage: 1,
                currentNum: 10,
                count: 0,
                EXCHANGEIMGS,
            }
        },
        methods: {
            getTradeHistoryList(type, page, num){
                let url = config.JAVABASEDOMAIN + `/bourse/binance/trade`;
                let data = {
                    type: type,
                    page: page,
                    num: num
                };
                let succ = res => {
                    if (!res.errorMsg) {
                        this.tradeHistoryList = res.result;
                        this.count = res.size
                    }
                };
                let fail = res => {

                };
                net_util.getRequest(url, data, succ, fail)
            },
            getBindAPIList(){
                return new Promise((resolve, reject) => {
                    let url = config.JAVABASEDOMAIN + `/user/bourse/bind/list`;
                    let data = {};
                    let succ = res => {
                        if (!res.errorMsg) {
                            this.bindAPIList = res.result;
                            resolve(res.result);
                        }
                    };
                    let fail = res => {
                        reject(res)
                    };
                    net_util.getRequest(url, data, succ, fail)
                });
            },
            getSmpFormatDateByLong: utils.getSmpFormatDateByLong,
        },
        mounted(){
            this.getBindAPIList().then(res => {
                if(this.bindAPIList.length > 0){
                    let type = res[0]['type'];
                    this.getTradeHistoryList(type, this.currentPage, this.currentNum);
                }
            }).catch()
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../static/css/base.styl"

    #history

        .sidebar-left
            width 200px
            background-color #FFFFFF

            ul
                .active
                    background-color rgba(64,158,255,0.06);
                    border-right 4px solid #409eff

                li
                    text-align center
                    padding 20px
                    cursor pointer

                    img
                        vertical-align middle
                        width 20px
                        height 20px

        .content
            margin-left 210px
            background-color #EDEDED

            .pagination
                padding 5px
                background #FFF

    .el-table::before
        width 0
</style>
