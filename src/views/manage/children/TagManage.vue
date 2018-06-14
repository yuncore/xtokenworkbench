<template>
    <div id="tagManage">
        <div class="head">
            <div class="describe">
                <h3>Tag Manage</h3>
                <p>Add, delete, modify and make association of Tags.</p>
            </div>
            <div class="add-tag right">
                <el-form :inline="true" :model="tagAddForm" label-width="80px">
                    <el-form-item>
                        <el-input v-model.trim="tagAddForm.tag_name" size="small" :placeholder="$t('page.tagManage.ph1')">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="addTag">{{$t('create')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <ul class="tag-list">
            <li v-for="(item, index) in tagList" :key="index">
                <p class="name">{{item.tag_name}}</p>
                <p class="describe">{{item.count}} currencies have been linked</p>
                <div class="operateBar">
                    <img @click="renameTag(item.id, item.tag_name)" src="../../../../static/img/tag_rename.svg" title="rename">
                    <img @click="showEditDia(item.id, index)" src="../../../../static/img/tag_edit.svg" title="edit">
                    <img @click="deleteTag(item.id, item.tag_name)" src="../../../../static/img/tag_delete.svg" title="delete">
                </div>
            </li>
        </ul>
        <el-dialog
            title="Edit Tag"
            :visible.sync="editDiaVisiable"
            width="45%"
            class="edit-tag-dia">
            <el-select
                v-model="chooseCurrencies"
                filterable
                multiple
                remote
                reserve-keyword
                :remote-method="headSearchMethod"
                :loading="headSearchLoading"
                placeholder="search"
                @change="headSearchChange"
                style="width: 350px">
                <el-option
                    v-for="(item, index) in headSearchOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-button type="primary" @click="addRelation">
                Add
            </el-button>
            <ul v-if="relatedCurrency.length > 0">
                <li v-for="(item, index) in relatedCurrency" :key="index">
                    <img @click="deleteRelation(item)" class="delete" src="../../../../static/img/tag_currency_delete.svg" alt="">
                    <img class="logo" :src="`static/img/coinLogos/${item.id}.png`" alt="">
                    {{item.name}}
                </li>
            </ul>
            <p v-else>No related currencies.</p>
        </el-dialog>
    </div>
</template>

<script>
import net_util from "../../../assets/js/net_utils";
import config from "../../../assets/js/config";

export default {
  name: "TagManage",
  data() {
    return {
      tagList: "",
      chooseCurrencies: [],
      currentTagIndex: "",
      editDiaVisiable: false,
      renameDiaVisiable: false,
      headSearchOptions: [],
      relatedCurrency: [],
      tagAddForm: {
        tag_name: ""
      }
    };
  },
  methods: {
    init() {
      this.getTagList()
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          console.log(e);
        });
    },
    showEditDia(id, index) {
      this.getRelatedCurrencyByTagId(id).then(res => {
        this.currentTagIndex = index;
        this.relatedCurrency = res;
        this.editDiaVisiable = true;
      });
    },
    renameTag(id, name) {
      this.$prompt("Input new name", `Rename for ${name}`, {
        confirmButtonText: "confirm",
        cancelButtonText: "cancel"
      })
        .then(({ value }) => {
          if (value) {
            if (this.tagList.findIndex(item => item.tag_name === value) > -1) {
              this.$message({
                type: "warning",
                message:
                  "It seems there is duplicate Tags. Check your New Name."
              });
            } else {
              this.renameTagRequest(id, value)
                .then(() => {
                  this.getTagList();
                })
                .then(res => {
                  this.tagList = res;
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
    renameTagRequest(id, newName) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/currency/tags`;
        let data = {
          id: id,
          new_name: newName
        };
        let succ = res => {
          this.$message({ type: "success", message: this.$t("success") });
          resolve();
        };
        net_util.putRequest(url, data, succ, reject);
      });
    },
    // 请求货币搜索接口
    headSearchMethod(query) {
      if (query !== "" && query.length >= 2) {
        let url = config.PYTHONBASEDOMAIN + "/currency/search";
        let succ = res => {
          this.headSearchOptions = res.data;
        };
        let fail = res => {};
        net_util.getRequest(url, { keyword: query }, succ, fail);
      } else {
        this.headSearchOptions = [];
      }
    },
    deleteRelation(item) {
      let tag = this.tagList[this.currentTagIndex];
      this.$alert(
        `Are you sure to remove ${item.name} from ${tag.tag_name}?`,
        "Remove Currency",
        {
          confirmButtonText: "confirm"
        }
      )
        .then(() => {
          return this.deleteRelationRequest(tag.id, item.id);
        })
        .then(() => {
          return this.getRelatedCurrencyByTagId(tag.id);
        })
        .then(res => {
          this.relatedCurrency = res;
        })
        .then(() => {
          this.getTagList();
        });
    },
    deleteRelationRequest(tag_id, currency_id) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/currency/tags/relation`;
        let data = {
          tag_id: tag_id,
          currency_id: currency_id
        };
        let succ = () => {
          this.$message({ type: "success", message: this.$t("success") });
          resolve();
        };
        let fail = res => {
          this.$message({
            type: "success",
            message: res.responseJSON.message || this.$t("error")
          });
          reject();
        };
        net_util.deleteRequest(url, data, succ, fail);
      });
    },
    // 添加货币和标签的关联关系
    addRelation() {
      let chooseCurrencies = this.chooseCurrencies;
      let tag = this.tagList[this.currentTagIndex];
      let tag_id = tag.id;
      let tag_name = tag.tag_name;
      if (!(this.chooseCurrencies.length > 0 && tag_id)) {
        this.$message({
          type: "warning",
          message: "Please choose currency or tag"
        });
        return false;
      }
      this.$alert(
        `Are you sure to add ${chooseCurrencies.join(",")} to ${tag_name}?`,
        "Add Currency",
        {
          confirmButtonText: "confirm"
        }
      )
        .then(() => {
          return this.addRelationRequest(chooseCurrencies, tag_id);
        })
        .then(() => {
          return this.getRelatedCurrencyByTagId(tag_id);
        })
        .then(res => {
          this.relatedCurrency = res;
        })
        .then(() => {
          this.getTagList();
        });
    },
    addRelationRequest(chooseCurrencies, tag_id) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/currency/tags/relation`;
        let data = {
          tag_ids: tag_id,
          currency_ids: JSON.stringify(chooseCurrencies)
        };
        let succ = res => {
          this.$message({ type: "success", message: this.$t("success") });
          resolve();
        };
        let fail = res => {
          this.$message({
            type: "error",
            message: res.responseJSON.message || this.$t("error")
          });
          reject();
        };
        net_util.postRequest(url, data, succ, fail);
      });
    },
    // 请求标签列表
    getTagList() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/currency/tags`;
        let succ = res => {
          let tagList = JSON.parse(res).result;
          this.tagList = tagList.sort(
            (item1, item2) => (item1.count < item2.count ? 1 : -1)
          );
          resolve();
        };
        net_util.getRequest(url, {}, succ, reject);
      });
    },
    getRelatedCurrencyByTagId(tag_id) {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + "/currency/tags/relation";
        let data = {
          tag_id: tag_id,
          by: 2
        };
        let succ = res => {
          resolve(res);
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    addTag() {
      if (this.tagAddForm.tag_name === "") {
        this.$message({
          type: "warning",
          message: this.$t("page.tagManage.a1")
        });
        return false;
      };
      if(this.tagList.findIndex(item => item.tag_name === this.tagAddForm.tag_name) > -1){
          this.$message({
              type: "warning",
              message: this.$t('It seems there is a duplicated Tag.')
          });
          return false;
      }
      let url = config.PYTHONBASEDOMAIN + `/currency/tags`;
      let data = {
        tag_name: this.tagAddForm.tag_name
      };
      let succ = res => {
        this.$message({ type: "success", message: this.$t("success") });
        this.getTagList();
      };
      let fail = res => {
        this.$message({
          type: "error",
          message: res.responseJSON.message || this.$t("error")
        });
      };
      net_util.postRequest(url, data, succ, fail);
    },
    deleteTag(id, name) {
      this.$alert(`Are you sure to delete tag ${name}?`, "Delete Tag", {
        confirmButtonText: "confirm"
      }).then(() => {
        let url = config.PYTHONBASEDOMAIN + `/currency/tags`;
        let data = {
          id: id
        };
        let succ = res => {
          this.$message({ type: "success", message: this.$t("success") });
          this.getTagList();
        };
        let fail = res => {
          this.$message({
            type: "error",
            message: res.responseJSON.message || this.$t("error")
          });
        };
        net_util.deleteRequest(url, data, succ, fail);
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#tagManage {
    .head {
        .describe {
            display: inline-block;

            h3 {
                margin: 0;
                font-size: 20px;
                font-weight: normal;
            }

            p {
                margin-top: 5px;
                margin-bottom: 20px;
                font-size: 14px;
            }
        }

        .add-tag {
            display: inline-block;
        }
    }

    .tag-list {
        li {
            display: inline-block;
            padding: 12px 16px;
            background: #FFF;
            margin-right: 20px;
            margin-top: 20px;
            width: 260px;
            box-sizing: border-box;
            transition: 0.25s;
            position: relative;

            &:hover {
                box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);

                .operateBar {
                    opacity: 1;
                }
            }

            &:nth-child(3n+0) {
                margin-right: 0;
            }

            .name {
                font-size: 16px;
            }

            .describe {
                font-size: 13px;
            }

            .operateBar {
                margin-top: 20px;
                opacity: 0;
                transition: 0.25s;
            }

            p {
                margin: 5px 0;
            }

            img {
                width: 16px;
                height: 16px;
                margin-right: 15px;
                cursor: pointer;
            }
        }
    }

    .edit-tag-dia {
        p {
            margin-top: 20px;
        }

        ul {
            font-size: 0;
            margin-top: 20px;

            li {
                display: inline-block;
                min-width: 150px;
                font-size: 14px;
                line-height: 40px;
                height: 40px;
                text-align: center;
                margin-right: 15px;
                padding: 0 10px;
                border: 1px solid #f1f1f1;
                margin-top: 10px;
                border-radius: 5px;
                position: relative;

                &:hover {
                    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);

                    .delete {
                        opacity: 1;
                    }
                }

                .logo {
                    width: 15px;
                    margin-right: 5px;
                    vertical-align: middle;
                }

                .delete {
                    width: 16px;
                    height: 16px;
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    opacity: 0;
                    transition: 0.25s;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
