<template>
    <div>
        <div id="kol" class="container">
            <el-row :gutter="20">
                <el-col :span="8">
                    <h1>Keyword</h1>
                    <div class="card keyword">
                        <el-table :data="keywords" :header-cell-style="headCellStyle">
                            <el-table-column label="Word" align="center">
                                <template slot-scope="scope">
                                    <div @click="toKeywordStat(scope.row)" class="btn">
                                        {{scope.row['keyword']}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Refers" align="center">
                                <template slot-scope="scope">
                                    {{scope.row['user_count']}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="16">
                    <h1>Kol</h1>
                    <div class="card kol">
                        <el-table :data="kolList" :header-cell-style="headCellStyle">
                            <el-table-column align="center" width="55">
                                <template slot-scope="scope">
                                    <div @click="userNameClick(scope.row)">
                                        <img :src="subList.indexOf(scope.row['user_name']) > -1 ?'static/img/star_active.png' : 'static/img/star_not_active.png'">
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Name" align="center">
                                <template slot-scope="scope">
                                    <div @click="toUserDetail(scope.row)" class="btn">
                                        {{scope.row['user_name']}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Activity" align="center">
                                <template slot-scope="scope">
                                    {{scope.row['activity']}}
                                </template>
                            </el-table-column>
                            <el-table-column label="Grade" align="center">
                                <template slot-scope="scope">
                                    {{scope.row['grade']}}
                                </template>
                            </el-table-column>
                            <el-table-column label="Comment" align="center">
                                <template slot-scope="scope">
                                    {{scope.row['num']}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="page-wrap">
                        <el-pagination
                            background
                            layout="total, prev, pager, next, jumper"
                            style="display: inline-block; vertical-align: middle"
                            :total="KOLCount"
                            :current-page="KOLCurrentPage"
                            :page-size=KOLCurrentNum
                            @current-change="handleKOLPageChange">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
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
      keywords: [],
      kolList: [],
      subList: [],
      KOLCount: 0,
      KOLCurrentPage: 0,
      KOLCurrentNum: 10,
      keywordsLoading: false,
      kolLoading: false,
      SITETYPE: consts.SITETYPE
    };
  },
  methods: {
    userNameClick(row) {
      if (this.subList.indexOf(row.user_name) > -1) {
        this.$alert(
          `Do you want to unsubscribe ${row.user_name}?`,
          "Unsubscribe",
          {
            confirmButtonText: "confirm"
          }
        ).then(() => {
          this.unSubUser(row.user_name);
        });
      } else {
        this.$alert(
          `Do you want to subscribe to ${row.user_name}?`,
          "subscribe",
          {
            confirmButtonText: "confirm"
          }
        ).then(() => {
          this.subUser(row.user_name);
        });
      }
    },
    getSubList() {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + "/subs/person/list";
        let succ = res => {
          if (!res.errorMsg) {
            let list = [];
            if (res.result && res.result.length > 0) {
              res.result.forEach(item => {
                if (item["type"] === 1) {
                  list.push(item["person"]);
                }
              });
            }
            this.subList = list;
            resolve();
          } else {
            reject();
          }
        };
        net_util.getRequest(url, {}, succ, reject);
      });
    },
    unSubUser(userName) {
      let url = config.JAVABASEDOMAIN + "/subs/person/del";
      let data = { type: this.SITETYPE.btt, person: userName };
      let succ = res => {
        if (!res.errorMsg) {
          this.getSubList();
          this.$message({ type: "success", message: this.$t("success") });
        } else {
          this.$message({ type: "error", message: this.$t("error") });
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: this.$t("error") });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    subUser(userName) {
      let url = config.JAVABASEDOMAIN + "/subs/person/add";
      let data = { type: this.SITETYPE.btt, person: userName };
      let succ = res => {
        if (!res.errorMsg) {
          this.getSubList();
          this.$message({ type: "success", message: this.$t("error") });
        } else {
          this.$message({ type: "error", message: this.$t("error") });
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: this.$t("error") });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    getKeywords() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/stat/keywords`;
        let data = {};
        let succ = res => {
          this.keywords = res;
          resolve();
        };
        let fail = res => {
          this.$message({ type: "error", message: this.$t("error") });
        };
        net_util.getRequest(url, data, succ, fail);
      });
    },
    getKolList(page = 1, num = 10) {
      this.kolLoading = true;
      let url = config.PYTHONBASEDOMAIN + `/bitcointalk/kol/list`;
      let data = {
        page: page,
        num: num
      };
      let succ = res => {
        this.kolList = res["data"];
        this.KOLCount = res["count"];
        this.KOLCurrentNum = num;
        this.KOLCurrentPage = page;
      };
      let fail = res => {
        this.$message({ type: "error", message: this.$t("error") });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    handleKOLPageChange(val) {
      this.getKolList(val);
    },
    toUserDetail(row) {
      let query = {
        user_id: row["user_id"],
        user_name: row["user_name"]
      };
      this.$router.push({ name: "btt_user_history", query: query });
    },
    toKeywordStat(row) {
      let query = {
        keyword: row["keyword"]
      };
      this.$router.push({ name: "keywords", query: query });
    },
    headCellStyle() {
      return {
        padding: 0,
        "line-height": "40px",
        "font-weight": "normal"
      };
    }
  },
  mounted() {
    this.getKeywords().then(() => {
      this.getKolList();
      this.getSubList();
    });
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../static/css/base.styl';

#kol {
  h1 {
    font-size: 20px;
    font-weight: normal;
    margin-top: 0;
  }

  .page-wrap {
    margin: 10px;
    text-align: right;
  }

  .keyword .btn {
    cursor: pointer;
    color: #409EFF;
  }

  .kol .btn {
    cursor: pointer;
    color: #409EFF;
  }
}
</style>
