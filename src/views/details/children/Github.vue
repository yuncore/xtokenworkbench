<template>
    <div id="github">
        <div v-if="githubProjects.length > 0">
            <div class="head">
                <img src="../../../../static/img/detail_github.svg">
                <a :href="'http://www.github.com/'+githubProjects[0]['full_name']"
                   target="_blank">
                    Github<em>({{githubProjects[0]['full_name']}})</em>
                </a>
                <div class="basic-info right">
                    <ul>
                        <li>
                            <span>
                                {{githubProjects[0]['subscribers_count']}}
                                <em>{{$t('page.currencyDetail.t3')}}</em>
                            </span>
                        </li>
                        <li>
                            <span>
                                {{githubProjects[0]['watchers']}}
                                <em>{{$t('page.currencyDetail.t6')}}</em>
                            </span>
                        </li>
                        <li>
                            <span>
                                {{githubProjects[0]['forks']}}
                                <em>{{$t('page.currencyDetail.t7')}}</em>
                            </span>
                        </li>
                        <li>
                            <span>
                                {{githubProjects[0]['open_issues_count']}}
                                <em>{{$t('page.currencyDetail.t8')}}</em>
                            </span>
                        </li>
                        <li>
                            <span>
                                {{githubProjects[0]['language']}}
                                <em>{{$t('page.currencyDetail.t9')}}</em>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <el-row class="code-chart-area">
                <el-col class="commit-card">
                    <p class="label">Commits</p>
                    <div ref="commitChart" class="commit-chart"></div>
                </el-col>
                <el-col class="code-f-card">
                    <p class="label">Code Frequency</p>
                    <div ref="codeFrequencyChart" class="code-frequency-chart"></div>
                </el-col>
            </el-row>
            <ul class="user-info-area">
                <li v-for="(user, index) in githubUsers"
                    :key="index"
                    class="github-user">
                    <div class="basic cf">
                        <a class="avatar left" :href="user.author.html_url" target="_blank">
                            <img :src="user.author.avatar_url">
                        </a>
                        <div class="names">
                            <p class="login">
                                <a :href="user.author.html_url" target="_blank">
                                    {{user.author.login}}
                                </a>
                            </p>
                            <p class="real-name">
                                <a :href="user.author.html_url" target="_blank">
                                    {{user.author.name}}
                                </a>
                            </p>
                        </div>
                    </div>
                    <ul class="detail">
                        <li>
                            <p class="number">{{user.total}}</p>
                            <p>commits</p>
                        </li>
                        <li>
                            <p class="number">{{user.author.followers}}</p>
                            <p>followers</p>
                        </li>
                        <li>
                            <p class="number">{{user.author.following}}</p>
                            <p>following</p>
                        </li>
                    </ul>
                    <div :ref="'user_commit_chart'+index" class="user-commit-chart">
                    </div>
                </li>
            </ul>
        </div>
        <div v-else>
            暂无数据
        </div>
    </div>
</template>

<script>
import net_util from "../../../assets/js/net_utils";
import config from "../../../assets/js/config";
import utils from "../../../assets/js/utils";
import echarts from "echarts";

export default {
  name: "Github",
  data() {
    return {
      id: this.$route.query.id,
      name: this.$route.query.name,
      githubProjects: "",
      githubUsers: "",
      githubCommitSCA: "",
      githubCommitSCF: ""
    };
  },
  methods: {
    init() {
      this.getGithubProject()
        .then(() => {
          if (this.githubProjects.length > 0) {
            let id = this.githubProjects[0]["id"];
            this.getGithubCommitSCA(id).then(() => {
              this.drawSCA(this.githubCommitSCA);
            });
            this.getGithubCodeFrequency(id).then(() => {
              this.drawSCF(this.githubCommitSCF);
            });
            this.getGithubUser().then(() => {
              let max = 0;
              this.githubUsers[0]["weeks"].forEach(item => {
                max = Math.max(item.c, max);
              });
              this.githubUsers.forEach((item, index) => {
                this.drawGithubUserCommit(item.weeks, index, max);
              });
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 获取GitHub项目的基本信息
    getGithubProject() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/github/project`;
        let data = {
          currency_name: this.name
        };
        let succ = res => {
          this.githubProjects = res.data;
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取对GitHub提交过代码的人的基本信息
    getGithubUser() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/github/user`;
        let data = {
          currency_name: this.name
        };
        let succ = res => {
          this.githubUsers = res;
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取GitHub sca分析的数据
    getGithubCommitSCA(project_id) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/github/stat`;
        let data = {
          project_id: project_id,
          type: "sca"
        };
        let succ = res => {
          this.githubCommitSCA = res;
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取GitHub code frequency的基本信息
    getGithubCodeFrequency(project_id) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/github/stat`;
        let data = {
          project_id: project_id,
          type: "scf"
        };
        let succ = res => {
          this.githubCommitSCF = res;
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 使用echarts绘制用户代码贡献图表
    drawGithubUserCommit(user_commit_data, index, max) {
      let chart = echarts.init(this.$refs["user_commit_chart" + index][0]);
      let dateList = [];
      let valueList = [];
      user_commit_data.forEach(item => {
        dateList.push(item.w);
        valueList.push(item.c);
      });
      chart.setOption({
        xAxis: {
          show: false,
          data: dateList
        },
        yAxis: {
          max: max,
          show: false,
          splitLine: { show: false }
        },
        series: {
          type: "line",
          showSymbol: false,
          data: valueList,
          lineStyle: {
            normal: {
              width: 1,
              color: "rgba(251, 133, 50, 0.5)"
            }
          },
          areaStyle: {
            normal: {
              color: "#fb8532"
            }
          },
          smooth: true
        }
      });
    },
    // 使用echarts绘制项目代码addition and deletion
    drawSCF(scf_data) {
      let myChart = echarts.init(this.$refs.codeFrequencyChart);
      myChart.clear();
      let timeData = [];
      let data_addition = [];
      let data_deletion = [];
      scf_data.forEach(item => {
        timeData.push(this.getSmpFormatDateByLong(item[0] * 1000, false));
        data_addition.push(item[1]);
        data_deletion.push(item[2]);
      });
      myChart.setOption({
        grid: {
          x: "10%",
          y: "10%",
          x2: "10%",
          y2: "10%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            animation: false
          }
        },
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0],
            start: 0,
            end: 100
          },
          {
            type: "inside",
            yAxisIndex: [0],
            start: 0,
            end: 100
          }
        ],
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            axisLabel: {
              inside: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true
            },
            data: timeData
          }
        ],
        yAxis: [
          {
            type: "value",
            show: true,
            axisLabel: {
              formatter: function(value) {
                return `${value / 1000}K`;
              },
              textStyle: {
                color: "#999"
              }
            }
          }
        ],
        series: [
          {
            name: "addition",
            type: "line",
            showSymbol: false,
            data: data_addition,
            lineStyle: {
              normal: {
                width: 1,
                color: "#2cbe4e",
                borderWidth: 0
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#2cbe4e"
                  },
                  {
                    offset: 1,
                    color: "#2cbe4e"
                  }
                ])
              }
            }
          },
          {
            name: "deletion",
            type: "line",
            showSymbol: false,
            data: data_deletion,
            lineStyle: {
              normal: {
                width: 1,
                color: "#cb2431",
                borderWidth: 0
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#cb2431"
                  },
                  {
                    offset: 1,
                    color: "#cb2431"
                  }
                ])
              }
            }
          }
        ]
      });
    },
    // 使用echarts绘制项目代码每周更新频率
    drawSCA(sca_data) {
      let myChart = echarts.init(this.$refs.commitChart);
      myChart.clear();
      let dataAxis = [];
      let data = [];
      sca_data.forEach(item => {
        data.push(item.total);
        dataAxis.push(this.getSmpFormatDateByLong(item.week * 1000, false));
      });
      myChart.setOption({
        tooltip: {},
        grid: {
          x: "10%",
          y: "10%",
          x2: "10%",
          y2: "10%"
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: "#ff7c1f"
              }
            },
            data: data
          }
        ]
      });
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
#github {
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

    .basic-info {
        ul {
            font-size: 0;
            display: block;
            line-height: 35px;

            li {
                font-size: 14px;
                display: inline-block;
                font-weight: bold;
                margin-right: 15px;

                em {
                    font-size: 13px;
                    font-weight: normal;
                    font-style: normal;
                }
            }
        }
    }

    .code-chart-area {
        .label {
            font-size: 14px;
            line-height: 35px;
            color: #b7c4d4;
        }

        .commit-card {
            width: 400px;
            padding: 13px 16px;
            height: 270px;
            background: #FFF;

            .commit-chart {
                height: 205px;
            }
        }

        .code-f-card {
            width: 400px;
            height: 270px;
            padding: 13px 16px;
            margin-left: 20px;
            background: #FFF;

            .code-frequency-chart {
                height: 205px;
            }
        }
    }

    .user-info-area {
        margin-top: 20px;
        font-size: 0;

        .github-user {
            display: inline-block;
            font-size: 14px;
            width: 260px;
            height: 195px;
            background: #FFF;
            padding: 15px;
            margin-top: 20px;
            margin-right: 20px;
            box-sizing: border-box;

            &:nth-child(3n+0) {
                margin-right: 0;
            }

            .basic {
                .avatar {
                    margin-right: 25px;

                    img {
                        height: 40px;
                        width: 40px;
                        border-radius: 5px;
                    }
                }

                .names {
                    .login {
                        font-size: 16px;
                        font-weight: 600;
                    }
                }
            }

            .detail {
                display: block;
                margin-top: 10px;
                font-size: 0;

                li {
                    font-size: 14px;
                    text-align: center;
                    display: inline-block;
                    width: 75px;

                    .number {
                        font-weight: 600;
                    }
                }
            }

            .user-commit-chart {
                margin-top: 10px;
                height: 70px;
            }
        }
    }
}
</style>
