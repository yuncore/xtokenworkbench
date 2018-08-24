<template>
  <div id="ideasList">
    <div class="container top-publish">
      <div class="title">IDEAS</div>
      <button class="publish" @click="pathToPublish">{{$t('page.ideasList.t1')}}</button>
    </div>
    <div class="container pages">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
    <div style="padding: 0 90px;">
      <div class="item-all" v-for="(item,index) in list" @click="pathToDetail(item.id)">
        <div class="item-title">{{item.title}}</div>
        <div class="item-author">{{item.name}}
          <div class="item-time">{{getDate(item.time)}}</div>
        </div>
        <div class="item-feedback">{{comList[index]}}
          <div class="item-unit">Replies</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import net_util from "../../assets/js/net_utils";
  import config from "../../assets/js/config";
  import utils from "../../assets/js/utils";

  export default {
    mounted() {
      this.requestList();
    },
    data: function () {
      return {
        currentPage: 1,
        size: 10,
        count: 0,
        list: [1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1],
        comList: [],
      }
    },
    methods: {
      requestList: function () {
        let url = config.JAVABASEDOMAIN + '/idea/list';
//        console.log(this.currentPage)
        net_util.getRequest(url, {page: this.currentPage, num: this.size}, (res) => {
          if (!res.errorMsg) {
            console.log(res)
            this.count = res.result.count;
            this.list = res.result.list;
            this.comList = res.result.cmmList;
          } else {
            this.$message({type: "error", message: res.errorMsg});
          }
        }, (err) => {
          this.$message({
            type: "error",
            message: res.responseJSON.message || this.$t("error")
          });
        })
      },
      getDate: function (time) {
        return utils.getSmpFormatDateByLong(time, false)
      },
      //每页条数改变
      handleSizeChange: function (e) {
        this.currentPage = 0;
        this.size = e;
        this.requestList();
      },
      //当前页改变
      handleCurrentChange: function (e) {
        this.currentPage = e;
        this.requestList();
      },
      pathToPublish: function () {
        this.$router.push({name: "ideas_publish"});
      },
      pathToDetail: function (id) {
        this.$router.push({name: "ideas_detail", query: {id}});
      }
    }
  }
</script>
<style scoped>
  @import '../../../static/css/base.styl';

  #ideasList {
    max-width: 1000px;
    margin: 0 auto;
    background: #ffffff;
    padding-top: 60px;
  }

  .top-publish {
    display: flex;
    align-items: center;
    padding: 10px 90px;
  }

  .title {
    flex: 1;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0;
    text-align: left;
  }

  .publish {
    background: #409eff;
    border-radius: 1.55px;
    width: 70px;
    height: 30px;
    font-size: 13px;
    color: #ffffff;
    border: none;
  }

  .pages {
    padding: 10px 0;
    text-align: right;
    background: #fafafa;
  }

  .item-all {
    padding: 25px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-bottom: 1px solid #f1f1f1;
  }

  .item-title {
    font-size: 16px;
    color: #666666;
    text-align: left;
    line-height: 20px;
    width: 360px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-author {
    display: flex;
    font-size: 14px;
    color: #536475;
  }

  .item-time {
    color: #999999;
    margin-left: 8px;
  }

  .item-feedback {
    display: flex;
    font-size: 14px;
    color: #536475;
  }

  .item-unit {
    color: #999999;
    margin-left: 8px;
  }
</style>
