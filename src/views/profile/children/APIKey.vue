<template>
  <div id="apiKey">
    <h3>Exchange API</h3>
    <p>Third party accounts.</p>
    <ul class="exchange-list">
      <li v-for="(item, index) in exchangeDisplayList" :key="index">
        <h4>
          {{item.bourse.bourseName}}
          <div class="addform-button-group">
            <el-button v-if="!item.info" @click="showAddForm(item, index)" type="text" size="mini" style="color: #409eff" class="addform-button right">
              Bind
            </el-button>
            <el-button v-else @click="removeAPI(item.info.type)" type="text" class="addform-button right" style="color: #ff7070" size="mini">
              Unbind
            </el-button>
          </div>
        </h4>
        <div v-if="item.info" class="api-content">
          <div class="api-key-logo left">
            <img src="../../../../static/img/api-key.png">
          </div>
          <div v-if="!item.onEdit" class="api-detail">
            <p>{{item.info.name}}</p>
            <el-button class="edit-btn right" size="mini">Edit</el-button>
            <div class="trade-pair">
              <span>Trade Pair: &nbsp;</span>
              {{item.list.join("、")}}
            </div>
          </div>
          <div v-else class="edit-field">
            <div class="top">
              <div class="search">
                <el-select v-model="chooseCurrencyList" multiple filterable remote reserve-keyword :remote-method="headSearchMethod" @change="headSearchChange" class="search-field">
                  <el-option v-for="(item, index) in headSearchOptions" :key="index" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>{{`There is no API bind to this Exchange`}}</p>
        </div>
        <transition name="el-zoom-in-top">
          <div v-show="item.onCreate" class="form-content">
            <el-form ref="APIForm" :model="APIForm" label-position="top" status-icon class="api-form">
              <el-form-item label="Symbol" prop="name" required>
                <el-input v-model.trim="APIForm.name"></el-input>
              </el-form-item>
              <el-form-item label="API Key" prop="apiKey" required>
                <el-input v-model.trim="APIForm.apiKey"></el-input>
              </el-form-item>
              <el-form-item label="Secret Key" prop="secretKey" required>
                <el-input v-model.trim="APIForm.secretKey"></el-input>
              </el-form-item>J
              <el-form-item>
                <el-button type="primary" @click="submitForm(`APIForm`, index, addAPIKey)">Save</el-button>
                <el-button @click="cancleAddAPI(`APIForm`, item, index)">Cancel</el-button>
              </el-form-item>
            </el-form>
          </div>
        </transition>
      </li>
    </ul>
    <!-- <ul class="exchange-list">
      <li v-for="(item, index) in exchangeDisplayList" :key="index">
        <h4>
          {{item.bourse.bourseName}}
          <div v-if="!item.bourse" class="addform-button-group">
            <el-button v-if="!item.addFormVisiable" @click="showAddForm(item, index)" type="primary" size="mini" class="addform-button right">
              New
            </el-button>
            <el-button v-else @click="hideAddForm(item, index)" type="success" class="addform-button right" size="mini">
              Cancel
            </el-button>
          </div>
        </h4>
        <div v-if="item.info" class="api-content">
          <div class="api-key-logo">
            <img src="../../../../static/img/api-key.png">
          </div>
          <p>{{item.info.name}}</p>
          <el-button type="danger" size="mini" @click="removeAPI(item.type)" class="unbind-button right">
            Unbind
          </el-button>
        </div>
        <p v-else>{{`There is no API bound to this Exchange`}}</p>
        <transition name="el-zoom-in-top">
          <div v-show="item.addFormVisiable" class="form-content">
            <el-form ref="APIForm" :model="APIForm" label-position="top" status-icon class="api-form">
              <el-form-item label="Name" prop="name" required>
                <el-input v-model.trim="APIForm.name"></el-input>
              </el-form-item>
              <el-form-item label="API Key" prop="apiKey" required>
                <el-input v-model.trim="APIForm.apiKey"></el-input>
              </el-form-item>
              <el-form-item label="Secret Key" prop="secretKey" required>
                <el-input v-model.trim="APIForm.secretKey"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm(`APIForm`, index, addAPIKey)">Save</el-button>
                <el-button @click="resetForm(`APIForm`, index)">Reset</el-button>
              </el-form-item>
            </el-form>
          </div>
        </transition>
      </li>
    </ul> -->
  </div>
</template>

<script>
import net_util from "../../../assets/js/net_utils";
import config from "../../../assets/js/config";

export default {
  name: "APIKey",
  data() {
    return {
      apiFormVisible: false,
      APIForm: {
        name: "",
        apiKey: "",
        secretKey: "",
        exchange: ""
      },
      tradePairs: '',
      currentExchange: "",
      exchangeList: [],
      bindAPIList: [],
      exchangeDisplayList: []
    };
  },
  methods: {
    addAPIKey() {
      console.log('add API Key')
      let url = config.JAVABASEDOMAIN + `/user/bourse/bind`;
      if (!this.currentExchange) {
        console.log("empty exchange");
        return;
      }
      let data = {
        type: this.currentExchange,
        key: this.APIForm.apiKey,
        secret: this.APIForm.secretKey,
        name: this.APIForm.name
      };
      let succ = res => {
        if (!res.errorMsg) {
          this.$message({ type: "success", message: this.$t("success") });
          this.init();
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: this.$t("error") });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    getBindAPIList() {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + `/user/bourse/bind/list`;
        let data = {};
        let succ = res => {
          if (!res.errorMsg) {
            this.bindAPIList = res.result;
            resolve(res.result);
          }
        };
        let fail = res => {
          reject(res);
        };
        net_util.getRequest(url, data, succ, fail);
      });
    },
    getExchangeList() {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + `/user/bourse/list`;
        let succ = res => {
          if (!res.errorMsg) {
            this.exchangeList = res.result;
            resolve(res);
          }
        };
        let fail = res => {
          reject(res);
        };
        net_util.getRequest(url, {}, succ, fail);
      });
    },
    removeAPI(id) {
      let url = config.JAVABASEDOMAIN + `/user/bourse/remove`;
      let data = {
        type: id
      };
      let succ = res => {
        if (!res.errorMsg) {
          this.$message({ type: "success", message: this.$t("success") });
          this.init();
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: this.$t("error") });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    showAddForm(item, index) {
      this.exchangeList.forEach((item, index) => {
        if (item.onCreate === true) {
          item.onCreate = false
        }
      })
      item.onCreate = true
      this.currentExchange = item.bourse.id
    },
    hideForm(item, index) {
      item.onCreate = false
      this.currentExchange = ""
      this.resetForm("APIForm", index)
    },
    // showAddForm(item, index) {
    //   this.exchangeList.forEach((item, index) => {
    //     if (item.addFormVisiable === true) {
    //       let newItem = item;
    //       item.addFormVisiable = false;
    //       this.exchangeDisplayList.splice(index, 1, newItem);
    //     }
    //   });
    //   let newItem = item;
    //   newItem.addFormVisiable = true;
    //   this.exchangeDisplayList.splice(index, 1, newItem);
    //   this.currentExchange = item.id;
    // },
    // hideAddForm(item, index) {
    //   let newItem = item;
    //   newItem.addFormVisiable = false;
    //   this.exchangeDisplayList.splice(index, 1, newItem);
    //   this.currentExchange = "";
    //   this.resetForm("APIForm", index);
    // },
    submitForm(name, index, cb) {
      this.$refs[name][index].validate(valid => {
        if (valid) {
          cb();
        } else {
          return false;
        }
      });
    },
    cancleAddAPI(name, item, index){
      item.onCreate = false
      this.reset(name, index)
    },
    resetForm(name, index) {
      this.$refs[name][index].resetFields();
    },
    getBourseInfo() {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + "/user/bourse/init"
        let succ = res => {
          if (!res.errorMsg) {
            resolve(res)
          }
        }
        net_util.getRequest(url, {}, succ, reject)
      })
    },
    getTradePairList(){
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + "/user/bourse/symbols"
        let data = {
          bourseId: 1
        }
        let succ = res => {
          if (!res.errorMsg) {
            this.tradePairs = res.result
            resolve(res)
          }
        }
        net_util.getRequest(url, data, succ, reject)
      })
    },
    init() {
      let res = {        "errorCode": 0,
        "msgType": 1,
        "result": [
          {            "bourse": { "bourseName": "币安(Binance)", "id": 1 },
            "list": ['sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss', 'sss'],
            "info": { "name": "test", "type": 1, "userId": 9 },
            "onEdit": false,
            "onCreate": false,
          },
          {            "bourse": { "bourseName": "币安(Binance)", "id": 1 },
            "onEdit": false,
            "onCreate": false,
          }
        ]
      }
      this.exchangeDisplayList = res.result;
      this.getTradePairList()
      // this.getInitInfo().then(res => {
      //   this.exchangeDisplayList = res.result
      // })
      // this.getExchangeList()
      //   .then(res => {
      //     return this.getBindAPIList();
      //   })
      //   .then(res => {
      //     this.exchangeList.forEach(item1 => {
      //       let displayItem = item1;
      //       displayItem.addFormVisiable = false;
      //       this.bindAPIList.forEach(item2 => {
      //         if (item1.id === item2.type) {
      //           displayItem.hasKey = true;
      //           displayItem.name = item2.name;
      //         }
      //       });
      //       this.exchangeDisplayList.push(displayItem);
      //     });
      //   });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
#apiKey
  h3
    margin 0
    font-size 20px
    font-weight normal

  h4
    font-weight normal
    line-height 40px
    height 40px
    border-bottom 1px solid #d8d8d8

  p
    margin-top 5px
    margin-bottom 20px
    font-size 14px

  .exchange-list
    li
      margin-bottom 50px

      &:last-child
        margin-bottom 0

  .addform-button-group
    display inline

    .addform-button
      margin-right 20px
      margin-top 10px

  .api-content
    padding 10px 0
    border 1px solid #DDDDDD
    background #FFF
    border-radius 3px

    .api-key-logo
      display inline-block
      vertical-align middle
      margin-left 20px
      line-height 100%

      img
        width 40px
        height 40px

    .api-detail
      margin-left 80px
      font-size 14px

      p
        font-size 18px
        display inline-block
        margin 0

      .edit-btn
        margin-right 20px

      .trade-pair
        margin-right 40px
        color #929292

      .unbind-button
        margin-right 20px
        margin-top 5px

  .form-content
    padding 10px 20px
    background #FFF
</style>
