<template>
  <div id="currency-overview">
    <el-row class="market-part">
      <el-col style="width: 260px">
        <div class="card market-card cap">
          <div class="icon">
            <img src="../../../../static/img/market_cap.svg">
          </div>
          <div class="instruction">
            <span>
              {{customerParseFloat(currencyPrice['market_cap_usd'], '$')}}
              <br/>
              <em>Market Cap</em>
            </span>
          </div>
        </div>
      </el-col>
      <el-col style="width: 260px; margin-left: 20px">
        <div class="card market-card volume">
          <div class="icon">
            <img src="../../../../static/img/volumn.svg">
          </div>
          <div class="instruction">
            <span>
              {{customerParseFloat(currencyPrice['24h_volume_usd'], '$')}}
              <br/>
              <em>Volume(24H)</em>
            </span>
          </div>
        </div>
      </el-col>
      <el-col style="width: 260px; margin-left: 20px">
        <div class="card market-card volume">
          <div class="icon">
            <img src="../../../../static/img/supply.svg">
          </div>
          <div class="instruction">
            <span>
              {{customerParseFloat(currencyPrice['available_supply'])}}
              <br/>
              <em>Available</em>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="basic-part">
      <el-col style="width: 275px">
        <div class="card basic-card info">
          <div class="raise-info">
            <p class="label">Project Info</p>
            <p class="name">{{currencyPrice.name}}
              <em>{{` (${currencyPrice.symbol})`}}</em>
            </p>
            <div class="raise-detail" v-if="currencyAdditionInfo_myToken">
              <p>
                <span class="label">ICO Date </span>{{currencyAdditionInfo_myToken.ico_date_display || '- -'}}</p>
              <p>
                <span class="label">ICO Price </span>{{currencyAdditionInfo_myToken.exchange_rate_display || '- -'}}</p>
              <p>
                <span class="label">ICO Amount </span>{{currencyAdditionInfo_myToken.raised_amount_display || '- -'}}</p>
            </div>
            <div v-else>
              Temporarily no data
            </div>
          </div>
          <div class="related-links">
            <p class="label">links</p>
            <div class="link-item">
              <!-- <a v-for="(link,index) in sortedLink" :key="index" :href="link.v" target="_blank">{{link.k}}</a> -->
              <a target="_blank" :href="descAndLink.link.website || 'javascript: void(0)'" :class="{disable: descAndLink.link.website ? false : true}">
                <img src="../../../../static/img/website2.png">
              </a>
              <a target="_blank" :href="descAndLink.link.github || 'javascript: void(0)'" :class="{disable: descAndLink.link.github ? false : true}">
                <img src="../../../../static/img/github_2.svg">
              </a>
              <a target="_blank" :href="descAndLink.link.reddit || 'javascript: void(0)'" :class="{disable: descAndLink.link.reddit ? false : true}">
                <img src="../../../../static/img/reddit_2.svg">
              </a>
            </div>
          </div>
        </div>
      </el-col>
      <el-col style="width: 275px; margin-left: 20px">
        <div class="card basic-card trend">
          <div class="top-wrap">
            <el-button @click="contrastButtonClick" type="primary" size="mini" class="right predict" round>
              Contrast
            </el-button>
            <p class="label">Trend</p>
            <p class="price">{{customerParseFloat(currencyPrice['price_usd'], '$')}}</p>
            <p v-if="currencyPrice.percent_change_24h" class="change">
              <span :style="{color: currencyPrice['percent_change_24h'] < 0 ? '#d14836' : '#019933'}">
                {{`${currencyPrice['percent_change_24h']}(24H)`}}
              </span>
            </p>
          </div>
          <div class="charts" ref="priceTrend">
          </div>
        </div>
      </el-col>
      <el-col style="width: 230px; margin-left: 20px">
        <div class="card basic-card tool">
          <a @click="predictButtonClick" class="price-contrast-button">
            <img src="../../../../static/img/detail_price_contrast.svg"> Predict
          </a>
          <div class="tags">
            <ul class="tag-title">
              <li :class="{active: tagsOrGroup === 1}" @click="tagsOrGroup = 1" class="label">
                Tags
              </li>
              <li :class="{active: tagsOrGroup === 2}" @click="tagsOrGroup = 2" class="label">
                Group
              </li>
            </ul>
            <ul v-show="tagsOrGroup === 1" class="tag-content">
              <li v-for="(item, index) in tags" :key="index">
                {{item.tag_name}}
              </li>
            </ul>
            <ul v-show="tagsOrGroup === 2" class="tag-content">
              <li v-for="(item, index) in groups" :key="index">
                {{item.name}}
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="card intro-part">
      <p class="label">Introduce</p>
      <div class="content" v-if="descAndLink && descAndLink.description" v-html="descAndLink.description">
      </div>
    </div>
    <el-dialog :title="$t('page.currencyList.t2') + ':'" width="50%" :visible.sync="collectorDiaVisible">
      <el-input-number min="1" max="10000" :controls="false" v-model.trim="expectRank" :placeholder="$t('page.currencyList.ph4')">
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
</template>

<script>
import net_util from "../../../assets/js/net_utils";
import config from "../../../assets/js/config";
import utils from "../../../assets/js/utils";
import echarts from "echarts"

export default {
  name: "overview",
  data() {
    return {
      id: this.$route.query.id,
      name: this.$route.query.name,
      tags: "",
      groups: "",
      currencyPrice: "",
      historyPrice: "",
      oneDayPrice: "",
      currencyAdditionInfo_myToken: "",
      //点收集器
      collectorDiaVisible: false,
      predictCurrencyId: "",
      expectRank: 0,
      smsAlert: false,
      tagsOrGroup: 1,
      descAndLink: '',
    };
  },
  computed: {
    sortedLink: function(){
      if(this.descAndLink && this.descAndLink.link){
        let linkObj = this.descAndLink.link
        let newLinks = []
        let keyRank = ['Website', 'Reddit', 'Github', 'Announcement']
        for(let k of keyRank){
          newLinks.push({k: k, v: linkObj[k]})
        }
        for(let k in linkObj){
          if(!(k in keyRank)){
            newLinks.push({k: k, v: linkObj[k]})
          }
        }
        return newLinks
      }else{
        return []
      }
    }
  },
  methods: {
    init() {
      this.getCurrencyPrice()
        .then(() => {
          this.getDescAndLinks(this.currencyPrice['symbol']);
          this.getCurrencyTags();
          this.getAdditionalInfo();
          this.getGroupByCurrencyId();
        })
        .then(() => {
          this.drawPriceChart();
        })
        .then(() => {
          console.log("complete");
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 获取货币的描述和网站链接
    getDescAndLinks(sym){
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + '/currency/link'
        let data = {
          symbol: sym
        }
        let succ = res => {
          this.descAndLink = res
          resolve()
        }
        net_util.getRequest(url, data, succ, reject)
      })
    },
    // 获取货币的价格信息
    getCurrencyPrice() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/currency/price`;
        let data = {
          id: this.id,
          history: true
        };
        let succ = res => {
          this.currencyPrice = res["current_price"][0];
          this.historyPrice = res["history_price"]["data"];
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    //获取和货币相关的额外信息
    getAdditionalInfo() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + `/currency/addition/info`;
        let data = {
          name: this.currencyPrice["name"]
        };
        let succ = res => {
          if (res.mytoken) {
            this.currencyAdditionInfo_myToken = res["mytoken"];
          }
          resolve();
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    getCurrencyTags() {
      return new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + "/currency/tags/relation";
        let data = {
          currency_id: this.id
        };
        let succ = res => {
          this.tags = res;
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    // 绘制30天内货币历史价格图
    drawPriceChart(ahead = 30) {
      let myChart = echarts.init(this.$refs.priceTrend);
      myChart.clear();
      let history_price_all = JSON.parse(this.historyPrice);
      let cutoff = new Date() - ahead * 24 * 3600 * 1000;
      let used_price = history_price_all["price_usd"].filter(
        item => item[0] > cutoff
      );
      let price_usd = [];
      let time_data_usd = [];
      used_price.forEach(item => {
        let t = this.getGMT8Time(item[0]);
        let long_t = t.getTime();
        if (!(time_data_usd.indexOf(long_t) > -1)) {
          time_data_usd.push(long_t);
          price_usd.push({
            name: t,
            value: [this.getSmpFormatDateByLong(t.getTime()), item[1]]
          });
        }
      });
      myChart.setOption({
        color: ["#409eff"],
        tooltip: {
          trigger: "axis"
        },
        grid: {
          x: "0%",
          y: "50%",
          x2: "0%",
          y2: "0%"
        },
        xAxis: [
          {
            show: false,
            type: "time",
            splitLine: {
              show: false
            },
            min: "dataMin",
            max: "dataMax",
            axisPointer: {
              z: 100
            }
          }
        ],
        yAxis: [
          {
            show: false,
            type: "value",
            name: "price_usd",
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "price_usd",
            type: "line",
            data: price_usd,
            showSymbol: false,
            smooth: true,
            lineStyle: {
              normal: {
                width: 3
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#409eff"
                  },
                  {
                    offset: 1,
                    color: "#eaf4ff"
                  }
                ])
              }
            }
          }
        ]
      });
    },
    // 点击预测排名按钮回调
    predictButtonClick() {
      this.expectRank = this.currencyPrice.rank;
      this.predictCurrencyId = this.id;
      this.collectorDiaVisible = true;
    },
    // 点击价格对比按钮的回掉
    contrastButtonClick(){
      this.$router.push({name: 'price_contrast', query: {id: this.id}})
    },
    // 前往排行榜列表
    toRankView() {
      this.$router.push({ name: "predict" });
      this.collectorDiaVisible = false;
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
          this.$message({ type: "success", message: this.$t("success") });
          this.collectorDiaVisible = false;
        } else {
          this.$message({ type: "error", message: res.errorMsg });
        }
      };
      let fail = res => {
        this.$message({ type: "error", message: this.$t("error") });
      };
      net_util.getRequest(url, data, succ, fail);
    },
    // 根据货币id获取该货币的所处分组
    getGroupByCurrencyId() {
      return new Promise((resolve, reject) => {
        let url = config.JAVABASEDOMAIN + `/pros/group/cy/list`;
        let data = {
          currency: this.id
        };
        let succ = res => {
          if (!res.errorMsg) {
            this.groups = res.result;
          } else {
            reject();
          }
        };
        net_util.getRequest(url, data, succ, reject);
      });
    },
    getGMT8Time(t) {
      let d = new Date(t);
      d.setHours(8);
      d.setMinutes(0);
      d.setSeconds(0);
      return d;
    },
    customerParseFloat: utils.customerParseFloat,
    getSmpFormatDateByLong: utils.getSmpFormatDateByLong
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.card
  background #FFF

.basic-part
  height 300px
  margin-left 0 !important
  margin-right 0 !important
  margin-top 20px

  .info
    background none !important
    padding 0 !important

    .raise-info
      background #FFF
      height 160px
      box-sizing border-box
      padding 13px 16px
      position relative

      .raise-detail
        position absolute
        font-size 13px
        bottom 10px

        .label
          line-height 20px

    .related-links
      box-sizing border-box
      background #FFF
      padding 13px 16px
      height 110px
      margin-top 30px
      font-size 14px

      .link-item
        display block
        margin 20px 0

        a
          display inline-block
          color #1c8cff
          margin-right 5px

          &.disable
            opacity .5

          img
            width 25px
            height 25px
            cursor pointer

  .trend
    padding 0 !important

    .top-wrap
      padding 13px 16px

      .predict
        position absolute
        right 20px
        z-index 99

    .price
      font-size 26px
      color #232a3a

    .charts
      top 0
      height 300px
      width 100%
      position absolute

  .tool
    background none !important
    padding 0 !important

    .price-contrast-button
      display block
      line-height 50px
      font-size 14px
      color #FFF
      cursor pointer
      text-align center
      background-image linear-gradient(-179deg, #5ebdf9 0%, #61a1f3 94%)

      &:hover
        opacity 0.8

      img
        width 18px
        height 18px
        transform translateY(-3px)
        vertical-align middle

      a
        color #FFF

    .tags
      margin-top 30px
      height 220px
      box-sizing border-box
      background #FFF

      .tag-title
        font-size 0

        .label
          line-height 30px

        li
          font-size 13px
          display inline-block
          width 50%
          text-align center
          background #eee
          cursor pointer

        .active
          background #FFF
          color #61a1f3

      .tag-content
        padding 0 13px
        font-size 0

        li
          font-size 13px
          padding 5px 10px
          margin-right 10px
          margin-top 10px
          background #ebf5ff
          color #409eff
          display inline-block

  .basic-card
    height 300px
    padding 20px
    background #FFF
    position relative

    .label
      font-size 13px
      line-height 15px
      color #b7c4d4

    .name
      font-size 24px
      margin 5px 0

      em
        font-style normal
        font-size 16px
        color #b7c4d4

.market-part
  margin 0 !important
  height 108px

  .market-card
    height 108px
    padding 0 20px

    .icon
      float left
      line-height 108px
      margin-right 10px

      img
        width 30px
        height 30px
        vertical-align middle

    .instruction
      line-height 108px
      margin-left 30px

      span
        font-family PingFangSC-Regular
        display inline-block
        font-size 18px
        line-height 25px
        vertical-align middle

        em
          font-style normal
          font-size 13px
          color #999999

.intro-part
  margin-top 20px
  padding 20px
  line-height 26px

  .label
    line-height 15px
    font-size 13px
    color #b7c4d4

  .content
    color #333333
    font-size 13px
</style>
