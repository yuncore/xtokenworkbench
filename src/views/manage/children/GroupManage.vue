<template>
  <div>
    <div id="groupManage">
      <div class="head">
        <div class="describe">
          <h3>Group Manage</h3>
          <p>Add, delete, modify and make association of your own group.</p>
        </div>
        <div class="add-tag right">
          <el-form :inline="true" :model="groupAddForm" label-width="80px">
            <el-form-item>
              <el-input v-model.trim="groupAddForm.name" size="small" :placeholder="$t('page.tagManage.ph1')">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="addGroup">{{$t('create')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <ul class="group-list">
        <li v-for="(item, index) in groupList" :key="index">
          <p class="name">{{item.groupName}}</p>
          <p class="describe">{{item.count}} currencies have been linked</p>
          <div class="operateBar">
            <img @click="renameGroup(item.id, item.groupName)" src="../../../../static/img/tag_rename.svg" title="rename">
            <img @click="showEditDia(item.id, index)" src="../../../../static/img/tag_edit.svg" title="edit">
            <img @click="deleteGroup(item.id, item.groupName)" src="../../../../static/img/tag_delete.svg" title="delete">
          </div>
        </li>
      </ul>
      <el-dialog :title="groupList[currentGroupIndex] && groupList[currentGroupIndex]['groupName']" :visible.sync="editDiaVisiable" width="45%" class="edit-tag-dia">
        <el-select v-model="chooseCurrencies" filterable multiple remote reserve-keyword :remote-method="headSearchMethod" :loading="headSearchLoading" placeholder="search" @change="headSearchChange" style="width: 350px">
          <el-option v-for="(item, index) in headSearchOptions" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" @click="addRelation">
          Add
        </el-button>
        <ul v-if="relatedCurrency.length > 0">
          <li v-for="(item, index) in relatedCurrency" :key="index">
            <img @click="deleteRelation(item)" class="delete" src="../../../../static/img/tag_currency_delete.svg" alt="">
            <img class="logo" :src="`static/img/coinLogos/${item.currency}.png`" alt=""> {{item.currency}}
          </li>
        </ul>
        <p v-else>No related currencies.</p>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import net_util from "../../../assets/js/net_utils";
import config from "../../../assets/js/config";

export default {
  name: "GroupManage",
  data() {
    return {
      groupList: [],
      groupAddForm: {
        name: ""
      },
      currentGroupIndex: "",
      editDiaVisiable: false,
      chooseCurrencies: [],
      headSearchOptions: [],
      headSearchLoading: false,
      relatedCurrency: []
    };
  },
  methods: {
    init() {
      this.getGroupList();
    },
    showEditDia(id, index) {
      this.getCurrenciesByGroupId(id).then(res => {
        this.currentGroupIndex = index;
        this.relatedCurrency = res;
        this.editDiaVisiable = true;
      });
    },
    // 根据分组id获取处于该分组的货币
    getCurrenciesByGroupId(id) {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + "/pros/group/cy/list";
        let data = {
          groupId: id
        };
        let succ = res => {
          if (!res.errorMsg) {
            resolve(res.result);
          } else {
            reject();
          }
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    renameGroup(id, name) {
      this.$prompt("Input new name", `Rename for ${name}`, {
        confirmButtonText: "confirm",
        cancelButtonText: "cancel"
      })
        .then(({ value }) => {
          if (value) {
            if (
              this.groupList.findIndex(item => item.groupName === value) > -1
            ) {
              this.$message({
                type: "warning",
                message:
                  "It seems there is duplicate Group. Check your New Name."
              });
            } else {
              this.renameGroupRequest(id, value).then(() => {
                this.getGroupList();
              });
            }
          } else {
            this.$message({ type: "warning", message: "empty text." });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    renameGroupRequest(id, newName) {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + `/pros/group/rename`;
        let data = {
          groupId: id,
          name: newName
        };
        let succ = res => {
          if (!res.errorMsg) {
            this.$message({
              type: "success",
              message: this.$t("success")
            });
            resolve();
          } else {
            reject();
          }
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    deleteRelation(item) {
      let group = this.groupList[this.currentGroupIndex];
      this.$alert(
        `Are you sure to remove ${item.currency} from ${group.groupName}?`,
        "Remove Currency",
        {
          confirmButtonText: "confirm"
        }
      )
        .then(() => {
          return this.deleteRelationRequest(item.id);
        })
        .then(() => {
          return this.getCurrenciesByGroupId(group.id);
        })
        .then(res => {
          this.relatedCurrency = res;
        })
        .then(() => {
          this.getGroupList();
        });
    },
    deleteRelationRequest(id) {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + "/pros/group/cy/del";
        let data = {
          id: id
        };
        let succ = res => {
          resolve()
          if (!res.errorMsg) {
            this.$message({
              type: "success",
              message: this.$t("success")
            })
          } else {
            reject()
            this.$message({
              type: "error",
              message: this.$t("fail")
            })
          }
        }
        net_util.getRequest(url, data, succ, reject)
      });
    },
    // 添加货币和标签的关联关系
    addRelation() {
      let chooseCurrencies = this.chooseCurrencies;
      let group = this.groupList[this.currentGroupIndex];
      let group_id = group.id;
      let group_name = group.groupName;
      if (!(this.chooseCurrencies.length > 0 && group_id)) {
        this.$message({
          type: "warning",
          message: "Please choose currency or group"
        });
        return false;
      }
      this.$alert(
        `Are you sure to add ${chooseCurrencies.join(",")} to ${group_name}?`,
        "Add Currency",
        {
          confirmButtonText: "confirm"
        }
      )
        .then(() => {
          return this.addRelationRequest(chooseCurrencies, group_id);
        })
        .then(() => {
          return this.getCurrenciesByGroupId(group_id);
        })
        .then(res => {
          this.relatedCurrency = res;
        })
        .then(() => {
          this.getGroupList();
        });
    },
    addRelationRequest(chooseCurrencies, group_id) {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + "/pros/group/cy/add";
        let data = {
          groupIds: group_id,
          currency: chooseCurrencies
        };
        let succ = res => {
          if (!res.errorMsg) {
            this.$message({ type: "success", message: this.$t("success") });
            resolve();
          } else {
            message: res.responseJSON.message || this.$t("error");
            reject();
          }
        };
        net_util.formRequest(url, data, succ, reject);
      });
    },
    // 请求货币搜索接口
    headSearchMethod(query) {
      if (query !== "" && query.length >= 2) {
        let url = config.PYTHONBASEDOMAIN + "/currency/search";
        let succ = res => {
          this.headSearchOptions = res.data;
        };
        let fail = res => { };
        net_util.getRequest(url, { keyword: query }, succ, fail);
      } else {
        this.headSearchOptions = [];
      }
    },
    // 获取分组列表
    getGroupList() {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + `/pros/group/list`;
        let succ = res => {
          if (!res.errorMsg) {
            let groupList = res.result;
            let newGroupList = groupList.sort(
              (item1, item2) => (item1.count < item2.count ? 1 : -1)
            );
            if(this.currentGroupIndex !== ""){
              let lastChoice = this.groupList[this.currentGroupIndex]
              this.currentGroupIndex = newGroupList.findIndex(item => item.id === lastChoice.id)
            }
            this.groupList = newGroupList
            resolve();
          } else {
            reject();
          }
        };
        net_util.getRequest(url, {}, succ, reject);
      });
    },
    addGroup() {
      if (this.groupAddForm.name === "") {
        this.$message({
          type: "warning",
          message: this.$t("page.tagManage.a1")
        });
        return false;
      }
      if (
        this.groupList.findIndex(
          item => item.groupName === this.groupAddForm.name
        ) > -1
      ) {
        this.$message({
          type: "warning",
          message: "It seems there is a duplicated Group."
        });
        return false;
      }
      let url = config.JAVABASEDOMAIN + `/pros/group/create`;
      let data = {
        groupName: this.groupAddForm.name
      };
      let succ = res => {
        if (!res.errorMsg) {
          this.$message({ type: "success", message: this.$t("success") });
          this.getGroupList();
        } else {
          this.$message({ type: "error", message: this.$t("fail") });
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: this.$t("fail") });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    deleteGroup(id, name) {
      this.$alert(`Are you sure to delete group ${name}?`, "Delete group", {
        confirmButtonText: "confirm"
      }).then(() => {
        let url = config.JAVABASEDOMAIN + `/pros/group/del`;
        let data = {
          groupId: id
        };
        let succ = res => {
          if (!res.errorMsg) {
            this.$message({ type: "success", message: this.$t("success") });
            this.getGroupList();
          } else {
            this.$message({ type: "error", message: this.$t("fail") });
          }
        };
        let fail = res => {
          this.$message({ type: "error", message: this.$t("fail") });
        };
        net_util.getRequest(url, data, succ, fail);
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#groupManage
  .head
    .describe
      display inline-block

      h3
        margin 0
        font-size 20px
        font-weight normal

      p
        margin-top 5px
        margin-bottom 20px
        font-size 14px

    .add-tag
      display inline-block

  .group-list
    li
      display inline-block
      padding 12px 16px
      background #FFF
      margin-right 20px
      margin-top 20px
      width 260px
      box-sizing border-box
      transition 0.25s
      position relative

      &:hover
        box-shadow 0 2px 20px 0 rgba(0, 0, 0, 0.1)

        .operateBar
          opacity 1

      &:nth-child(3n+0)
        margin-right 0

      .name
        font-size 16px

      .describe
        font-size 13px

      .operateBar
        margin-top 20px
        opacity 0
        transition 0.25s

      p
        margin 5px 0

      img
        width 16px
        height 16px
        margin-right 15px
        cursor pointer

  .edit-tag-dia
    p
      margin-top 20px

    ul
      font-size 0
      margin-top 20px

      li
        display inline-block
        min-width 150px
        font-size 14px
        line-height 40px
        height 40px
        text-align center
        margin-right 15px
        padding 0 10px
        border 1px solid #f1f1f1
        margin-top 10px
        border-radius 5px
        position relative

        &:hover
          box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.1)

          .delete
            opacity 1

        .logo
          width 15px
          margin-right 5px
          vertical-align middle

        .delete
          width 16px
          height 16px
          position absolute
          top -8px
          right -8px
          opacity 0
          transition 0.25s
          cursor pointer
</style>
