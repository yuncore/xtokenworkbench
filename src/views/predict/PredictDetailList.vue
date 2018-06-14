<template>
    <div>
        <div class="container">
            <h1 class="title">
                {{id}}
            </h1>
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/predict' }">项目排行榜</el-breadcrumb-item>
            </el-breadcrumb>
            <el-table
                fit
                stripe
                :data="predictDetailList">
                <el-table-column
                    width="300"
                    label="用户"
                    align="center">
                    <template slot-scope="scope">
                       {{scope.row.nickName || '- -'}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="预测排名"
                    prop="rank"
                    align="left">
                    <template slot-scope="scope">
                        {{scope.row.rank}}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                style="display: inline-block; vertical-align: middle; margin-top: 20px"
                :total="count"
                :current-page="currentPage"
                :page-size=currentNum
                @current-change="handlePageChange">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import net_util from "../../assets/js/net_utils";
import config from "../../assets/js/config";
import utils from "../../assets/js/utils";
import consts from "../../assets/js/consts";

export default {
  data: function() {
    return {
      id: "",
      count: "",
      predictDetailList: [],
      currentPage: 1,
      currentNum: 10
    };
  },
  methods: {
    getCurrencyPredictDetail() {
      let url = config.JAVABASEDOMAIN + "/predict/user/list";
      let data = {
        currencyId: this.id,
        page: this.currentPage,
        num: this.currentNum
      };
      let succ = res => {
        if (!res.errorMsg) {
          this.predictDetailList = res.result.list;
          this.count = res.result.total;
        } else {
          this.$message({ type: "error", message: res.errorMsg });
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: "获取列表失败！" });
      };
      net_util.getRequest(url, data, succ, fail);
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getCurrencyPredictDetail();
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../static/css/base.styl';

.title {
    margin-bottom: 30px;
    text-transform: capitalize;
}

.breadcrumb {
    margin-bottom: 20px;
}
</style>
