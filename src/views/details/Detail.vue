<template>
    <div class="pin-container">
        <div class="top cf">
            <div class="container">
                <div class="name">
                    <img :src="`static/img/coinLogos/${id}.png`">
                    <span>{{name}}</span>
                </div>
                <div class="right subscribe">
                    <img :src="subscribeCurrencyList.indexOf(id) > -1 ?'static/img/star_active.png' : 'static/img/star_not_active.png'"
                         @click="subscribeImgClick">
                </div>
            </div>
        </div>
        <div id="currency-detail" class="container">
            <div class="content cf">
                <div class="left side-bar">
                    <ul class="right side-nav nav-pinned">
                        <li v-for="(item1, index1) in MENUITEMS"
                            :key="index1"
                            class="menu-item level1">
                            <div v-if="item1.children && item1.children.length > 0"
                                 class="nav-title"
                                 :class="{active_submenu: item1.children.findIndex(v => v.routeName === routeName) > -1}"
                                 @click="item1.expand = !item1.expand">
                                {{item1.text}}
                                <i class="right-icon"
                                   :class="item1.expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                            </div>
                            <router-link v-else
                                         :to="{name: item1.routeName, query: $route.query}"
                                         class="nav-title"
                                         :class="{active: routeName === item1.routeName}">
                                {{item1.text}}
                            </router-link>
                            <el-collapse-transition>
                                <ul v-if="item1.children && item1.children.length > 0 && item1.expand">
                                    <li v-for="(item2, index2) in item1.children"
                                        class="menu-item level2"
                                        :key="index2">
                                        <router-link :to="{name: item2.routeName, query: $route.query}"
                                                     :class="{active: routeName === item2.routeName}">
                                            <img class="logo" :src="item2.img">
                                            {{item2.text}}
                                        </router-link>
                                    </li>
                                </ul>
                            </el-collapse-transition>
                        </li>
                    </ul>
                </div>
                <div class="detail-wrap">
                    <transition mode="out-in" name="el-zoom-in-top">
                        <router-view />
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import net_util from "../../assets/js/net_utils";
import config from "../../assets/js/config";

const MENUITEMS = [
  {
    text: "Overview",
    routeName: "currency_overview"
  },
  {
    text: "Charts",
    routeName: "currency_charts"
  },
  {
    text: "Related",
    expand: true,
    children: [
      {
        text: "Github",
        routeName: "currency_github",
        img: "static/img/detail_left_github.svg"
      },
      {
        text: "Reddit",
        routeName: "currency_reddit",
        img: "static/img/detail_left_reddit.svg"
      },
      {
        text: "Bitcointalk",
        routeName: "currency_bitcointalk",
        img: "static/img/detail_left_btt.svg"
      },
      {
        text: "Event",
        routeName: "currency_event",
        img: "static/img/detail_left_btt.svg"
      },
      {
        text: "Other",
        routeName: "currency_other",
        img: "static/img/detail_left_other.svg"
      }
    ]
  }
];

export default {
  name: "Detail",
  data() {
    return {
      id: this.$route.query.id,
      name: this.$route.query.name,
      MENUITEMS,
      subscribeCurrencyList: []
    };
  },
  computed: {
    routeName() {
      return this.$route.name;
    },
  },
  methods: {
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
          this.$message({ type: "error", message: this.$t("error") });
        }
      };
      let fail = res => {};
      net_util.getRequest(url, {}, succ, fail);
    },
    subscribeImgClick() {
      if (this.subscribeCurrencyList.indexOf(this.id) > -1) {
        this.$alert(`Are you sure to unfollow ${this.name}?`, "unfollow", {
          confirmButtonText: "confirm"
        }).then(() => {
          this.unSubscribeCurrency(this.id);
        });
      } else {
        this.$alert(`Are you sure to follow ${this.name}?`, "follow", {
          confirmButtonText: "confirm"
        }).then(() => {
          this.subscribeCurrency(this.id);
        });
      }
    },
    subscribeCurrency(id) {
      let url = config.JAVABASEDOMAIN + "/subscribe/add";
      let data = { currencyId: id };
      let succ = res => {
        if (!res.errorMsg) {
          this.getSubscribeCurrencyList();
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
    // 请求取消订阅货币接口
    unSubscribeCurrency(id) {
      let url = config.JAVABASEDOMAIN + "/subscribe/remove";
      let data = { currencyId: id };
      let succ = res => {
        if (!res.errorMsg) {
          this.getSubscribeCurrencyList();
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
  },
  mounted() {
    this.getSubscribeCurrencyList()
  },
  beforeRouteEnter (to, from, next){
    if(!to.query.name){
      let id = to.query.id;
      let p = new Promise((resolve, reject) => {
        let url = config.PYTHONBASEDOMAIN + '/currency'
        let data = {
          ids: JSON.stringify([id])
        };
        let succ = res => {
          resolve(res);
        };
        net_util.getRequest(url, data, succ, reject)
      });
      p.then(res => {
        if(res && res.length > 0){
          to.query.name = res[0]["name"]
        }
        console.log(res)
        next()
      }).catch(e => {
        console.log(e)
        next()
      })
    }else{
      next()
    };
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../static/css/base.styl';

.top {
    padding: 0 50px;
    height: 50px;
    position: fixed;
    top: 60px;
    background: #FFFFFF;
    z-index: 998;
    width: 100% !important;
    box-sizing: border-box;
    border-bottom: 1px solid #eeeeee;

    .name {
        display: inline-block;

        span {
            font-size: 22px;
            line-height: 50px;
            font-weight: normal;
        }

        img {
            width: 20px;
            height: 20px;
        }
    }

    .subscribe {
        line-height: 50px;
        display: inline-block;

        img {
            cursor: pointer;
            width: 15px;
            height: 15px;
            vertical-align: middle;
        }
    }
}

#currency-detail {
    padding: 0;
    margin-top: 40px;

    .content {
        .side-bar {
            width: 160px;
            text-align: right;
            position: fixed;

            .side-nav {
                width: 160px;
                border: 1px solid #eeeeee;
                border-radius: 5px;
                background: #FFFFFF;

                .menu-item {
                    position: relative;
                    text-align: left;
                    color: #999999;
                    cursor: pointer;
                    font-size: 13px;
                    border-bottom: 1px solid #EEEEEE;

                    &:last-child {
                        border-bottom: none;
                    }

                    .active {
                        background-color: rgba(64, 158, 255, 0.06);
                        border-right: 3px solid #409eff;
                        color: #333333;

                        .logo {
                            opacity: 1;
                        }
                    }

                    .active_submenu {
                        font-weight: 600;
                        color: #333333;
                    }

                    a {
                        display: block;
                        color: #999999;
                    }
                }

                .nav-title {
                    padding: 0 16px;
                }

                .right-icon {
                    line-height: 45px;
                    float: right;
                }

                .level1 {
                    line-height: 45px;
                }

                .level2 {
                    line-height: 38px;
                    border-bottom: none;

                    a {
                        padding-left: 32px;
                    }

                    .logo {
                        width: 16px;
                        height: 16px;
                        vertical-align: middle;
                        margin-right: 5px;
                        opacity: 0.5;
                    }
                }
            }
        }

        .detail-wrap {
            margin-left: 180px;
            color: #333333;
        }
    }
}
</style>
