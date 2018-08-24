<template>
  <div id="currencyList">
    <!--top search-->
    <div id="top-search">
      <div class="container">
        <h2>Cryptocurrencies</h2>
        <el-select v-model="chooseCurrencyList" multiple filterable remote reserve-keyword :remote-method="headSearchMethod" :loading="headSearchLoading" placeholder="search" @change="headSearchChange" class="search-field">
          <el-option v-for="(item, index) in headSearchOptions" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="container">
      <!--top filters-->
      <div id="filter">
        <div class="selector">
          <div class="content">
            <div class="block" :style="{'display': filterActiveGroup.length > 0 ? 'none' : 'block'}"></div>
            <div v-for="(item, filter_index) in currencyFilter" :key="filter_index" class="row">
              <div class="label">
                {{item.name}}
              </div>
              <el-button v-if="item.custom" size="mini" type='text' class="right custom-btn" @click="showCustomChoice(item, filter_index)">
                Custom
              </el-button>
              <div class="choices">
                <ul>
                  <li v-for="(choice, choice_index) in item.choices" :key="choice_index" :class="{active: item.active_index == choice_index}" @click="selectFilterItem(item, choice_index)">
                    {{choice}}
                  </li>
                  <li v-if="item.custom_choice" :class="{active: item.active_index == -1}" @click="selectFilterItem(item, -1)">
                    {{item.custom_choice.text}}
                  </li>
                </ul>
              </div>
            </div>
            <!--标签过滤-->
            <div class="row" v-if="tagList.length > 0">
              <div class="label">
                Tags
              </div>
              <el-button type="text" size="mini" @click="tagsRowExpand = !tagsRowExpand" class="right expand-ctl">
                <i :class="tagsRowExpand ?'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                {{tagsRowExpand ?'Pack up' : 'Expand'}}
              </el-button>
              <div class="choices" :style="{'max-height': tagsRowExpand ? '600px' : '36px'}">
                <ul>
                  <li v-for="(tag, index) in tagList" :key="index" @click="filterTagLabelClick(tag['id'])" :class="{active: filterActiveTag.indexOf(tag['id']) > -1}">
                    {{tag['tag_name']}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="content" v-if="groupList.length > 0">
            <!--自定义分组-->
            <div class="row">
              <div class="label">
                Group
              </div>
              <div class="choices">
                <ul>
                  <li v-for="(group, index) in groupList" :key="index" @click="filterGroupClick(group['id'])" :class="{active: filterActiveGroup.indexOf(group['id']) > -1}">
                    {{group['groupName']}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--pagination area-->
      <div id="pagination">
        <div class="subscribe left">
          <el-switch v-model="showSubscribeOnly">
          </el-switch>
          <span>My Subscribe</span>
        </div>
        <el-pagination background v-if="showPagination" layout="total, sizes, prev, pager, next" style="display: inline-block; vertical-align: middle" :total="count" :current-page="currentPage" :page-size="currentNum" :page-sizes="[10, 20, 50, 100]" @current-change="handlePageChange" @size-change="handleSizeChange">
        </el-pagination>
      </div>
      <!--table area-->
      <div id="currency-table">
        <el-table fit stripe :data="currencyList" :header-cell-style="headCellStyle" v-loading="currencyTableLoading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" @sort-change="sortChange">
          <el-table-column label="Rank" width="100px" align="center">
            <template slot-scope="scope">
              {{scope.row.rank}}
            </template>
          </el-table-column>
          <el-table-column label="Name" width="120px" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div @click="toCurrencyDetail(scope.row)" class="link">
                <img class="currency-logo" style="width: 20px; height: 20px; vertical-align: text-bottom" :src="`static/img/coinLogos/${scope.row.id}.png`"> {{scope.row['symbol']}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Change(24H)" prop="percent_change_24h" width="140px" sortable align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row['percent_change_24h'] == null">
                {{'- -'}}
              </div>
              <div v-else :style="{color: scope.row['percent_change_24h'] < 0 ? '#d14836' : '#019933'}">
                {{scope.row['percent_change_24h'] + '%'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Price" width="120px" align="right" prop="price_usd" sortable :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{customerParseFloat(scope.row['price_usd'], '$')}}
            </template>
          </el-table-column>
          <el-table-column label="Market Cap" align="right" sortable :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{customerParseFloat(scope.row['market_cap_usd'], '$')}}
            </template>
          </el-table-column>
          <el-table-column label="Volume(24H)" align="right" prop="24h_volume_usd" sortable :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{customerParseFloat(scope.row['24h_volume_usd'], '$')}}
            </template>
          </el-table-column>
          <el-table-column label="Total" align="right" prop="available_supply" sortable :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span style="margin-right: 20px">{{customerParseFloat(scope.row['available_supply'])}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="pagination2">
        <el-pagination background v-if="showPagination" layout="total, sizes, prev, pager, next" style="display: inline-block; vertical-align: middle" :total="count" :current-page="currentPage" :page-size=currentNum :page-sizes="[10, 20, 50, 100]" @current-change="handlePageChange" @size-change="handleSizeChange">
        </el-pagination>
      </div>
      <!--自定义选择范围对话框-->
      <el-dialog :title="$t('page.currencyList.t1') + ':'" width="30%" :visible.sync="customChoiceDiaVisible" @close="customChoiceDiaClose">
        <div class="custom-filter-range" v-if="customFilterItem">
          <el-input :placeholder="$t('page.currencyList.ph2')" v-model="customRangeStart" class="input-with-select" @blur="numberCheck('customRangeStart')">
            <template slot="prepend" v-if="customFilterItem.prepend">
              {{customFilterItem.prepend}}
            </template>
            <el-select v-if="customFilterItem.unit" v-model="customChoiceStartUnit" slot="append" :placeholder="$t('page.currencyList.ph3')">
              <el-option v-for="(item, index) in customFilterItem.unit" :key="index" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-input>
          <p>{{$t('to')}}</p>
          <el-input :placeholder="$t('page.currencyList.ph2')" v-model="customRangeEnd" class="input-with-select" @blur="numberCheck('customRangeEnd')">
            <template slot="prepend" v-if="customFilterItem.prepend">
              {{customFilterItem.prepend}}
            </template>
            <el-select v-if="customFilterItem.unit" v-model="customChoiceEndUnit" slot="append" :placeholder="$t('page.currencyList.ph3')">
              <el-option v-for="(item, index) in customFilterItem.unit" :key="index" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-input>
        </div>
        <div v-else>
          No Filter Item
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="customChoiceDiaVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary" @click="customChoiceConfirm">{{$t('confirm')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import net_util from "../../assets/js/net_utils";
import config from "../../assets/js/config";
import utils from "../../assets/js/utils";
import consts from "../../assets/js/consts";
import { mapMutations, mapGetters } from "vuex"

export default {
  data: function () {
    return {
      // 是否为管理员
      isAdmin: sessionStorage.getItem("admin"),
      // 导航栏搜索
      headSearchText: "",
      headSearchLoading: false,
      headSearchOptions: [],
      // 导航栏选择的货币列表
      chooseCurrencyList: [],
      // 分页字段
      showPagination: true,
      count: "",
      currentPage: 1,
      currentNum: 100,
      currencyTableLoading: false,
      // 货币列表，货币排序字段
      currentOrder: null,
      currentProp: null,
      currencyList: [],
      // 标签过滤一栏是否收起
      tagsRowExpand: false,
      // 自定义选择范围
      chooseFilterItems: null,
      customChoiceDiaVisible: false,
      customFilterItem: null,
      customFilterItemIndex: null,
      customFilterText: "",
      customRangeStart: "",
      customRangeEnd: "",
      customChoiceStartUnit: "",
      customChoiceEndUnit: "",
      // 货币过滤字段常量
      currencyFilter: consts.currencyFilter,
      showSubscribeOnly: false,
      // 选择货币标签字段
      filterActiveTag: [],
      tagList: [],
      // 货币分组字段
      groupList: [],
      filterActiveGroup: [],
      //如果是手动的清除tag,group,subscribe的动作，将switch设置为true，然后再watch的回调中将swicth设置为false
      tagSwitch: false,
      groupSwitch: false,
      subSwitch: false
    };
  },
  watch: {
    filterActiveGroup(val) {
      if (this.groupSwitch) {
        this.groupSwitch = false
        return
      }
      if (this.filterActiveGroup.length > 0) {
        this.getCurrencyByGroupId(val[0]).then(res => {
          if (!res.errorMsg) {
            let currencyList = res.result.map(item => item["currency"]);
            this.getCurrencyDetailByIds(currencyList);
            this.clearCurrencyFilter()
            this.clearActiveTag()
            this.clearSubscribe()
          } else {
            this.$message({ type: "error", message: res.errorMsg });
          }
        });
      } else {
        this.getCurrencyList(
          this.currentPage,
          this.currentNum,
          this.currentOrder,
          this.currentProp
        );
      }
    },
    filterActiveTag(val) {
      if (this.tagSwitch) {
        this.tagSwitch = false
        return
      }
      this.getCurrencyList(
        1,
        this.currentNum,
        this.currentOrder,
        this.currentProp
      );
    },
    showSubscribeOnly(val) {
      if (this.subSwitch) {
        this.subSwitch = false
        return
      } else {
        this.clearCurrencyFilter()
        this.clearActiveTag()
        this.clearActiveGroup()
      }
      if (val) {
        this.getCurrencyDetailByIds(this.subscribeCurrencyList);
      } else {
        this.getCurrencyList(
          this.currentPage,
          this.currentNum,
          this.currentOrder,
          this.currentProp
        );
      }
    }
  },
  methods: {
    ...mapMutations(["setCurrencyListPageFilter"]),
    // 在点击Group和subscribe的时候清除选中的其他guolv条件
    clearCurrencyFilter() {
      this.currencyFilter.forEach(item => {
        if (item.active_index !== null) {
          item.active_index = null
        }
      })
    },
    clearActiveTag() {
      if (this.filterActiveTag.length > 0) {
        this.tagSwitch = true
        this.filterActiveTag = []
      }
    },
    clearActiveGroup() {
      if (this.filterActiveGroup.length > 0) {
        this.groupSwitch = true
        this.filterActiveGroup = []
      }
    },
    clearSubscribe() {
      if (this.showSubscribeOnly) {
        this.subSwitch = true
        this.showSubscribeOnly = false
      }
    },
    // 获取分组列表
    getGroupList() {
      let url = config.JAVABASEDOMAIN + `/pros/group/list`;
      let succ = res => {
        if (!res.errorMsg) {
          this.groupList = res.result;
        } else {
          this.$message({ type: "error", message: res.errorMsg });
        }
      };
      let fail = res => {
        this.$message({
          type: "error",
          message: res.responseJSON.message || this.$t("error")
        });
      };
      net_util.getRequest(url, {}, succ, fail);
    },
    // 根据分组名称获取所有相关的货币
    getCurrencyByGroupId(id) {
      let url = config.JAVABASEDOMAIN + `/pros/group/cy/list`;
      let data = {
        groupId: id
      };
      let fail = res => {
        this.$message({
          type: "error",
          message: res.responseJSON.message || this.$t("error")
        });
      };
      return new Promise((resolve, reject) => {
        net_util.getRequest(url, data, res => resolve(res), fail);
      });
    },
    // 点击分组名称
    filterGroupClick(id) {
      if (this.filterActiveGroup[0] === id) {
        this.filterActiveGroup.splice(0, 1);
      } else {
        this.filterActiveGroup.splice(0, 1);
        this.filterActiveGroup.push(id);
      }
    },
    // 根据id数组计算货币名字
    calcGroupNameById(ids) {
      let chosenGroup = this.groupList.filter(
        item => ids.indexOf(item.id) > -1
      );
      return chosenGroup.map(item => item.groupName).join(";");
    },
    // 请求标签列表
    getTagList() {
      let url = config.PYTHONBASEDOMAIN + `/currency/tags`;
      let data = {};
      let succ = res => {
        this.tagList = JSON.parse(res).result;
      };
      let fail = res => {
        this.$message({ type: "error", message: "异常" });
      };
      net_util.getRequest(url, data, succ, fail, false);
    },
    // 点击标签过滤字段的回调
    filterTagLabelClick(id) {
      let index = this.filterActiveTag.indexOf(id);
      if(this.filterActiveTag[0] === id){
        this.filterActiveTag.splice(0, 1);
      }else{
        this.filterActiveTag.splice(0, 1);
        this.filterActiveTag.push(id);
      }
    },
    // 取消选择标签
    unSelectFilterTag() {
      this.filterActiveTag = [];
    },
    // 根据选择的tag ids计算出选择tags的name
    calcTagNamesById(ids) {
      let filter_tags = this.tagList.filter(item => ids.indexOf(item.id) > -1);
      return filter_tags.map(item => item["tag_name"]).join(" ; ");
    },
    // 请求货币列表
    getCurrencyList(
      page = 1,
      currentNum = this.currentNum,
      order = null,
      prop = null
    ) {
      let url = config.PYTHONBASEDOMAIN + "/currency/list";
      let data = {
        page: page,
        num: currentNum,
        tag_ids: JSON.stringify(this.filterActiveTag)
      };
      if (order && prop) {
        data.col = prop;
        data.order = order;
      }
      let filters = [];
      this.currencyFilter.forEach(item => {
        if (item.active_index !== null) {
          if (item.active_index === -1) {
            filters.push({ col: item.col, custom_choice: item.custom_choice });
          } else {
            filters.push({ col: item.col, index: item.active_index });
          }
        }
      });
      if (filters.length > 0) {
        data.filters = JSON.stringify(filters);
      }
      let succ = res => {
        this.clearActiveGroup()
        this.clearSubscribe()
        this.currencyTableLoading = false;
        let rs = JSON.parse(res);
        this.currencyList = rs.result.data;
        this.count = rs.result.count;
        this.currentPage = page;
        this.currentNum = currentNum;
        this.currentOrder = order;
        this.currentProp = prop;
        this.chooseFilterItems = filters.length > 0 ? filters : null;
      };
      let fail = res => {
        this.currencyTableLoading = false;
        this.$message({
          type: "error",
          message: res.responseJSON.message || "未知错误"
        });
      };
      this.currencyTableLoading = true;
      net_util.getRequest(url, data, succ, fail, false);
    },
    // 请求货币列表，仅包含用户订阅的货币
    getCurrencyDetailByIds(ids) {
      let url = config.PYTHONBASEDOMAIN + "/currency";
      let data = { ids: JSON.stringify(ids) };
      let succ = res => {
        this.currencyTableLoading = false;
        this.currencyList = res;
      };
      let fail = res => {
        this.currencyTableLoading = false;
        this.$message({
          type: "error",
          message: res.responseJSON.message || "未知错误"
        });
      };
      this.currencyTableLoading = true;
      net_util.getRequest(url, data, succ, fail);
    },
    // 请求用户订阅货币的id列表，Java端
    getSubscribeCurrencyList() {
      let url = config.JAVABASEDOMAIN + "/subscribe/list";
      let succ = res => {
        if (!res.errorMsg) {
          let list = [];
          if (res.result.length > 0) {
            res.result.forEach(item => {
              list.push(item["currencyId"]);
            });
          }
          this.subscribeCurrencyList = list;
        } else {
          this.$message({ type: "error", message: res.errorMsg });
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: "获取订阅列表失败" });
      };
      net_util.getRequest(url, {}, succ, fail);
    },
    // 请求货币搜索接口
    headSearchMethod(query) {
      if (query !== "" && query.length >= 2) {
        this.loading = true;
        let url = config.PYTHONBASEDOMAIN + "/currency/search";
        let succ = res => {
          this.headSearchOptions = res.data;
        };
        let fail = res => {
          this.$message({
            type: "error",
            message: res.responseJSON.message || "未知错误"
          });
        };
        net_util.getRequest(url, { keyword: query }, succ, fail);
      } else {
        this.headSearchOptions = [];
      }
    },
    // 头部导航栏搜索框值改变时的回调
    headSearchChange() {
      if (this.chooseCurrencyList.length > 0) {
        this.getChosenCurrency();
      } else {
        this.getCurrencyList(
          this.currentPage,
          this.currentNum,
          this.currentOrder,
          this.currentProp
        );
      }
    },
    // 请求头部导航栏搜索框值改变时选的的货币详情
    getChosenCurrency() {
      let url = config.PYTHONBASEDOMAIN + "/currency";
      let data = {
        ids: JSON.stringify(this.chooseCurrencyList)
      };
      let succ = res => {
        this.currencyList = res;
      };
      let fail = res => {
        this.$message({
          type: "error",
          message: res.responseJSON.message || "未知错误"
        });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    // 取消选择列表过滤字段的回调
    unSelectFilterItem(item) {
      item.active_index = null;
      this.getCurrencyList(
        1,
        this.currentNum,
        this.currentOrder,
        this.currentProp
      );
    },
    // 选择列表过滤字段的回调
    selectFilterItem(item, choice_index) {
      if (item.active_index === choice_index) {
        item.active_index = null;
      } else {
        item.active_index = choice_index;
      }
      this.getCurrencyList(
        1,
        this.currentNum,
        this.currentOrder,
        this.currentProp
      );
    },
    // 显示用户自定义范围对话框的回调
    showCustomChoice(item, index) {
      this.customChoiceDiaVisible = true;
      this.customFilterItem = item;
      this.customFilterItemIndex = index;
    },
    // 点击却确定关闭自定义范围对话框的回调
    customChoiceConfirm() {
      let getUnitTextByValue = (v) => {
        let unitArray = this.currencyFilter[this.customFilterItemIndex]['unit']
        if (v) {
          let t
          unitArray.forEach(item => {
            if (item.value === v) {
              t = item.text
            }
          })
          return t
        }
        return ''
      }
      if (!(this.customRangeStart && this.customRangeEnd)) {
        this.$message({ type: 'warning', message: 'none condition may lead to empty search.' })
        return false
      }
      console.log(this.customChoiceStartUnit, this.customChoiceEndUnit)
      let start = this.customRangeStart * (this.customChoiceStartUnit || 1);
      let end = this.customRangeEnd * (this.customChoiceEndUnit || 1);
      if (start > end) {
        this.$message({ type: 'warning', message: 'ensure then end number larger than start number.' })
        return false
      }
      let prepend = this.customFilterItem.prepend || "";
      this.currencyFilter[this.customFilterItemIndex].custom_choice = {
        text: `${prepend}${this.customRangeStart}${getUnitTextByValue(this.customChoiceStartUnit)} - ${prepend}${this.customRangeEnd}${getUnitTextByValue(this.customChoiceEndUnit)}`,
        start: start,
        end: end
      };
      this.currencyFilter[this.customFilterItemIndex].active_index = -1;
      this.getCurrencyList(
        1,
        this.currentNum,
        this.currentOrder,
        this.currentProp
      );
      this.customChoiceDiaVisible = false;
    },
    // 关闭自定义范围对话框，重置对话框中的字段
    customChoiceDiaClose() {
      this.customFilterItem = null;
      this.customRangeStart = "";
      this.customRangeEnd = "";
      this.customChoiceStartUnit = "";
      this.customChoiceEndUnit = "";
    },
    // 检查用户输入字符串的合法性
    numberCheck(str) {
      function reset(s) {
        if (typeof s === "number" && !isNaN(s)) return s;
        else {
          let s1 = s.replace(/^\D*([1-9]\d*(\.\d{2})?).*$/, "$1");
          return s1.replace(/[^\d.]+/, "");
        }
      }
      if (str === "customRangeEnd") {
        this.customRangeEnd = reset(this.customRangeEnd);
      } else if (str === "customRangeStart") {
        this.customRangeStart = reset(this.customRangeStart);
      }
    },
    // 货币列表排序变化时的回调
    sortChange(obj) {
      this.getCurrencyList(1, this.currentNum, obj.order, obj.prop);
    },
    // 分页改变的回调
    handlePageChange(val) {
      if (val !== this.currentPage) {
        this.getCurrencyList(
          val,
          this.currentNum,
          this.currentOrder,
          this.currentProp
        );
      }
    },
    // 货币列表单页显示条数改变时的回调
    handleSizeChange(val) {
      this.getCurrencyList(1, val, this.currentOrder, this.currentProp);
    },
    toCurrencyDetail(row) {
      let query = {
        id: row.id,
        page: this.currentPage,
        name: row.name
      };
      this.$router.push({ name: "currency_overview", query: query });
    },
    headCellStyle(row) {
      let style = {
        padding: 0,
        "line-height": "40px",
        "font-weight": "normal"
      };
      if (row.columnIndex === 6) {
        style["padding-right"] = "20px";
      }
      return style;
    },
    customerParseFloat: utils.customerParseFloat,
    getSmpFormatDateByLong: utils.getSmpFormatDateByLong,
    getDateDiff: utils.getDateDiff
  },
  mounted() {
    if (this.$route.query.page) {
      this.getCurrencyList(this.$route.query.page);
    } else {
      this.getCurrencyList();
    }
    this.getTagList();
    this.getGroupList();
  },
  beforeRouteEnter(to, from, next){
    let matchFlag = false
    from.matched.forEach(item => {
      if(item.name === 'currency_detail'){
        matchFlag = true
      }
    })
    next(vm => {
      if(matchFlag){
        let filters = vm.$store.getters.currencyListPageFilter
        if(filters.filterActiveGroup){
          vm.filterActiveGroup = filters.filterActiveGroup
        }
        if(filters.filterActiveTag){
          vm.filterActiveTag = filters.filterActiveTag
        }
        if(filters.currencyFilter){
           vm.currencyFilter = filters.currencyFilter
        }
        if(filters.tagsRowExpand){
          vm.tagsRowExpand = filters.tagsRowExpand
        }
      }
    })
  },
  beforeDestroy() {
    this.setCurrencyListPageFilter({
      filters: {
        filterActiveGroup: this.filterActiveGroup,
        filterActiveTag: this.filterActiveTag,
        currencyFilter: this.currencyFilter,
        tagsRowExpand: this.tagsRowExpand
      }
    })
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../static/css/base.styl';

#currencyList
  padding-top 60px !important

  #top-search
    position fixed
    width 100%
    top 60px
    background #FFF
    padding 0 20px
    border-bottom 1px solid #eeeeee
    box-sizing border-box
    z-index 99

    h2
      margin 0
      display inline-block
      font-size 25px
      font-weight normal
      line-height 60px

    .search-field
      line-height 60px
      float right
      width 400px

  #filter
    margin-top 80px
    background-color #FFF
    font-size 13px
    padding 5px 0

    .block
      opacity 0.5

    .selector
      .content
        .row
          .label
            min-width 60px
            float left
            line-height 26px
            padding 5px 20px
            color #999999

          .custom-btn
            margin-right 20px

          .expand-ctl
            line-height 20px
            margin-right 20px

          .choices
            line-height 26px
            margin-left 100px
            margin-right 90px
            overflow hidden
            transition 0.25s

            ul
              padding 0
              margin 0

              li
                margin 5px
                padding 0 10px
                position relative
                display inline-block
                border-radius 20px
                cursor pointer
                font-size 13px
                color #333333
                transition 0.2s

                &.active
                  color #ffffff
                  background #409eff

                &:hover
                  color #ffffff
                  background #409eff

  #pagination
    margin 10px
    height 32px
    text-align right
    font-size 14px

    .subscribe
      color #999999
      margin-top 3px

    .btn
      line-height 40px

    .history-price-btn
      position relative
      margin-left 50px

      img
        height 16px
        width 16px
        position absolute
        top 10px
        left -20px

  #pagination2
    text-align right
    margin 10px

  #currency-table
    .operate-items
      li
        display inline-block
        cursor pointer

        img
          padding 0 5px
          width 15px
          height 15px

    .currency-logo
      width 20px
      height 20px
      vertical-align text-bottom
      margin-right 5px

  .custom-filter-range
    p
      margin-left 10px

    .input-with-select
      margin 10px 0

    .el-select
      .el-input
        width 130px

  .tags-group
    .el-checkbox
      margin-left 30px
      min-width 180px
      white-space nowrap
      overflow hidden
      -ms-text-overflow ellipsis
      text-overflow ellipsis

  .el-dropdown
    color rgb(255, 255, 255)
    cursor pointer
</style>

<style lang="stylus">
@import '../../../static/css/base.styl'

#currencyList
  padding-top 60px !important

  #top-search
    position fixed
    width 100%
    top 60px
    background #FFF
    padding 0 20px
    border-bottom 1px solid #eeeeee
    box-sizing border-box
    z-index 99

    h2
      margin 0
      display inline-block
      font-size 25px
      font-weight normal
      line-height 60px

    .search-field
      line-height 60px
      float right
      width 400px

  #filter
    margin-top 80px
    background-color #FFF
    font-size 13px
    padding 5px 0

    .block
      opacity 0.5

    .selector
      .content
        .row
          .label
            min-width 60px
            float left
            line-height 26px
            padding 5px 20px
            color #999999

          .custom-btn
            margin-right 20px

          .expand-ctl
            line-height 20px
            margin-right 20px

          .choices
            line-height 26px
            margin-left 100px
            margin-right 90px
            overflow hidden
            transition 0.25s

            ul
              padding 0
              margin 0

              li
                margin 5px
                padding 0 10px
                position relative
                display inline-block
                border-radius 20px
                cursor pointer
                font-size 13px
                color #333333
                transition 0.2s

                &.active
                  color #ffffff
                  background #409eff

                &:hover
                  color #ffffff
                  background #409eff

  #pagination
    margin 10px
    height 32px
    text-align right
    font-size 14px

    .subscribe
      color #999999
      margin-top 3px

    .btn
      line-height 40px

    .history-price-btn
      position relative
      margin-left 50px

      img
        height 16px
        width 16px
        position absolute
        top 10px
        left -20px

  #pagination2
    text-align right
    margin 10px

  #currency-table
    .operate-items
      li
        display inline-block
        cursor pointer

        img
          padding 0 5px
          width 15px
          height 15px

    .currency-logo
      width 20px
      height 20px
      vertical-align text-bottom
      margin-right 5px

  .custom-filter-range
    p
      margin-left 10px

    .input-with-select
      margin 10px 0

    .el-select
      .el-input
        width 130px

  .tags-group
    .el-checkbox
      margin-left 30px
      min-width 180px
      white-space nowrap
      overflow hidden
      -ms-text-overflow ellipsis
      text-overflow ellipsis

  .el-dropdown
    color rgb(255, 255, 255)
    cursor pointer
</style>


