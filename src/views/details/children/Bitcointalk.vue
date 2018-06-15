<template>
    <div id="bitcointalk">
        <div v-if="bttLink.length > 0">
            <div class="head">
                <img src="../../../../static/img/detail_btt.svg">
                <a :href="bttLink[0]['link_url']" target="_blank">{{bttLink[0]['title']}}</a>
            </div>
            <div class="chart">
                <div class="label">Top 100 user relations</div>
                <div class="relation-chart" ref="userRelationChart"></div>
            </div>
            <div class="chart">
                <div class="label">Comments Distribute</div>
                <div class="history-chart" ref="historyPriceChart"></div>
            </div>
        </div>
        <div v-else>
            <img class="empty" src="../../../../static/img/no_data.png">
        </div>
    </div>
</template>

<script>
import net_util from "../../../assets/js/net_utils";
import config from "../../../assets/js/config";
import utils from "../../../assets/js/utils";
import echarts from "echarts";
import consts from "../../../assets/js/consts";

export default {
  name: "Bitcointalk",
  data() {
    return {
      bttLink: [],
      id: this.$route.query.id,
      name: this.$route.query.name,
      currencyPrice: "",
      historyPrice: ""
    };
  },
  methods: {
    init() {
      this.getBttLinks()
        .then(() => {
          return this.getCurrencyPrice();
        })
        .then(() => {
          if (this.bttLink.length > 0) {
            let id = this.bttLink[0]["id"];
            this.getBttTimeDistributeData(id).then(res => {
              this.drawBttCommentTiemDistributeChart(res);
            });
            this.getBttUserRelation(id).then(res => {
              this.drawBTTUserRelation(res);
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 获取btt中的用户关联关系数据
    getBttUserRelation(link_id) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/bitcointalk/user/relation`;
        let data = {
          link_id: link_id
        };
        let succ = res => {
          if (res) {
            resolve(res);
          }
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取随时间分布的价格和评论数量数据
    getBttTimeDistributeData(link_id) {
      return new Promise((resolve, reject) => {
        let url =
          config.PYTHONBASEDOMAIN + `/bitcointalk/comment/time/distribute`;
        let data = {
          link_id: link_id
        };
        let succ = res => {
          if (res) {
            resolve(res);
          }
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取关联的btt帖子
    getBttLinks() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/bitcointalk/link`;
        let data = {
          currency_name: this.name
        };
        let succ = res => {
          this.bttLink = res.data;
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 使用echarts绘制用户关系图
    drawBTTUserRelation(res) {
      let users = JSON.parse(res.user);
      let relations = JSON.parse(res.relation);
      let categories = JSON.parse(res.categories);
      let category_keys = Object.keys(categories);
      let category_indexes = consts.GRADE_ORDER;
      //将legend的数据按照特定的顺序排列
      category_keys.forEach((item, index) => {
        categories[item] = -1;
      });
      category_keys.forEach((item, index) => {
        for (let i = 0; i < category_indexes.length; i++) {
          if (category_indexes[i] === item) {
            categories[item] = i;
          }
        }
      });
      for (let i = 0; i < category_keys.length; i++) {
        for (let j = 0; j < category_keys.length - i - 1; j++) {
          if (categories[category_keys[j]] > categories[category_keys[j + 1]]) {
            let temp = category_keys[j];
            category_keys[j] = category_keys[j + 1];
            category_keys[j + 1] = temp;
          }
        }
      }
      let sorted_categories = category_keys.map(function(item) {
        return { name: item };
      });
      let myChart = echarts.init(this.$refs.userRelationChart);
      myChart.clear();
      myChart.setOption({
        color: [
          "#c23531",
          "#2f4554",
          "#61a0a8",
          "#d48265",
          "#91c7ae",
          "#749f83",
          "#ca8622",
          "#bda29a",
          "#6e7074",
          "#546570",
          "#c4ccd3"
        ],
        tooltip: {
          formatter: params => {
            return `name: ${params["data"]["name"]} <br />  grade: ${
              params["data"]["category"]
            } <br /> symbolSize: ${params["data"]["symbolSize"]}`;
          }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        legend: [
          {
            data: sorted_categories.map(function(item) {
              return item.name;
            }),
            orient: "vertical",
            left: 0,
            bottom: 0
          }
        ],
        series: [
          {
            type: "graph",
            layout: "circular",
            roam: true,
            circular: {
              rotateLabel: true
            },
            //                        layout: 'force',
            data: users.map(function(node) {
              return {
                id: node.user_id,
                name: node.author,
                category: node.grade,
                symbolSize: node.num
              };
            }),
            links: relations.map(function(edge) {
              return {
                source: edge.source,
                target: edge.target
              };
            }),
            categories: sorted_categories,
            label: {
              normal: {
                position: "right",
                show: true
              }
            },
            focusNodeAdjacency: true,
            lineStyle: {
              normal: {
                color: "source",
                curveness: 0.3
              }
            }
          }
        ]
      });
      myChart.on("click", params => {
        let query = {
          user_id: params["data"]["id"],
          user_name: params["data"]["name"]
        };
        this.$router.push({ name: "btt_user_history", query: query });
      });
    },
    // 使用echarts绘制btt中评论随时间的分布图
    drawBttCommentTiemDistributeChart(res) {
      let myChart = echarts.init(this.$refs.historyPriceChart);
      myChart.clear();
      let colors = [];
      let price_btc = [];
      let price_usd = [];
      let comment_dis = [];
      let history_price = JSON.parse(this.historyPrice);
      if (res.data) {
        let arr = JSON.parse(res.data);
        arr.forEach((item, index) => {
          let t = this.getGMT8Time(item[0]);
          comment_dis.push({
            name: t,
            value: [this.getSmpFormatDateByLong(t.getTime()), item[1]]
          });
        });
      }
      history_price["price_btc"].forEach((item, index) => {
        let t = this.getGMT8Time(item[0]);
        price_btc.push({
          name: t,
          value: [this.getSmpFormatDateByLong(t.getTime()), item[1]]
        });
      });
      history_price["price_usd"].forEach((item, index) => {
        let t = this.getGMT8Time(item[0]);
        price_usd.push({
          name: t,
          value: [this.getSmpFormatDateByLong(t.getTime()), item[1]]
        });
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
          },
          {
            type: "value",
            position: "right",
            offset: 60,
            name: "comments",
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
          },
          {
            name: "comment_num",
            type: "line",
            data: comment_dis,
            yAxisIndex: 2,
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
#bitcointalk {
    .head {
        line-height: 35px;
        height: 35px;

        img {
            height: 25px;
            width: 25px;
            vertical-align: middle;
        }

        a {
            font-size: 15px;
            line-height: 35px;
            color: #333333;
            font-weight: bold;

            em {
                font-weight: normal;
                font-size: 14px;
                color: #999999;
                font-style: normal;
            }
        }
    }

    .chart {
        background: #FFF;
        margin-top: 20px;
        padding: 20px;

        .label {
            font-size: 14px;
            color: #b7c4d4;
            line-height: 35px;
        }

        .relation-chart {
            height: 400px;
        }

        .history-chart {
            height: 400px;
        }
    }

    .empty{
      width: 300px;
      margin: 0 auto;
      display: block;
    }
}
</style>
