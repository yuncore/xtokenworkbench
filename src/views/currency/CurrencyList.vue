// old page, last version, unused now.
<template>
    <div id="currencyList">
        <div class="container">
            <!--top search-->
            <div id="top-search">
                <h2>Cryptocurrencies</h2>
                <el-select
                    v-model="chooseCurrencyList"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="headSearchMethod"
                    :loading="headSearchLoading"
                    placeholder="search"
                    @change="headSearchChange"
                    class="search-field">
                    <el-option
                        v-for="(item, index) in headSearchOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <!--top filters-->
            <div id="filter">
                <div class="selector">
                    <div class="content" :class="{block: filterActiveGroup.length > 0}">
                        <div v-for="(item, filter_index) in currencyFilter"
                             :key="filter_index"
                             class="row">
                            <div class="label">
                                {{item.name}}
                            </div>
                            <div class="choices">
                                <ul>
                                    <li v-for="(choice, choice_index) in item.choices"
                                        :key="choice_index"
                                        :class="{active: item.active_index == choice_index}"
                                        @click="selectFilterItem(item, choice_index)">
                                        {{choice}}
                                    </li>
                                    <el-button v-if="item.custom" size="mini" @click="showCustomChoice(item, filter_index)">
                                        Custom Field
                                    </el-button>
                                </ul>
                            </div>
                        </div>
                        <!--标签过滤-->
                        <div class="row">
                            <div class="label">
                                Tags
                            </div>
                            <el-button type="text"
                                       size="mini"
                                       @click="tagsRowExpand = !tagsRowExpand"
                                       class="right expand-ctl">
                                {{tagsRowExpand ?'Pack up' : 'Expand'}}
                                <i :class="tagsRowExpand ?'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                            </el-button>
                            <div class="choices" :style="{'max-height': tagsRowExpand ? '600px' : '36px'}">
                                <ul>
                                    <li v-for="(tag, index) in tagList"
                                        :key="index"
                                        @click="filterTagLabelClick(tag['id'])"
                                        :class="{active: filterActiveTag.indexOf(tag['id']) > -1}">
                                        {{tag['tag_name']}}
                                    </li>
                                    <el-button v-if="isAdmin" size="mini" @click="toTagManage">
                                        Edit
                                    </el-button>
                                </ul>
                            </div>
                        </div>
                        <!--Subscribe-->
                        <!--<div class="row">
                            <div class="label">
                                Subscribe
                            </div>
                            <div class="choices subscribe">
                                <el-switch
                                    v-model="showSubscribeOnly">
                                </el-switch>
                            </div>
                        </div>-->
                    </div>
                    <div class="content" v-if="groupList.length > 0">
                        <!--自定义分组-->
                        <div class="row">
                            <div class="label">
                                Group
                            </div>
                            <div class="choices">
                                <ul>
                                    <li v-for="(group, index) in groupList"
                                        :key="index"
                                        @click="filterGroupClick(group['id'])"
                                        :class="{active: filterActiveGroup.indexOf(group['id']) > -1}">
                                        {{group['groupName']}}
                                    </li>
                                    <el-button v-if="isAdmin" size="mini" @click="toGroupManage">
                                        Edit
                                    </el-button>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--pagination area-->
            <!--<div id="pagination">
                <div class="subscribe left">
                    <el-switch
                        v-model="showSubscribeOnly">
                    </el-switch>
                    <span>My Subscribe</span>
                </div>
                <el-pagination
                    background
                    v-if="showPagination"
                    layout="total, sizes, prev, pager, next, jumper"
                    style="display: inline-block; vertical-align: middle"
                    :total="count"
                    :current-page="currentPage"
                    :page-size=currentNum
                    :page-sizes="[10, 20, 50, 100]"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange">
                </el-pagination>
            </div>-->
            <!--table area-->
            <div id="currency-table">
                <el-table
                    fit
                    stripe
                    :data="currencyList"
                    v-loading="currencyTableLoading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    @sort-change="sortChange">
                    <el-table-column label="Rank" width="150px" align="center">
                        <template slot-scope="scope">
                            {{scope.row.rank}}
                        </template>
                    </el-table-column>
                    <!--<el-table-column label="Name" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span @click="toCurrencyDetail(scope.row)" class="link">
                                 {{scope.row['name']}}
                            </span>
                        </template>
                    </el-table-column>-->
                    <el-table-column label="Name" align="left" width="100px" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <div @click="toCurrencyDetail(scope.row)" class="link">
                                <img class="currency-logo" style="width: 20px; height: 20px; vertical-align: text-bottom" :src="`static/img/coinLogos/${scope.row.id}.png`">
                                {{scope.row['symbol']}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Price" width="120px" align="right" prop="price_usd" sortable :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{customerParseFloat(scope.row['price_usd'], '$')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Change(24h)" prop="percent_change_24h" sortable align="right" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <div v-if="scope.row['percent_change_24h'] == null">
                                {{'- -'}}
                            </div>
                            <div v-else :style="{color: scope.row['percent_change_24h'] < 0 ? '#d14836' : '#019933'}">
                                {{scope.row['percent_change_24h'] + '%'}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Market Cap" align="right" sortable :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{customerParseFloat(scope.row['market_cap_usd'], '$')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Total" align="right" prop="available_supply" sortable :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{customerParseFloat(scope.row['available_supply'])}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <ul class="operate-items">
                                <li @click="coinNameClick(scope.row)">
                                    <img :src="subscribeCurrencyList.indexOf(scope.row['id']) > -1 ?'static/img/star_active.png' : 'static/img/star_not_active.png'">
                                </li>
                                <li @click="collectorDotClick(scope.row)">
                                    <img src="../../../static/img/dot.svg" alt="predict" title="predict">
                                </li>
                                <li @click="groupChooseClick(scope.row)">
                                    <img src="../../../static/img/self-group.png" alt="add to group" title="add to group">
                                </li>
                                <li @click="blackListButtonClick(scope.row)">
                                    <img src="../../../static/img/black-list.png" alt="black list" title="black list">
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="pagination2">
                <el-pagination
                    background
                    v-if="showPagination"
                    layout="total, sizes, prev, pager, next, jumper"
                    style="display: inline-block; vertical-align: middle"
                    :total="count"
                    :current-page="currentPage"
                    :page-size=currentNum
                    :page-sizes="[10, 20, 50, 100]"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange">
                </el-pagination>
            </div>
            <!--<div>
                <el-table
                    fit
                    stripe
                    max-height="800"
                    :data="currencyList"
                    v-loading="currencyTableLoading"
                    element-loading-text="数据加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    header-cell-class-name='currency-table-head-cell'
                    @sort-change="sortChange">
                    <el-table-column label="#" align="center">
                        <template slot-scope="scope">
                            {{(scope.$index + 1) + (currentPage - 1) * currentNum}}
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('page.currencyList.currencyName')" align="center" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <div @click="coinNameClick(scope.row)"
                                 style="color: #469ffd; cursor: pointer">
                                <img :src="subscribeCurrencyList.indexOf(scope.row['id']) > -1 ?'static/img/star_active.png' : 'static/img/star_not_active.png'">
                                <span>{{scope.row['name']}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('page.currencyList.symbol')" align="center" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row['symbol']}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(raw , index) in heads"
                                     v-if='raw.show'
                                     :key="index"
                                     :label="$t('page.currencyList.' + raw.i18n)"
                                     :prop="raw.col"
                                     :show-overflow-tooltip="true"
                                     :sortable='raw.sortable'
                                     :min-width="raw.width ? raw.width : 100"
                                     :align="raw.align ? raw.align : 'center'">
                        <template slot-scope="scope">
                            <div v-if="['rank', 'id'].indexOf(raw.col) > -1">
                                {{scope.row[raw.col]}}
                            </div>
                            <div v-if="['market_cap_usd', 'market_cap_usd', 'price_usd'].indexOf(raw.col) > -1">
                                {{customerParseFloat(scope.row[raw.col], '$')}}
                            </div>
                            <div v-if="['percent_change_1h', 'percent_change_7d', 'percent_change_24h'].indexOf(raw.col) > -1">
                                <div v-if="scope.row[raw.col] == null">
                                    {{'- -'}}
                                </div>
                                <div v-else :style="{color: scope.row[raw.col] < 0 ? '#d14836' : '#019933'}">
                                    {{scope.row[raw.col] + '%'}}
                                </div>
                            </div>
                            <div v-if="['total_supply', 'available_supply', 'max_supply'].indexOf(raw.col) > -1">
                                {{customerParseFloat(scope.row[raw.col])}}
                            </div>
                            <div v-if="['price_btc'].indexOf(raw.col) > -1">
                                {{scope.row[raw.col]}}
                            </div>
                            <div v-if="['last_updated'].indexOf(raw.col) > -1">
                                {{getDateDiff(scope.row[raw.col] * 1000)}}
                            </div>
                            <div v-if="['btt'].indexOf(raw.col) > -1">
                                {{ scope.row[raw.col] && scope.row[raw.col]['replies'] || '- -'}}
                            </div>
                            <div v-if="['github'].indexOf(raw.col) > -1">
                                {{scope.row[raw.col] && scope.row[raw.col]['full_name'] || '- -'}}
                            </div>
                            <div v-if="['reddit'].indexOf(raw.col) > -1">
                                {{scope.row[raw.col] && scope.row[raw.col]['sr_name'] || '- -'}}
                            </div>
                            <div v-if="['ico_raised'].indexOf(raw.col) > -1">
                                {{scope.row[raw.col] && customerParseFloat(scope.row[raw.col], '$') || '- -'}}
                            </div>
                            <div v-if="['ico_date_from'].indexOf(raw.col) > -1">
                                {{scope.row[raw.col] && getSmpFormatDateByLong(scope.row[raw.col]*1000, false) || '- -'}}
                            </div>
                            <div v-if="['ico_date_to'].indexOf(raw.col) > -1">
                                {{scope.row[raw.col] && getSmpFormatDateByLong(scope.row[raw.col]*1000, false) || '- -'}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" width="100">
                        <template slot-scope="scope">
                            <el-dropdown style="color: #409eff">
                              <span class="el-dropdown-link">
                                {{$t('more')}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                              </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                        <div @click="toCurrencyDetail(scope.row)">
                                            查看详情
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="isAdmin">
                                        <div @click="tagChooseClick(scope.row)">
                                            添加标签
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div @click="collectorDotClick(scope.row)" >
                                            预测排名
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div @click="groupChooseClick(scope.row)">
                                            添加分组
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div @click="blackListButtonClick(scope.row)">
                                            加入黑名单
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>-->
            <!--<div class="cover" v-show="isShowCover">
                <header class="header">
                    <el-button type="primary" round class="btn" @click.stop="closeMask">{{$t('confirm')}}</el-button>
                </header>
                <div class="pro-list">
                    <ul>
                        <li @click.stop="item.show = !item.show"
                            v-for="(item, index) in heads"
                            v-if="item.stick != true"
                            :key="index"
                            :class="{active: item.show}">
                            <div>
                                <img :src="item.icon" alt="">
                                <span>{{$t('page.currencyList.' + item.i18n)}}</span>
                            </div>
                            <img :src="item.show ? 'static/img/yes_selected.png' : 'static/img/no_selected.png'"
                                 class="selected" alt="">
                        </li>
                    </ul>
                </div>
            </div>-->
            <!--自定义选择范围对话框-->
            <el-dialog
                :title="$t('page.currencyList.t1') + ':'"
                width="30%"
                :visible.sync="customChoiceDiaVisible"
                @close="customChoiceDiaClose">
                <div class="custom-filter-range" v-if="customFilterItem">
                    <el-input
                        :placeholder="$t('page.currencyList.ph2')"
                        v-model="customRangeStart"
                        class="input-with-select"
                        @blur="numberCheck('customRangeStart')">
                        <template slot="prepend" v-if="customFilterItem.prepend">
                            {{customFilterItem.prepend}}
                        </template>
                        <el-select
                            v-if="customFilterItem.unit"
                            v-model="customChoiceStartUnit"
                            slot="append"
                            :placeholder="$t('page.currencyList.ph3')">
                            <el-option v-for="(item, index) in customFilterItem.unit"
                                       :key="index"
                                       :label="item.text"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-input>
                    <p>{{$t('to')}}</p>
                    <el-input
                        :placeholder="$t('page.currencyList.ph2')"
                        v-model="customRangeEnd"
                        class="input-with-select"
                        @blur="numberCheck('customRangeEnd')">
                        <template slot="prepend" v-if="customFilterItem.prepend">
                            {{customFilterItem.prepend}}
                        </template>
                        <el-select
                            v-if="customFilterItem.unit"
                            v-model="customChoiceEndUnit"
                            slot="append"
                            :placeholder="$t('page.currencyList.ph3')">
                            <el-option v-for="(item, index) in customFilterItem.unit"
                                       :key="index"
                                       :label="item.text"
                                       :value="item.value">
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
            <!--选择标签对话框-->
            <el-dialog
                :title="tagChooseCurrencyName"
                width="50%"
                :visible.sync="tagChooseDiaVisible"
                @close="tagChooseDiaClose">
                <el-checkbox-group v-model="chosenTagList" class="tags-group">
                    <el-checkbox v-for="tag in tagList" :label="tag['id']" :key="tag['id']">{{tag['tag_name']}}</el-checkbox>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="tagChooseDiaVisible = false">{{$t('cancel')}}</el-button>
                    <el-button type="primary" @click="tagChooseConfirm">{{$t('confirm')}}</el-button>
                </span>
            </el-dialog>
            <!--选择分组对话框-->
            <el-dialog
                :title="groupChooseCurrencyName"
                width="50%"
                :visible.sync="groupChooseDiaVisible"
                @close="tagChooseDiaClose">
                <el-checkbox-group v-model="chosenGroupList" class="tags-group">
                    <el-checkbox v-for="group in groupList" :label="group['id']" :key="group['id']">{{group['groupName']}}</el-checkbox>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="groupChooseDiaVisible = false">{{$t('cancel')}}</el-button>
                    <el-button type="primary" @click="groupChooseConfirm">{{$t('confirm')}}</el-button>
                </span>
            </el-dialog>
            <!--点收集器的对话框-->
            <el-dialog
                :title="$t('page.currencyList.t2') + ':'"
                width="50%"
                :visible.sync="collectorDiaVisible">
                <el-input-number
                    min="1"
                    max="10000"
                    :controls="false"
                    v-model.trim="expectRank"
                    :placeholder="$t('page.currencyList.ph4')">
                </el-input-number>
                <el-checkbox v-model="smsAlert" style="margin-top: 20px; display: block">
                    {{$t('page.currencyList.t3')}}
                </el-checkbox>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="toRankView" style="float: left" type="danger">
                        {{$t('page.currencyList.b6')}}
                    </el-button>
                    <el-button @click="collectorDiaVisible = false">{{$t('cancel')}}</el-button>
                    <el-button type="primary" @click="collectorConfirm">{{$t('confirm')}}</el-button>
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

export default {
  data: function() {
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
      currentNum: 50,
      currencyTableLoading: false,
      // 货币列表，货币排序字段
      currentOrder: null,
      currentProp: null,
      currencyList: [],
      // 订阅货币列表
      showSubscribeOnly: false,
      subscribeCurrencyList: [],
      // 表格头字段
      heads: [],
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
      // 是否显示遮罩
      isShowCover: false,
      // 是否显示搜索框
      isShowSearch: true,
      // 选择货币标签字段
      filterActiveTag: [],
      tagList: [],
      chosenTagList: [],
      tagChooseDiaVisible: false,
      tagChooseCurrencyId: "",
      tagChooseCurrencyName: "",
      // 货币分组字段
      groupList: [],
      filterActiveGroup: [],
      chosenGroupList: [],
      groupChooseDiaVisible: false,
      groupChooseCurrencyName: "",
      groupChooseCurrencyId: "",
      //点收集器
      collectorDiaVisible: false,
      predictCurrencyId: "",
      expectRank: 0,
      smsAlert: false
    };
  },
  watch: {
    filterActiveGroup(val) {
      if (this.filterActiveGroup.length > 0) {
        this.getCurrencyByGroupId(val[0]).then(res => {
          if (!res.errorMsg) {
            let currencyList = res.result.map(item => item["currency"]);
            this.getCurrencyDetailByIds(currencyList);
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
      this.getCurrencyList(1, 10, this.currentOrder, this.currentProp);
    },
    isShowCover(val) {
      if (val) {
        $("body").css("overflow", "hidden");
      } else {
        $("body").css("overflow", "auto");
      }
    },
    showSubscribeOnly(val) {
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
    // 点击加入黑名单按钮
    blackListButtonClick(row) {
      this.$alert(`确定将${row.name}加入黑名单?`, "加入黑名单", {
        confirmButtonText: "确定"
      }).then(() => {
        this.addToBlackList(row.id);
      });
    },
    // 加入黑名单
    addToBlackList(id) {
      let url = config.JAVABASEDOMAIN + `/pros/black/add`;
      let data = {
        currency: id
      };
      let succ = res => {
        if (!res.errorMsg) {
          this.$message({ type: "success", message: "操作成功！" });
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
      net_util.getRequest(url, data, succ, fail);
    },
    // 黑名单列表
    getBlackList() {
      let url = config.JAVABASEDOMAIN + `/pros/black/list`;
      let succ = res => {
        if (!res.errorMsg) {
          this.$message({ type: "success", message: "操作成功！" });
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
      net_util.getRequest(url, data, succ, fail);
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
    // 根据货币id获取该货币的所处分组
    getGroupByCurrencyId(id) {
      let url = config.JAVABASEDOMAIN + `/pros/group/cy/list`;
      let data = {
        currency: id
      };
      let succ = res => {
        if (!res.errorMsg) {
          this.chosenGroupList = res.result.map(item => item["groupId"]);
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
      net_util.getRequest(url, data, succ, fail);
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
    // 点击添加分组
    groupChooseClick(row) {
      this.getGroupByCurrencyId(row["id"]);
      this.chosenGroupList = [];
      this.groupChooseDiaVisible = true;
      this.groupChooseCurrencyId = row["id"];
      this.groupChooseCurrencyName = row["name"];
    },
    // 确认添加分组
    groupChooseConfirm() {
      if (this.groupChooseCurrencyId === "") {
        this.tagChooseDiaVisible = false;
      } else {
        let str_groups = this.calcGroupNameById(this.chosenGroupList);
        this.$alert(
          `确定添加分组: ${this.groupChooseCurrencyName} => ${str_groups}?`,
          "添加分组",
          {
            confirmButtonText: "确定"
          }
        ).then(() => {
          this.addGroupsRelation();
        });
      }
    },
    // 根据id数组计算货币名字
    calcGroupNameById(ids) {
      let chosenGroup = this.groupList.filter(
        item => ids.indexOf(item.id) > -1
      );
      return chosenGroup.map(item => item.groupName).join(";");
    },
    // 添加数组关联关系
    addGroupsRelation() {
      let url = config.JAVABASEDOMAIN + `/pros/group/update`;
      let data = {
        currency: this.groupChooseCurrencyId,
        groupIds: this.chosenGroupList
      };
      let succ = res => {
        if (!res.errorMsg) {
          this.$message({ type: "success", message: "操作成功！" });
          this.groupChooseDiaVisible = false;
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
      net_util.formRequest(url, data, succ, fail);
    },

    // 添加货币和标签的关联关系
    addTagsRelation() {
      let url = config.PYTHONBASEDOMAIN + `/currency/tags/relation`;
      let data = {
        tag_ids: JSON.stringify(this.chosenTagList),
        currency_ids: this.tagChooseCurrencyId
      };
      let succ = res => {
        this.tagChooseDiaVisible = false;
        this.$message({ type: "success", message: "操作成功！" });
        this.getCurrencyList(this.currentPage);
      };
      let fail = res => {
        this.$message({
          type: "error",
          message: res.responseJSON.message || "未知错误"
        });
      };
      net_util.postRequest(url, data, succ, fail);
    },
    // 选择货币标签对话框点击确定按钮
    tagChooseConfirm() {
      if (this.tagChooseCurrencyId === "") {
        this.tagChooseDiaVisible = false;
      } else {
        let str_tags = this.calcTagNamesById(this.chosenTagList);
        this.$alert(
          `确定设置标签: ${this.tagChooseCurrencyName} => ${str_tags}?`,
          "关联标签",
          {
            confirmButtonText: "确定"
          }
        ).then(() => {
          this.addTagsRelation();
        });
      }
    },
    // 选择货币标签对话框关闭时的回调
    tagChooseDiaClose() {
      this.chosenTagList = [];
      this.tagChooseCurrencyId = "";
      this.tagChooseCurrencyName = "";
    },
    // 用户点击添加标签按钮的回调，显示标签对话框
    tagChooseClick(row) {
      this.chosenTagList = row["tags"];
      this.tagChooseDiaVisible = true;
      this.tagChooseCurrencyId = row["id"];
      this.tagChooseCurrencyName = row["name"];
    },
    // 请求标签列表
    getTagList() {
      let url = config.PYTHONBASEDOMAIN + `/currency/tags`;
      let data = {};
      let succ = res => {
        this.tagList = JSON.parse(res).result;
      };
      let fail = res => {
        //                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
        this.$message({ type: "error", message: "异常" });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    // 点击标签过滤字段的回调
    filterTagLabelClick(id) {
      let index = this.filterActiveTag.indexOf(id);
      if (index > -1) {
        this.filterActiveTag.splice(index, 1);
      } else {
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
      net_util.getRequest(url, data, succ, fail);
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

    // 用户点击订阅按钮的回调
    coinNameClick(row) {
      if (this.subscribeCurrencyList.indexOf(row.id) > -1) {
        this.$alert(`确定取消对${row.name}的关注？`, "取消关注", {
          confirmButtonText: "确定"
        }).then(() => {
          this.unSubscribeCurrency(row.id);
        });
      } else {
        this.$alert(`确定将${row.name}加入我的关注？`, "关注货币", {
          confirmButtonText: "确定"
        }).then(() => {
          this.subscribeCurrency(row.id);
        });
      }
    },
    // 请求订阅货币接口，Java端
    subscribeCurrency(id) {
      let url = config.JAVABASEDOMAIN + "/subscribe/add";
      let data = { currencyId: id };
      let succ = res => {
        if (!res.errorMsg) {
          this.getSubscribeCurrencyList();
          this.$message({ type: "success", message: "关注成功" });
        } else {
          this.$message({ type: "error", message: res.errorMsg });
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: "连接失败" });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    // 请求取消订阅货币接口
    unSubscribeCurrency(id) {
      let url = config.JAVABASEDOMAIN + "/subscribe/remove";
      let data = { currencyId: id };
      let succ = res => {
        if (!res.errorMsg) {
          this.getSubscribeCurrencyList();
          this.$message({ type: "success", message: "取消成功" });
        } else {
          this.$message({ type: "error", message: res.errorMsg });
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: "连接失败" });
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
      let start = this.customRangeStart * (this.customChoiceStartUnit || 1);
      let end = this.customRangeEnd * (this.customChoiceEndUnit || 1);
      let prepend = this.customFilterItem.prepend || "";
      this.currencyFilter[this.customFilterItemIndex].custom_choice = {
        text: prepend + start + " - " + prepend + end,
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

    // 显示点收集器
    collectorDotClick(row) {
      this.expectRank = row.rank;
      this.predictCurrencyId = row.id;
      this.collectorDiaVisible = true;
    },
    // 点收集器对话框点击确定按钮
    collectorConfirm() {
      let url = config.JAVABASEDOMAIN + "/predict/add";
      let data = {
        currencyId: this.predictCurrencyId,
        rank: this.expectRank,
        sms: this.smsAlert ? 1 : 0
      };
      let succ = res => {
        if (!res.errorMsg) {
          this.$message({ type: "success", message: "操作成功！" });
          this.collectorDiaVisible = false;
        } else {
          this.$message({ type: "error", message: res.errorMsg });
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: "操作失败！" });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    // 前往排行榜列表
    toRankView() {
      this.$router.push({ name: "predict" });
      this.collectorDiaVisible = false;
    },

    // 货币列表排序变化时的回调
    sortChange(obj) {
      debugger;
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

    // 关闭列选择的遮罩层，将此时页面中显示的字段写入到localstoreage
    closeMask() {
      let activeCol = [];
      for (let i = 0; i < this.heads.length; i++) {
        if (this.heads[i].show) {
          activeCol.push(i);
        }
      }
      localStorage.setItem("currency_active_col", JSON.stringify(activeCol));
      this.isShowCover = false;
    },
    toCurrencyDetail(row) {
      let query = {
        id: row.id,
        page: this.currentPage,
        name: row.name
      };
      this.$router.push({ name: "CurrencyDetail", query: query });
    },
    toTagManage() {
      let query = {
        page: this.currentPage
      };
      this.$router.push({ name: "tag_management", query: query });
    },
    toHistoryPrice() {
      let query = {
        page: this.currentPage
      };
      this.$router.push({ name: "history_rank", query: query });
    },
    toGroupManage() {
      let query = {
        page: this.currentPage
      };
      this.$router.push({ name: "group_management", query: query });
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
    this.getSubscribeCurrencyList();
    this.getTagList();
    this.getGroupList();
    let allHeads = consts.currencyHeads;
    let activeColStr = localStorage.getItem("currency_active_col");
    if (activeColStr) {
      let activeCol = JSON.parse(activeColStr);
      for (let i = 0; i < allHeads.length; i++) {
        allHeads[i].show = activeCol.indexOf(i) > -1;
      }
    }
    this.heads = allHeads;
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../static/css/base.styl';

#currencyList {
  padding-top: 60px !important;

  #top-search {
    background: #FFF;
    padding: 0 20px;
    border-bottom: 1px solid #eeeeee;

    h2 {
      margin: 0;
      display: inline-block;
      font-size: 25px;
      font-weight: normal;
      line-height: 60px;
    }

    .search-field {
      line-height: 60px;
      float: right;
      width: 400px;
    }
  }

  #filter {
    background-color: #FFF;
    font-size: 13px;
    padding: 5px 0;

    .block {
      opacity: 0.5;
    }

    .selector {
      .content {
        .row {
          .label {
            min-width: 60px;
            float: left;
            line-height: 26px;
            padding: 5px 20px;
            color: #999999;
          }

          .expand-ctl {
            line-height: 20px;
            margin-right: 10px;
          }

          .choices {
            line-height: 26px;
            margin-left: 100px;
            margin-right: 80px;
            overflow: hidden;
            transition: 0.25s;

            ul {
              padding: 0;
              margin: 0;

              li {
                margin: 5px;
                padding: 0 10px;
                position: relative;
                display: inline-block;
                border-radius: 20px;
                cursor: pointer;
                font-size: 13px;
                color: #333333;
                transition: 0.2s;

                &.active {
                  color: #ffffff;
                  background: #409eff;
                }

                &:hover {
                  color: #ffffff;
                  background: #409eff;
                }
              }
            }
          }
        }
      }
    }
  }

  #pagination {
    margin: 10px;
    height: 45px;
    text-align: right;

    .subscribe {
      color: #999999;
    }

    .btn {
      line-height: 40px;
    }

    .history-price-btn {
      position: relative;
      margin-left: 50px;

      img {
        height: 16px;
        width: 16px;
        position: absolute;
        top: 10px;
        left: -20px;
      }
    }
  }

  #pagination2 {
    text-align: right;
    margin: 10px;
  }

  #currency-table {
    .operate-items {
      li {
        display: inline-block;
        cursor: pointer;

        img {
          padding: 0 5px;
          width: 15px;
          height: 15px;
        }
      }
    }

    .currency-logo {
      width: 20px;
      height: 20px;
      vertical-align: text-bottom;
      margin-right: 5px;
    }
  }

  .custom-filter-range {
    p {
      margin-left: 10px;
    }

    .input-with-select {
      margin: 10px 0;
    }

    .el-select {
      .el-input {
        width: 130px;
      }
    }
  }

  .tags-group {
    .el-checkbox {
      margin-left: 30px;
      min-width: 180px;
      white-space: nowrap;
      overflow: hidden;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
    }
  }

  .el-dropdown {
    color: rgb(255, 255, 255);
    cursor: pointer;
  }
}
</style>

