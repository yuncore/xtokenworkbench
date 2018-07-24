<template>
    <div>
        <div class="list-top">
            <!--<div class="top-bread">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item onclick="javascript:history.go(-1)">我的账户</el-breadcrumb-item>
                    <el-breadcrumb-item>管理员设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="top-filter">
                <el-button @click="add">添加管理员</el-button>
            </div>-->
        </div>
        <div class="list-content" style=" padding: 25px; box-sizing:border-box;-moz-box-sizing:border-box; /* Firefox */-webkit-box-sizing:border-box; /* Safari */">


            <el-tabs  v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane :label="$t('page.admin.l1')" name="first">
                    <div v-if="activeName == 'first'">
                    <el-table stripe :data="tableData" style="width: 100%" height="698">
                        <el-table-column prop="id" align="center" :label="$t('page.admin.th1')"></el-table-column>
                        <el-table-column prop="name" align="center" :label="$t('page.admin.th2')"></el-table-column>
                        <el-table-column prop="phone" align="center" :label="$t('page.admin.th3')"></el-table-column>
                       <!-- <el-table-column prop="invitCode" align="center" label="邀请码"></el-table-column>
                        <el-table-column prop="inviteNum" align="center" label="可邀请人数"></el-table-column>-->
                        <el-table-column align="center" :label="$t('page.admin.th4')">
                            <template slot-scope="scope">
                                <b v-if="scope.row.audit == false" style="color: red">{{$t('page.admin.t1')}}</b>
                                <b v-else style="color: green">{{$t('page.admin.t2')}}</b>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" :label="$t('page.admin.th5')">
                            <template slot-scope="scope">
                                <div>{{getTimeForLong(scope.row.regTime)}}</div>
                            </template>
                        </el-table-column>
                      <!--  <el-table-column align="center" label="操作" width="150">
                            <template slot-scope="scope">
                                &lt;!&ndash;<el-button type="text" @click="createLink(scope.row)">生成邀请链接</el-button>&ndash;&gt;
                                <el-button type="text" @click="changeNum(scope.row)">修改可邀请人数</el-button>
                            </template>
                        </el-table-column>-->
                    </el-table>
                    <EPaper :baseUrl="baseUrl.first" :urlParams="urlParams.first" @bindData="bindDataToGrid($event)"></EPaper>
                    </div>
                </el-tab-pane>
               <!-- <el-tab-pane label="审核" name="second">
                    <div v-if="activeName == 'second'">
                    <el-table stripe :data="tableData" style="width: 100%" height="698">
                        <el-table-column prop="id" align="center" label="ID"></el-table-column>
                        <el-table-column prop="name" align="center" label="姓名"></el-table-column>
                        <el-table-column prop="phone" align="center" label="手机号"></el-table-column>
                        <el-table-column prop="invitCode" align="center" label="邀请码"></el-table-column>
                        &lt;!&ndash;<el-table-column prop="inviteNum" align="center" label="可邀请人数"></el-table-column>&ndash;&gt;
                        <el-table-column align="center" label="状态">
                            <template slot-scope="scope">
                                <b v-if="scope.row.audit == false" style="color: red">待审核</b>
                                <b v-else style="color: green">已通过</b>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="注册时间">
                            <template slot-scope="scope">
                                <div>{{getTimeForLong(scope.row.regTime)}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.audit == false" type="text" @click="auditSucc(scope.row.id)">通过</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <EPaper :baseUrl="baseUrl.second" :urlParams="urlParams.second" @bindData="bindDataToGrid($event)"></EPaper>
                    </div>
                </el-tab-pane>-->
                <el-tab-pane :label="$t('page.admin.l2')" name="three">
                    <div v-if="activeName == 'three'">
                        <div style="height: 100px;">
                            <center><el-button type="primary" @click="createLink" style="border-radius: 20px; width: 200px;">{{$t('create')}}</el-button></center>
                        </div>
                        <el-table stripe :data="tableData" style="width: 100%" height="598">
                            <el-table-column prop="code" align="center" :label="$t('page.admin.th6')"></el-table-column>
                            <el-table-column prop="createUserName" align="center" :label="$t('page.admin.th7')"></el-table-column>
                            <el-table-column prop="useUserName" align="center" :label="$t('page.admin.th8')"></el-table-column>
                            <el-table-column align="center" :label="$t('page.admin.th9')">
                                <template slot-scope="scope">
                                    <div>{{getTimeForLong(scope.row.useTime)}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" :label="$t('page.admin.th10')">
                                <template slot-scope="scope">
                                    <div>{{getTimeForLong(scope.row.createTime)}}</div>
                                </template>
                            </el-table-column>
                           <!-- <el-table-column align="center" label="操作" width="150">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="changeNum(scope.row)">复制</el-button>
                                </template>
                            </el-table-column>-->
                        </el-table>
                        <EPaper :baseUrl="baseUrl.three" :urlParams="urlParams.three" @bindData="bindDataToGrid($event)"></EPaper>
                    </div>

                </el-tab-pane>

            </el-tabs>
        </div>

        <el-dialog :title="$t('page.admin.t3')" :visible.sync="ia" size="tiny">
            <el-form label-position="left"  label-width="80px">
                <el-form-item :label="$t('page.admin.l3')">
                    <el-input v-model="realName" :placeholder="$t('page.admin.ph1')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('page.admin.l4')">
                    <el-input type="number" v-model="phone" :placeholder="$t('page.admin.ph2')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('page.admin.l5')">
                    <el-input v-model="code" type="number" :placeholder="$t('page.admin.ph3')"></el-input>

                </el-form-item>
                <el-form-item :label="$t('page.admin.l6')">
                    <el-input v-model="pwd" :placeholder="$t('page.admin.ph4')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ia = false">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="submit">{{$t('confirm')}}</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="$t('page.admin.t4')" :visible.sync="iaZ" fullscreen="true" center="true">
            <center><div style="width: 500px;">
                <el-alert v-for="(item, index) in arrZ" :title="item" :key="index" type="success" :closable="false">
                </el-alert>
            </div></center>
        </el-dialog>
    </div>
</template>
<script>
import EPaper from "../../components/EPaperAdmin.vue";
import net_util from "../../assets/js/net_utils";
import config from "../../assets/js/config";
import utils from "../../assets/js/utils";

export default {
  data: function() {
    return {
      baseUrl: {
        first: config.JAVABASEDOMAIN + "/user/site/list",
        second: config.JAVABASEDOMAIN + "/user/site/list/audit",
        three: config.JAVABASEDOMAIN + "/code/list"
      },
      urlParams: {
        first: {
          page: 1,
          num: 10
        },
        second: {
          page: 1,
          num: 10
        },
        three: {
          page: 1,
          num: 10,
          isUse: true
        }
      },
      tableData: [],
      ia: false,

      info: {},

      activeName: "first",

      arrZ: [],
      iaZ: false
    };
  },
  watch: {},
  methods: {
    bindDataToGrid: function(event) {
      if (event.data && event.data.result && event.data.result.list) {
        this.tableData = event.data.result.list;
      } else {
        this.tableData = null;
      }
    },
    handleClick(tab, event) {},
    add() {
      sessionStorage.setItem(
        "userPhoneBeifen",
        sessionStorage.getItem("userPhone")
      );
      this.ia = true;
    },
    submit(row) {},
    changeNum(row) {
      this.$prompt(this.$t("page.admin.a1"), this.$t("prompt"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        inputPattern: /^[1-9]*[1-9][0-9]*$/,
        inputErrorMessage: this.$t("alert.a1")
      })
        .then(({ value }) => {
          /*this.$message({
                        type: 'success',
                        message: '你的邮箱是: ' + value
                    });*/
          var self = this;
          var url = config.JAVABASEDOMAIN + "/user/site/set/invite";
          var data = {
            uId: row.id,
            num: value
          };
          var succ = data => {
            if (data.errorMsg == null || data.errorMsg == "") {
              self.$message({ type: "success", message: this.$t("success") });
              setTimeout(function() {
                for (var i = 0; i < self.tableData.length; i++) {
                  if (self.tableData[i].id == row.id) {
                    self.tableData[i]["inviteNum"] = value;
                    break;
                  }
                }
              }, 1500);
            } else {
              self.$message({ type: "error", message: data.errorMsg });
            }
          };
          var fail = data => {
            self.$message({ type: "error", message: data.errorMsg });
          };
          net_util.getRequest(url, data, succ, fail, this, "admin");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("cancel2")
          });
        });
    },
    createLink() {
      this.$prompt(this.$t("page.admin.a2"), this.$t("prompt"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        inputPattern: /^[1-9]*[1-9][0-9]*$/,
        inputErrorMessage: this.$t("alert.a1")
      })
        .then(({ value }) => {
          /*this.$message({
                        type: 'success',
                        message: '你的邮箱是: ' + value
                    });*/
          var self = this;
          var url = config.JAVABASEDOMAIN + "/code/create";
          var data = {
            num: value
          };
          var succ = data => {
            if (data.errorMsg == null || data.errorMsg == "") {
              self.$message({ type: "success", message: this.$t("success") });
              setTimeout(function() {
                self.arrZ = data.result;
                self.iaZ = true;
              }, 1000);
            } else {
              self.$message({ type: "error", message: data.errorMsg });
            }
          };
          var fail = data => {
            self.$message({ type: "error", message: data.errorMsg });
          };
          net_util.getRequest(url, data, succ, fail, this, "admin");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("cancel2")
          });
        });
    },
    auditSucc(num) {
      this.$confirm(this.$t("confirm2"), this.$t("prompt"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(() => {
          var self = this;
          var url = config.JAVABASEDOMAIN + "/user/site/audit";
          var data = {
            uId: num
          };
          var succ = data => {
            if (data.errorMsg == null || data.errorMsg == "") {
              self.$message({ type: "success", message: this.$t("success") });
              setTimeout(function() {
                for (var i = 0; i < self.tableData.length; i++) {
                  if (self.tableData[i].id == num) {
                    self.tableData.splice(i, 1);
                    break;
                  }
                }
              }, 1500);
            } else {
              self.$message({ type: "error", message: data.errorMsg });
            }
          };
          var fail = data => {
            self.$message({ type: "error", message: data.errorMsg });
          };
          net_util.getRequest(url, data, succ, fail, this, "admin");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("cancel3")
          });
        });
    },
    getTimeForLong: function(longTime, flag) {
      if (longTime == "" || longTime == null || longTime == undefined)
        return "- -";
      else return utils.getSmpFormatDateByLong(longTime, true);
    }
  },
  components: {
    EPaper
  }
};
</script>
<style scoped>
.top-filter {
  margin-top: 20px;
}

.list-content {
  margin-top: 20px;
}

.list-content::before {
  clear: both;
}

</style>
