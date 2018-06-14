<template>
    <div id="reddit">
        <div v-if="subReddit.length > 0">
            <div class="head">
                <img src="../../../../static/img/detail_reddit.svg">
                <a :href="'http://www.reddit.com'+subReddit[0]['url']"
                   target="_blank">
                    Reddit<em>({{'http://www.reddit.com' + subReddit[0]['url']}})</em>
                </a>
                <div class="basic-info right">
                    <ul>
                        <li>
                            <span>
                                {{subReddit[0]['subscribers']}}
                                <em>{{$t('page.currencyDetail.t3')}}</em>
                            </span>
                        </li>
                        <li>
                            <span>
                                {{subReddit[0]['accounts_active']}}
                                <em>{{$t('page.currencyDetail.t4')}}</em>
                            </span>
                        </li>
                        <li>
                            <span>
                                {{getSmpFormatDateByLong(subReddit[0]['created'] * 1000, false)}}
                                <em>{{$t('page.currencyDetail.t5')}}</em>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="redditPageType === 1" class="posts">
                <div class="top">
                    <el-dropdown class="drop-down" @command="handleRedditPostDaysCommand">
                            <span class="el-dropdown-link">
                                {{$t('page.currencyDetail.'+REDDITDAYSDROPDOWN[redditPostCurrentDayIndex]['i18n'])}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item, index) in REDDITDAYSDROPDOWN" :command="item.command" :key="index">
                                {{$t('page.currencyDetail.'+item.i18n)}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown class="drop-down" @command="handleRedditPostSortCommand">
                            <span class="el-dropdown-link">
                                {{$t('page.currencyDetail.'+REDDITPOSTSORTFIELD[redditPostCurrentSortIndex]['i18n'])}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item, index) in REDDITPOSTSORTFIELD" :command="item.command" :key="index">
                                {{$t('page.currencyDetail.'+item.i18n)}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <!--<el-dropdown class="drop-down" @command="handleRedditPostExpressionCommand">
                            <span class="el-dropdown-link">
                                {{$t('page.currencyDetail.'+REDDITPOSTEXPRESSION[redditPostCurrentExpressionIndex]['i18n'])}}
                                <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item, index) in REDDITPOSTEXPRESSION" :command="item.command" :key="index">
                                {{$t('page.currencyDetail.'+item.i18n)}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>-->
                    <el-button
                        @click="redditPageType = 2"
                        size="mini"
                        type="primary"
                        class="right">
                        User Rank
                    </el-button>
                </div>
                <ul class="table">
                    <li v-for="(item, index) in redditLink" :key="index" class="table-item">
                        <div class="logo">
                            <img :src="postItemThumbnail(item.thumbnail)">
                        </div>
                        <div class="content">
                            <p class="title">
                                <a :href="item['url']" target="_blank">
                                    {{item.title.length > 160 ? `${item.title.slice(0, 160)}...` : item.title}}
                                </a>
                                <em>({{item.domain}})</em>
                            </p>
                            <p class="left-info">
                                <span class="name">
                                    <a :href="'https://www.reddit.com/user/' + item['author']"
                                       target="_blank">
                                        {{item.author}}
                                    </a>
                                </span>
                                <span class="date">
                                    {{getSmpFormatDateByLong(item.created * 1000, false)}}
                                </span>
                            </p>
                            <p class="right-info">
                                <span class="score">{{item.score}} <em>Score</em></span>
                                <span class="comments">{{item.num_comments}} <em>Comments</em></span>
                            </p>
                        </div>
                    </li>
                    <div class="divider"></div>
                </ul>
                <div class="pagination">
                    <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :total="redditPostCount"
                        :current-page="redditPostCurrentPage"
                        :page-size=redditPostCurrentNum
                        @current-change="handleRedditPostPageChange"
                        @size-change="handleRedditPostSizeChange">
                    </el-pagination>
                </div>
            </div>
            <div v-else class="users">
                <div class="top">
                    <el-button
                        @click="redditPageType = 1"
                        type="primary"
                        size="mini"
                        class="right">
                        Posts
                    </el-button>
                </div>
                <div v-if="redditUser && redditUser['post_key_user']" class="post-key-user">
                    <p class="label">Post Rank</p>
                    <el-table
                        stripe
                        :data="redditUser['post_key_user']">
                        <el-table-column
                            :label="$t('page.currencyDetail.th9')">
                            <template slot-scope="scope">
                                <a :href="'http://www.reddit.com/user/'+ scope.row.author"
                                   target="_blank">{{scope.row.author}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="size"
                            :label="$t('page.currencyDetail.th21')">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            :label="$t('page.currencyDetail.th13')">
                            <template slot-scope="scope">
                                {{Math.floor(scope.row['mean'])}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            :label="$t('page.currencyDetail.th14')"
                            prop="sum"
                            align="center">
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="redditUser && redditUser['comment_key_user']" class="comment-key-user">
                    <p class="label">Comment Rank</p>
                    <el-table
                        stripe
                        :data="redditUser['comment_key_user']">
                        <el-table-column
                            :label="$t('page.currencyDetail.th9')">
                            <template slot-scope="scope">
                                <a :href="'http://www.reddit.com/user/'+ scope.row.author"
                                   target="_blank">{{scope.row.author}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="size"
                            :label="$t('page.currencyDetail.th11')">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            :label="$t('page.currencyDetail.th13')">
                            <template slot-scope="scope">
                                {{Math.floor(scope.row['mean'])}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            :label="$t('page.currencyDetail.th14')"
                            prop="sum"
                            align="center">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
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

const REDDITDAYSDROPDOWN = [
  { text: "最近一周", days: 7, command: "week", i18n: "t14" },
  { text: "最近一个月", days: 30, command: "month", i18n: "t15" },
  { text: "最近半年", days: 180, command: "h-year", i18n: "t16" },
  { text: "全部", days: null, command: "all", i18n: "t17" }
];

const REDDITPOSTSORTFIELD = [
  { text: "回复最多", field: "num_comments", command: "num", i18n: "t18" },
  { text: "得分最高", field: "ups", command: "ups", i18n: "t19" },
  { text: "创建最早", field: "created", command: "time", i18n: "t20" }
];

const REDDITPOSTEXPRESSION = [
  { text: "详细数据", command: "data", i18n: "t21" },
  { text: "走势图", command: "graph", i18n: "t22" }
];

export default {
  name: "Reddit",
  data() {
    return {
      id: this.$route.query.id,
      name: this.$route.query.name,
      subReddit: [],
      redditPageType: 1,
      redditUser: null,
      redditCurrentPostDays: null,
      redditPostCurrentPage: 1,
      redditPostCurrentNum: 10,
      redditPostCurrentSort: "num_comments",
      redditPostCount: 0,
      redditLink: [],
      redditPostCurrentDayIndex: 3,
      redditPostCurrentSortIndex: 0,
      redditPostCurrentExpressionIndex: 0,
      redditPostTimeDistribution: null,
      REDDITDAYSDROPDOWN: REDDITDAYSDROPDOWN,
      REDDITPOSTSORTFIELD: REDDITPOSTSORTFIELD,
      REDDITPOSTEXPRESSION: REDDITPOSTEXPRESSION
    };
  },
  watch: {
    redditPostCurrentDayIndex: function(val) {
      let d = this.REDDITDAYSDROPDOWN[val]["days"];
      /*try{
                    this.drawRedditPostTimeDistributeChart()
                }
                catch(e){
                    console.log(e)
                }*/
      this.getRedditPosts(
        1,
        this.redditPostCurrentNum,
        this.redditPostCurrentSort,
        d
      );
    },
    redditPostCurrentSortIndex: function(val) {
      let f = this.REDDITPOSTSORTFIELD[val]["field"];
      this.getRedditPosts(
        1,
        this.redditPostCurrentNum,
        f,
        this.redditCurrentPostDays
      );
    }
    /*redditPostCurrentExpressionIndex: function(val){
                if(val === 1){
                    if(this.redditPostTimeDistribution === null){
                        this.getSubredditTimeDistribute('link').then(res => {
                            this.drawRedditPostTimeDistributeChart()
                        })
                    }else{
                        this.$nextTick(() => {
                            this.drawRedditPostTimeDistributeChart()
                        })
                    }
                }
            },*/
  },
  methods: {
    init() {
      this.getSubReddit()
        .then(() => {
          if (this.subReddit.length > 0) {
            this.getRedditPosts();
            this.getRedditKeyUser();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 获取subreddit的基本信息
    getSubReddit() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/reddit/subreddit`;
        let data = {
          currency_name: this.name
        };
        let succ = res => {
          this.subReddit = res.data;
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取reddit key user 列表
    getRedditKeyUser() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/reddit/keyuser`;
        let data = {
          currency_name: this.name
        };
        let succ = res => {
          this.redditUser = res;
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取关联的reddit帖子
    getRedditPosts(
      page = 1,
      num = 10,
      sort_field = "num_comments",
      days = null
    ) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/reddit/post`;
        let data = {
          sr_name: this.subReddit[0]["display_name"],
          sort_field: sort_field,
          page: page,
          num: num
        };
        if (days) {
          data["days"] = days;
        }
        let succ = res => {
          this.redditCurrentPostDays = days;
          this.redditPostCurrentPage = page;
          this.redditPostCurrentNum = num;
          this.redditPostCurrentSort = sort_field;
          this.redditPostCount = res["count"];
          this.redditLink = res.data;
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取subreddit中发帖或者评论的日分布图
    getSubredditTimeDistribute(type) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/stat/reddit/distribute`;
        let data = {
          type: type,
          sr_name: this.subReddit[0]["display_name"]
        };
        let succ = res => {
          this.redditPostTimeDistribution = JSON.parse(res);
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // reddit post 选择时间
    handleRedditPostDaysCommand(command) {
      REDDITDAYSDROPDOWN.forEach((item, index) => {
        if (item.command === command) {
          this.redditPostCurrentDayIndex = index;
        }
      });
    },
    // reddit post 列表分页相关的方法
    handleRedditPostSortCommand(command) {
      REDDITPOSTSORTFIELD.forEach((item, index) => {
        if (item.command === command) {
          this.redditPostCurrentSortIndex = index;
        }
      });
    },
    handleRedditPostExpressionCommand(command) {
      REDDITPOSTEXPRESSION.forEach((item, index) => {
        if (item.command === command) {
          this.redditPostCurrentExpressionIndex = index;
        }
      });
    },
    handleRedditPostPageChange(val) {
      if (val !== this.redditPostCurrentPage) {
        this.getRedditPosts(
          val,
          this.redditPostCurrentNum,
          this.redditPostCurrentSort,
          this.redditCurrentPostDays
        );
      }
    },
    handleRedditPostSizeChange(val) {
      this.getRedditPosts(
        1,
        val,
        this.redditPostCurrentSort,
        this.redditCurrentPostDays
      );
    },
    // subreddit中发帖或评论的日分布图
    drawRedditPostTimeDistributeChart() {
      let i = Math.min(
        this.REDDITDAYSDROPDOWN[this.redditPostCurrentDayIndex]["days"],
        180
      );
      let data = this.redditPostTimeDistribution.slice(-i, -1);
      let dx = [];
      let dy = [];
      data.forEach(d => {
        dx.push(this.getSmpFormatDateByLong(d[0], false));
        dy.push(d[1]);
      });
      let dom = document.getElementById("redditPostDistributeChart");
      let myChart = echarts.init(dom);
      myChart.clear();
      myChart.setOption({
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: dx,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            type: "bar",
            data: dy
          }
        ]
      });
    },
    postItemThumbnail(url) {
      if (url === "self") {
        return "static/img/gtihub.svg";
      } else {
        return url;
      }
    },
    getSmpFormatDateByLong: utils.getSmpFormatDateByLong
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#reddit {
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
    }

    .posts {
        margin-top: 20px;
        background: #FFF;

        .top {
            padding: 20px;

            .drop-down {
                margin-right: 40px;

                .el-dropdown-link {
                    cursor: pointer;
                }
            }
        }

        .table {
            .table-item {
                padding: 25px 30px;
                position: relative;

                .logo {
                    display: inline-block;
                    float: left;
                    line-height: 70px;

                    img {
                        width: 70px;
                        height: 70px;
                    }
                }

                .content {
                    margin-left: 100px;
                    height: 70px;
                    position: relative;

                    .title {
                        font-size: 16px;

                        em {
                            font-size: 13px;
                            color: #999999;
                        }
                    }

                    .left-info {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        font-size: 13px;

                        .name {
                            margin-right: 10px;
                        }

                        .date {
                            color: #999999;
                        }
                    }

                    .right-info {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        font-size: 13px;

                        .score {
                            margin-right: 10px;
                        }

                        em {
                            color: #999999;
                        }
                    }
                }

                &:after {
                    content: '';
                    background-color: beige;
                    position: absolute;
                    width: 760px;
                    height: 1px;
                    left: 50%;
                    bottom: 0;
                    transform: translateX(-50%);
                }
            }
        }

        .pagination {
            text-align: right;
            padding: 20px;
        }
    }

    .users {
        background: #FFF;
        margin-top: 20px;

        .top {
            padding: 20px;
        }

        .label {
            padding: 0 10px;
            font-size: 14px;
            color: #b7c4d4;
            line-height: 35px;
        }

        .post-key-user {
            margin-top: 20px;
        }

        .comment-key-user {
            margin-top: 20px;
        }
    }
}
</style>
