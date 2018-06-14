<template>
    <div id="charts">
        <div class="charts-top">
            <span class="label">{{chartType === 1 ? 'Price Trend' : 'History Rank'}}</span>
            <el-button type="primary"
                       class="right"
                       size="mini"
                       @click="changeChartType">
                {{chartType === 1 ? 'History Rank' : 'Price'}}
            </el-button>
        </div>
        <div class="charts-area" ref="price_charts">
        </div>
    </div>
</template>

<script>
import net_util from "../../../assets/js/net_utils";
import config from "../../../assets/js/config";
import utils from "../../../assets/js/utils";
import echarts from "echarts";

export default {
  name: "Charts",
  data() {
    return {
      chartType: 1,
      id: this.$route.query.id,
      name: this.$route.query.name,
      currencyPrice: "",
      historyPrice: "",
      currencyHistoryRankData: false
    };
  },
  watch: {
    chartType(val) {
      val === 1 ? this.drawPriceChart() : this.drawHistoryRank();
    }
  },
  methods: {
    init() {
      this.getCurrencyPrice()
        .then(() => {
          this.getCurrencyHistoryRank();
        })
        .then(() => {
          this.drawPriceChart();
        })
        .catch(e => {
          console.log(e);
        });
    },
    changeChartType() {
      this.chartType === 1 ? (this.chartType = 2) : (this.chartType = 1);
    },
    // 获取货币的价格信息
    getCurrencyPrice() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/currency/price`;
        let data = {
          id: this.id,
          history: true
        };
        let succ = res => {
          this.currencyPrice = res["current_price"][0];
          this.historyPrice = res["history_price"]["data"];
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取货币的历史排名
    getCurrencyHistoryRank() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/currency/history/rank`;
        let data = {
          id: this.id
        };
        let succ = res => {
          this.currencyHistoryRankData = res;
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 绘制货币历史价格图
    drawPriceChart() {
      let myChart = echarts.init(this.$refs.price_charts);
      myChart.clear();
      let price_btc = [];
      let price_usd = [];
      let time_data_btc = [];
      let time_data_usd = [];
      let history_price = JSON.parse(this.historyPrice);
      history_price["price_btc"].forEach(item => {
        let t = this.getGMT8Time(item[0]);
        let long_t = t.getTime();
        if (!(time_data_btc.indexOf(long_t) > -1)) {
          time_data_btc.push(long_t);
          price_btc.push({
            name: t,
            value: [this.getSmpFormatDateByLong(long_t), item[1]]
          });
        }
      });
      history_price["price_usd"].forEach(item => {
        let t = this.getGMT8Time(item[0]);
        let long_t = t.getTime();
        if (!(time_data_usd.indexOf(long_t) > -1)) {
          time_data_usd.push(long_t);
          price_usd.push({
            name: t,
            value: [this.getSmpFormatDateByLong(t.getTime()), item[1]]
          });
        }
      });
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
          label: {
            backgroundColor: "#777"
          }
        },
        legend: {
          data: ["price_btc", "price_usd", "comment_num"]
        },
        xAxis: [
          {
            type: "time",
            splitLine: {
              show: false
            },
            min: "dataMin",
            max: "dataMax",
            axisPointer: {
              z: 100
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            position: "left",
            name: "price_btc",
            splitLine: {
              show: false
            }
          },
          {
            type: "value",
            position: "right",
            name: "price_usd",
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "price_btc",
            type: "line",
            data: price_btc,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          },
          {
            name: "price_usd",
            type: "line",
            data: price_usd,
            yAxisIndex: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          }
        ]
      });
    },
    //使用echarts绘制货币历史排名图表
    drawHistoryRank() {
      let myChart = echarts.init(this.$refs.price_charts);
      myChart.clear();
      let marketCapRank = this.currencyHistoryRankData;
      let rank = marketCapRank.map((item, index) => {
        return {
          name: new Date(item[0] * 1000),
          value: [this.getSmpFormatDateByLong(item[0] * 1000), item[1] + 1]
        };
      });
      let total = marketCapRank.map((item, index) => {
        return {
          name: new Date(item[0] * 1000),
          value: [this.getSmpFormatDateByLong(item[0] * 1000), item[2]]
        };
      });
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
          label: {
            backgroundColor: "#777"
          }
        },
        legend: {
          data: ["Rank", "Total"]
        },
        dataZoom: [
          {
            type: "slider",
            yAxisIndex: 0,
            filterMode: "empty",
            left: 20
          },
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "empty",
            bottom: 0
          }
        ],
        xAxis: [
          {
            type: "time",
            splitLine: {
              show: false
            },
            min: "dataMin",
            max: "dataMax",
            axisLine: {
              onZero: false
            },
            axisPointer: {
              z: 100
            },
            position: "bottom"
          }
        ],
        yAxis: [
          {
            type: "value",
            position: "left",
            //name: 'Rank',
            splitLine: {
              show: false
            },
            inverse: true
          },
          {
            type: "value",
            position: "right",
            name: "Total",
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "Rank",
            type: "line",
            data: rank,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          },
          {
            name: "Total",
            type: "line",
            data: total,
            yAxisIndex: 1,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          }
        ]
      });
    },
    getGMT8Time(t) {
      let d = new Date(t);
      d.setHours(8);
      d.setMinutes(0);
      d.setSeconds(0);
      return d;
    },
    getSmpFormatDateByLong: utils.getSmpFormatDateByLong
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#charts {
    background: #FFF;
    padding: 20px;

    .charts-top {
        height: 60px;

        .label {
            font-size: 13px;
            color: #b7c4d4;
        }
    }

    .charts-area {
        height: 450px;
    }
}
</style>
