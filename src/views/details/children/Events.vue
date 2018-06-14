<template>
    <div id="event">
        <div class="head">
            <img src="../../../../static/img/detail_btt.svg">
            <span>XToken</span>
        </div>
        <div class="events">
            <el-table
                :data="xtokenEventList">
                <el-table-column
                    min-width="250"
                    show-overflow-tooltip="true"
                    :label="$t('page.currencyDetail.th6')">
                    <template slot-scope="scope">
                        <router-link :to="'/index/event/detail?id='+ scope.row.id" style="font-size: 14px;">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('page.currencyDetail.th15')"
                    align="center">
                    <template slot-scope="scope">
                        {{eventType[scope.row.type]}}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('page.currencyDetail.th16')"
                    max-width="180">
                    <template slot-scope="scope">
                        {{calcVoteState(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('page.currencyDetail.th17')">
                    <template slot-scope="scope">
                        {{scope.row.trueFalseStat ? scope.row.trueFalseStat.all1Percent  : '--'}}
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('page.currencyDetail.th18')"
                    align="center"
                    max-width="180">
                    <template slot-scope="scope">
                        {{scope.row.trueFalseStat ? scope.row.trueFalseStat.all0Percent : '--'}}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('page.currencyDetail.th19')">
                    <template slot-scope="scope">
                        {{scope.row.roseFallStat ? scope.row.roseFallStat.all1Percent : '--'}}
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('page.currencyDetail.th20')"
                    align="center">
                    <template slot-scope="scope">
                        {{scope.row.roseFallStat ? scope.row.roseFallStat.all0Percent : '--'}}
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('page.currencyDetail.t5')"
                    align="center">
                    <template slot-scope="scope">
                        {{getDateDiff(scope.row.pusTime)}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import net_util from "../../../assets/js/net_utils";
import config from "../../../assets/js/config";
import utils from "../../../assets/js/utils";
import consts from "../../../assets/js/consts";

export default {
  name: "Events",
  data() {
    return {
      id: this.$route.query.id,
      name: this.$route.query.name,
      xtokenEventList: [],
      eventType: consts.eventType
    };
  },
  methods: {
    init() {
      this.getXtokenRelatedEvent()
        .then(() => {
          this.getAllXtokenEventStat();
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 获取和货币相关联的事件列表
    getXtokenRelatedEvent() {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + "/event/site/pros/list";
        let data = {
          id: this.id
        };
        let succ = res => {
          if (!res.errorMsg) {
            this.xtokenEventList = res.result;
            resolve();
          } else {
            reject();
          }
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 获取事件投票情况
    getAllXtokenEventStat() {
      for (let i = 0; i < this.xtokenEventList.length; i++) {
        if (this.xtokenEventList[i]["roseFall"] === 1) {
          this.getXtokenEventStat(this.xtokenEventList[i]["id"], 0, i);
        }
        if (this.xtokenEventList[i]["trueFalse"] === 1) {
          this.getXtokenEventStat(this.xtokenEventList[i]["id"], 1, i);
        }
      }
    },
    getXtokenEventStat(id, type, index) {
      function calcPercent(stat) {
        let all0Num = stat.all0Num;
        let all1Num = stat.all1Num;
        let count = all0Num + all1Num;
        if (count === 0) {
          stat.all0Percent = "--";
          stat.all1Percent = "--";
        } else {
          stat.all0Percent = all0Num / count * 100 + "%";
          stat.all1Percent = all1Num / count * 100 + "%";
        }
        return stat;
      }
      let url = config.JAVABASEDOMAIN + "/event/site/vote/stat";
      let data = {
        eventId: id,
        type: type
      };
      let succ = res => {
        if (!res.errorMsg) {
          if (type === 0) {
            this.xtokenEventList[index]["roseFallStat"] = calcPercent(
              res.result
            );
          } else {
            this.xtokenEventList[index]["trueFalseStat"] = calcPercent(
              res.result
            );
          }
        }
      };
      net_util.getRequest(url, data, succ, () => {});
    },
    // 计算投票结果
    calcVoteState(item) {
      let state = [
        { type: 0, text: this.$t("page.currencyDetail.t11") },
        { type: 1, text: this.$t("page.currencyDetail.t12") },
        { type: 2, text: this.$t("page.currencyDetail.t13") }
      ];
      let now = new Date();
      let start = item.voteStartTime;
      let end = item.voteEndTime;
      if (now < start) {
        return state[0].text;
      } else if (now > end) {
        return state[2].text;
      } else {
        return state[1].text;
      }
    },
    getDateDiff: utils.getDateDiff
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#event {
    .head {
        line-height: 35px;
        height: 35px;

        img {
            height: 25px;
            width: 25px;
            vertical-align: middle;
        }

        span {
            font-size: 15px;
            line-height: 35px;
            color: #333333;
            font-weight: bold;
        }
    }

    .events {
        margin-top: 20px;
    }
}
</style>
