<template>
    <div id="keyWordStat">
        <div class="container">
            <h1 class="head-title">{{keyword}} / Bitcointalk</h1>
            <div class="card toggle-card chart"
                 v-show="chartCardShow">
                <div class="content">
                    <div ref="keywordChart" style="height: 600px; margin: 0 auto">
                    </div>
                </div>
            </div>
            <div class="card toggle-card rank">
                <div class="head" @click="toggleRankCard">
                    <div class="name">
                        最早提及{{keyword}}的前30位用户
                    </div>
                    <div class="right-icon">
                        <i class="el-icon-caret-top" v-if="rankCardShow"></i>
                        <i class="el-icon-caret-bottom" v-else></i>
                    </div>
                </div>
                <div class="content" v-show="rankCardShow">
                    <el-row :gutter="20">
                        <el-col :span="12" style="border-right: 1px solid #DCDFE6;">
                            <el-table :data="top30User.slice(0, 15)">
                                <el-table-column label="Rank" align="center">
                                    <template slot-scope="scope">
                                        <div v-if="scope.$index == 0">
                                            <img class="inline-img" src="static/img/rank1.svg">
                                        </div>
                                        <div v-else-if="scope.$index == 1">
                                            <img class="inline-img" src="static/img/rank2.svg">
                                        </div>
                                        <div v-else-if="scope.$index == 2">
                                            <img class="inline-img" src="static/img/rank3.svg">
                                        </div>
                                        <div v-else>
                                            {{scope.$index + 1}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Name" align="center">
                                    <template slot-scope="scope">
                                        <div class="btn" @click="getCommentsFromTable(scope.row)">
                                            {{scope.row[2]}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Grade" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row[3]}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Time" align="center">
                                    <template slot-scope="scope">
                                        {{getSmpFormatDateByLong(scope.row[0] , false)}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="12">
                            <el-table :data="top30User.slice(15)">
                                <el-table-column label="Rank" align="center">
                                    <template slot-scope="scope">
                                        {{scope.$index + 16}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Name" align="center">
                                    <template slot-scope="scope">
                                        <div class="btn" @click="getCommentsFromTable(scope.row)">
                                            {{scope.row[2]}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Grade" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row[3]}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="Time" align="center">
                                    <template slot-scope="scope">
                                        {{getSmpFormatDateByLong(scope.row[0], false)}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div id="comment_card"
                 class="card toggle-card comment"
                 v-loading="commentLoading"
                 element-loading-text="数据加载中"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="head" v-if="currentAuthor != ''">
                    <div class="name">
                        {{currentAuthor}}的评论
                    </div>
                    <div class="right-icon" style="display: none">
                        <i class="el-icon-caret-top" v-if="rankCardShow"></i>
                        <i class="el-icon-caret-bottom" v-else></i>
                    </div>
                </div>
                <div class="content">
                    <ul v-if="comments.length > 0">
                        <li v-for="(item, index) in comments" :key="index">
                            <div class="head">
                                <a :href="'https://bitcointalk.org/index.php?topic='+item['link_id'] + '.' + item.message_id + '#' + item.message_id"
                                   target="_blank">{{item['title']}}</a>
                            </div>
                            <div class="content" v-html="item['content']">
                            </div>
                            <div class="foot">
                                <span><a :href="item['user_profile_url']" target="_blank">{{item['author']}}</a> / {{getSmpFormatDateByLong(item['time'] * 1000)}}</span>
                            </div>
                        </li>
                    </ul>
                    <div class="tip" v-else>
                        暂无数据
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import net_util from "../../assets/js/net_utils";
import config from "../../assets/js/config";
import utils from "../../assets/js/utils";
import consts from "../../assets/js/consts";
import echarts from "echarts";

export default {
  data: function() {
    return {
      keyword: "",
      currentAuthor: "",
      top30User: [],
      comments: [],
      commentLoading: false,
      commentStatLoading: false,
      rankCardShow: true,
      chartCardShow: true
    };
  },
  methods: {
    scrollToElement() {
      let comment_card = document.getElementById("comment_card");
      comment_card.scrollIntoView(false);
    },
    getBttKeyWordStat(keyword) {
      this.commentStatLoading = true;
      let url = config.PYTHONBASEDOMAIN + `/bitcointalk/comment/stat/keyword`;
      let data = {
        keyword: keyword
      };
      let succ = res => {
        this.commentStatLoading = false;
        if (res) {
          this.drawKeyWordCharts(res);
          this.top30User = eval("(" + res.top30_data + ")");
          this.keyword = res.keyword;
        }
      };
      let fail = res => {
        this.commentStatLoading = false;
        this.$message({
          type: "error",
          message: res.responseJSON.message || "未知错误"
        });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    drawKeyWordCharts(res) {
      let res_data = res.data;
      let keyword = res.keyword;
      let grades = [];
      let series = [];
      for (let i = 0; i < res_data.length; i++) {
        grades.push(res_data[i]["grade"]);
        let series_item = {
          name: res_data[i]["grade"],
          data: JSON.parse(res_data[i]["data"]),
          type: "scatter",
          symbolSize: function(data) {
            return data[5];
          },
          label: {
            emphasis: {
              show: true,
              formatter: function(param) {
                return param.data[2];
              },
              position: "top"
            }
          },
          itemStyle: {
            normal: {
              opacity: 0.8,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        };
        series.push(series_item);
      }
      let myChart = echarts.init(this.$refs.keywordChart);
      myChart.clear();
      myChart.setOption({
        title: {
          text: ""
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {},
            restore: {},
            saveAsImage: {}
          },
          orient: "vertical",
          bottom: 0,
          right: 0
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "cross"
          },
          formatter: function(obj) {
            return (
              "name" +
              " : " +
              obj["data"][2] +
              "<br>" +
              "grade" +
              " : " +
              obj["data"][3] +
              "<br>"
            );
          }
        },
        legend: {
          orient: "vertical",
          right: 0,
          data: grades
        },
        grid: {
          right: 140
        },
        dataZoom: [
          {
            show: true,
            start: 94,
            end: 100,
            height: 25,
            bottom: "0%"
          },
          {
            type: "inside",
            start: 94,
            end: 100
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: "empty",
            width: 30,
            height: "80%",
            showDataShadow: false,
            left: "2%"
          }
        ],
        xAxis: {
          name: "time",
          type: "time",
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          }
        },
        yAxis: {
          name: "activity",
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          scale: true
        },
        series: series
      });
      myChart.on("click", params => {
        this.getComments(params.value, keyword);
      });
    },
    getCommentsFromTable(row) {
      this.getComments(row, this.keyword);
    },
    getComments(params, keyword) {
      this.commentLoading = true;
      this.scrollToElement();
      let url = config.PYTHONBASEDOMAIN + `/bitcointalk/comment`;
      let data = {
        author: params[2],
        keyword: keyword
      };
      let succ = res => {
        this.commentLoading = false;
        this.currentAuthor = params[2];
        let re = new RegExp(`\\b${keyword}\\b`, "gim");
        this.comments = res.map((item, index) => {
          item.content = item.content.replace(
            re,
            `<strong>${keyword}</strong>`
          );
          return item;
        });
      };
      let fail = res => {
        this.commentLoading = false;
        this.$message({
          type: "error",
          message: res.responseJSON.message || "未知错误"
        });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    toggleRankCard() {
      this.rankCardShow = !this.rankCardShow;
    },
    backToChartFromRank() {
      this.rankCardShow = false;
      this.chartCardShow = true;
    },
    getSmpFormatDateByLong: utils.getSmpFormatDateByLong
  },
  mounted() {
    this.keyword = this.$route.query.keyword;
    this.getBttKeyWordStat(this.keyword);
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../static/css/base.styl';

#keyWordStat {
    .head-title {
        font-size: 20px;
        font-weight: normal;
    }

    .chart {
        height: 680px;
    }

    .toggle-card {
        padding: 0;

        .content {
            padding: 20px 0;
        }

        .btn {
            cursor: pointer;
            color: #409EFF;
        }

        >.foot {
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
        }

        >.head {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;

            .name {
                display: inline-block;
                line-height: 70px;
                font-size: 18px;
                color: #38435b;
                margin-left: 20px;
                float: left;
            }
        }

        >.foot, >.head {
            cursor: pointer;
            height: 72px;
            text-align: center;
            background-color: #fafafa;

            .right-icon {
                line-height: 70px;
                color: #565454;
                float: right;
                margin-right: 15px;

                i {
                    font-size: 32px;
                    line-height: 70px;
                    cursor: pointer;
                }
            }
        }
    }

    .comment {
        min-height: 100px;

        >.content {
            padding: 10px 40px;
            overflow: auto;
        }

        .tip {
            text-align: center;
            line-height: 100px;
        }

        ul li {
            padding: 10px;
            line-height: 25px;
            border-bottom: 1px solid #E4E7ED;

            a {
                cursor: pointer;
                color: #333;

                &:hover {
                    color: #409EFF;
                }
            }

            .head {
                font-weight: 600;
            }

            .foot {
                font-size: 14px;
                text-align: right;
            }
        }
    }

    .rank .inline-img {
        position: absolute;
        height: 30px;
        width: 30px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
