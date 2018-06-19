<template>
    <div>
        <div id="history-rank"
            class="container">
            <transition mode="out-in" name="el-zoom-in-top">
                <div v-show="t === 1">
                    <div class="chart" ref="marketcap_chart" style="height: 600px"></div>
                </div>
            </transition>
            <transition mode="out-in" name="el-zoom-in-top">
                <div v-show="t === 2" class="info">
                    <div class="back" @click="t = 1">
                        <img src="../../../static/img/history_back.svg">
                        Chart
                    </div>
                    <el-row class="head">
                        <el-col class="date cf" style="width: 180px; margin-right: 20px">
                            <el-date-picker
                                v-if="dateSelectShow"
                                ref="datePicker"
                                v-model="time"
                                @blur="hiddenDatePick"
                                type="date"
                                size="small"
                                placeholder="选择日期">
                            </el-date-picker>
                            <div v-else>
                                <div class="left">
                                    <i class="el-icon-arrow-left" @click="getLastDay"></i>
                                </div>
                                <div @click="showDateSelect" class="center">
                                    <i class="el-icon-date"></i>
                                    <p>
                                        {{getSmpFormatDateByLong(new Date(time).getTime(), false)}}
                                    </p>
                                </div>
                                <div class="right">
                                    <i class="el-icon-arrow-right" @click="getNextDay"></i>
                                </div>
                            </div>
                        </el-col>
                        <el-col class="detail" style="width: 310px; margin-right: 20px">
                            <p class="text">{{'$' + customerParseFloat(market_cap_total)}}</p>
                            <p class="title"><img src="../../../static/img/cap.svg">market cap</p>
                        </el-col>
                        <el-col class="detail" style="width: 310px">
                            <span class="text">{{'$' + customerParseFloat(volume_usd_total)}}</span>
                            <p class="title"><img src="../../../static/img/usd.svg">volume usd</p>
                        </el-col>
                    </el-row>
                    <el-tabs>
                        <el-tab-pane>
                            <span slot="label"><i class="el-icon-tickets"></i> Rank </span>
                            <el-table
                                :data="currency_data"
                                :header-cell-style="headCellStyle"
                                :default-sort="{prop: 'market_cap', order: 'descending'}"
                                @sort-change="sortChange">
                                <el-table-column label="#" align="center">
                                    <template slot-scope="scope">
                                        {{scope.$index + 1}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    prop="currency_id"
                                    label="currency">
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
                                    label="price_btc">
                                    <template slot-scope="scope">
                                        {{customerParseFloat(scope.row['price_btc'])}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    sortable
                                    align="center"
                                    prop="price_usd"
                                    label="price_usd">
                                    <template slot-scope="scope">
                                        {{customerParseFloat(scope.row['price_usd'], '$')}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane>
                            <span slot="label"><i class="el-icon-document"></i> Coindesk </span>
                            <div class="news">
                                <ul>
                                    <li class="post-info" v-for="(item, index) in coindesk_news" :key=index>
                                        <div class="picture" v-if="item['img'].startsWith('http')">
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
            </transition>
        </div>
    </div>
</template>
<script>
import net_util from "../../assets/js/net_utils";
import config from "../../assets/js/config";
import utils from "../../assets/js/utils";
import echarts from "echarts";

export default {
  data: function() {
    return {
      t: 1,
      time: "",
      currency_data: [],
      coindesk_news: [],
      dateSelectShow: false,
      historyRankLoading: false,
      market_cap_total: "",
      volume_usd_total: ""
    };
  },
  watch: {
    time(val) {
      this.getCurrencyData(val).then(res => {
        let data = [];
        try {
          let price_btc = res["data"]["price_btc"];
          let price_usd = res["data"]["price_usd"];
          let market_cap = res["data"]["market_cap"];
          this.market_cap_total = res["data"]["market_cap_total"];
          this.volume_usd_total = res["data"]["volume_usd_total"];
          let coin_names = Object.keys(market_cap);
          for (let coin_name of coin_names) {
            data.push({
              currency_id: coin_name,
              price_btc: price_btc[coin_name],
              price_usd: price_usd[coin_name],
              market_cap: market_cap[coin_name]
            });
          }
        } catch (e) {
        } finally {
          this.time = val;
          this.currency_data = data;
        }
      });
      this.getCoindeskNews(val.getTime());
    }
  },
  methods: {
    init() {
      this.getTotalMarket().then(res => {
        let data = JSON.parse(res);
        this.drawTotalMarketCapChart(data);
      });
    },
    showDateSelect() {
      this.dateSelectShow = true;
      this.$nextTick(function() {
        let p = this.$refs.datePicker;
        p.focus();
      });
    },
    hiddenDatePick() {
      this.dateSelectShow = false;
    },
    getCurrencyData(val) {
      return new Promise((resolve, reject) => {
        let time_long = val.getTime() / 1000;
        let url = config.PYTHONBASEDOMAIN + `/stat/history/rank`;
        let data = {
          time: time_long
        };
        let succ = res => {
          this.historyRankLoading = false;
          resolve(res);
        };
        let fail = res => {
          this.historyRankLoading = false;
        }
        this.historyRankLoading = true;
        net_util.getRequest(url, data, succ, fail);
      });
    },
    getTotalMarket() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/stat/history/total`;
        let data = {};
        let succ = res => {
          if (res) {
            resolve(res);
          } else {
            reject();
          }
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    getCoindeskNews(time) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/coindesk/news`;
        let data = {
          time: time
        };
        let succ = res => {
          this.coindesk_news = res;
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    drawTotalMarketCapChart(data) {
      let myChart = echarts.init(this.$refs.marketcap_chart);
      myChart.clear();
      let market_cap = [];
      let volume_usd = [];
      data["market_cap_by_available_supply"].forEach((item, index) => {
        market_cap.push({
          name: new Date(item[0]),
          value: item
        });
      });
      data["volume_usd"].forEach((item, index) => {
        volume_usd.push({
          name: new Date(item[0]),
          value: item
        });
      });
      myChart.setOption({
        title: {
          text: "Total Market Capitalization"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
          label: {
            backgroundColor: "#777"
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
            type: "inside",
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: [0, 1]
          }
        ],
        legend: {
          data: ["Market Cap", "24h Vol"],
          right: "8%"
        },
        grid: [
          {
            left: "10%",
            right: "8%",
            height: "60%"
          },
          {
            left: "10%",
            right: "8%",
            top: "70%",
            height: "16%"
          }
        ],
        xAxis: [
          {
            type: "time",
            min: "dataMin",
            max: "dataMax",
            axisPointer: {
              z: 100
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          },
          {
            type: "time",
            min: "dataMin",
            max: "dataMax",
            gridIndex: 1,
            axisPointer: {
              z: 100
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "Market Cap (Billion)",
            splitArea: {
              show: true
            },
            axisLabel: {
              formatter: function(value, index) {
                return `${value / 1000000000}`;
              }
            }
          },
          {
            type: "value",
            gridIndex: 1,
            name: "24h Vol",
            nameLocation: "middle",
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
          }
        ],
        series: [
          {
            name: "Market Cap",
            type: "line",
            data: market_cap,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          },
          {
            name: "24h Vol",
            type: "line",
            data: volume_usd,
            xAxisIndex: 1,
            yAxisIndex: 1,
            showSymbol: false,
            areaStyle: {
              normal: {}
            },
            lineStyle: {
              normal: {
                width: 1
              }
            }
          }
        ]
      });
      myChart.getZr().on("click", params => {
        const pointInPixel = [params.offsetX, params.offsetY];
        if (myChart.containPixel("grid", pointInPixel)) {
          let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [
            params.offsetX,
            params.offsetY
          ])[0];
          /*事件处理代码书写位置*/
          let temp_date = new Date(xIndex);
          this.t = 2;
          this.time = new Date(
            temp_date.getFullYear(),
            temp_date.getMonth(),
            temp_date.getDate()
          );
        }
      });
    },
    getLastDay() {
      let temp_date = new Date(
        new Date(this.time).getTime() - 24 * 3600 * 1000
      );
      this.time = new Date(
        temp_date.getFullYear(),
        temp_date.getMonth(),
        temp_date.getDate()
      );
    },
    getNextDay() {
      let temp_date = new Date(
        new Date(this.time).getTime() + 24 * 3600 * 1000
      );
      this.time = new Date(
        temp_date.getFullYear(),
        temp_date.getMonth(),
        temp_date.getDate()
      );
    },
    toCurrencyDetail(row) {
      let query = {
        id: row.currency_id
      };
      this.$router.push({ name: "currency_detail", query: query });
    },
    headCellStyle() {
      return {
        padding: 0,
        "line-height": "40px",
        "font-weight": "normal"
      };
    },
    customerParseFloat: utils.customerParseFloat,
    getSmpFormatDateByLong: utils.getSmpFormatDateByLong
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../static/css/base.styl';

#history-rank {
  width: 840px;
  margin: 0 auto;

  .info {
    .back {
      margin-bottom: 20px;
      font-size: 20px;
      cursor: pointer;

      img {
        font-size: 20px;
        vertical-align: middle;
      }
    }

    .head {
      margin-bottom: 20px;

      .date {
        position: relative;
        background: #FFF;

        .left {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;

          &:hover {
            opacity: 0.8;
            color: #409EFF;
          }
        }

        .center {
          height: 40px;
          padding: 20px 0;
          text-align: center;
          font-size: 20px;
          line-height: 20px;
          vertical-align: middle;

          p {
            font-size: 13px;
            cursor: pointer;
          }
        }

        .right {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;

          &:hover {
            opacity: 0.8;
            color: #409EFF;
          }
        }
      }

      .detail {
        text-align: center;
        padding: 20px 0;
        background: #FFF;

        .title {
          font-size: 13px;
        }

        img {
          margin: 0 5px;
          vertical-align: middle;
        }
      }
    }

    .news {
      margin-top: 10px;
      overflow: auto;

      .post-info {
        border-bottom: solid 1px #e8e8e8;
        vertical-align: top;
        padding: 10px 0;
        display: table;
        width: 100%;

        .picture {
          display: table-cell;
          vertical-align: middle;

          img {
            width: 150px;
            margin: 10px;
          }
        }

        .detail {
          display: table-cell;

          .time-author {
            color: #888;
            font-size: 13px;

            .author {
              color: #888;
              font-size: 14px;

              &:hover {
                color: #409EFF;
              }
            }
          }

          a {
            display: inline-block;
            color: #353536;

            &:hover {
              color: #409EFF;
            }
          }

          p {
            margin: 10px 0;
            line-height: 20px;
            font-size: 13px;
          }

          h3 {
            margin: 10px 0;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
