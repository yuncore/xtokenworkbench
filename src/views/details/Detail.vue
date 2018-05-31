<template>
    <div style="padding-top: 70px">
        <div id="currency-detail" class="container">
            <div class="top cf top-pinned">
                <div class="left name">
                    <img :src="`static/img/coinLogos/${id}.png`">
                    <span>{{name}}</span>
                </div>
                <div class="right subscribe">
                    <img :src="subscribeCurrencyList.indexOf(id) > -1 ?'static/img/star_active.png' : 'static/img/star_not_active.png'"
                         @click="subscribeImgClick">
                </div>
            </div>
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
                                            <img class="logo" src="static/img/github.png">
                                            {{item2.text}}
                                        </router-link>
                                    </li>
                                </ul>
                            </el-collapse-transition>
                        </li>
                    </ul>
                </div>
                <div class="detail-wrap">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import net_util from '../../assets/js/net_utils'
    import config from '../../assets/js/config'

    const MENUITEMS = [
        {
            text: 'Overview',
            routeName: 'currency_overview',
        },
        {
            text: 'Topic',
            routeName: 'currency_topic',
        },
        {
            text: 'Related',
            expand: false,
            children: [
                {
                    text: 'Github',
                    routeName: 'currency_github'

                },
                {
                    text: 'Reddit',
                    routeName: 'currency_reddit'
                },
                {
                    text: 'Bitcointalk',
                    routeName: 'currency_bitcointalk'

                },
                {
                    text: 'Other',
                    routeName: 'currency_other'

                }
            ]
        },
        {
            text: 'Collector',
            routeName: 'currency_collector',
        },
        {
            text: 'Group',
            routeName: 'currency_group'
        }
    ];

    export default {
        name: "Detail",
        data(){
            return {
                id: this.$route.query.id,
                name: this.$route.query.name,
                MENUITEMS,
                subscribeCurrencyList: []
            }
        },
        computed:{
            routeName(){
                return this.$route.name
            }
        },
        methods: {
            // 请求用户订阅货币的id列表，Java端
            getSubscribeCurrencyList () {
                let url = config.JAVABASEDOMAIN + '/subscribe/list'
                let succ = res => {
                    if (!res.errorMsg) {
                        let list = [];
                        if (res.result.length > 0) {
                            res.result.forEach(item => {
                                list.push(item['currencyId'])
                            })
                        }
                        this.subscribeCurrencyList = list
                    } else {
                        this.$message({type: 'error', message: this.$t('error')})
                    }
                };
                let fail = res => {};
                net_util.getRequest(url, {}, succ, fail)
            },
            subscribeImgClick(){
                if (this.subscribeCurrencyList.indexOf(this.id) > -1) {
                    this.$alert(`Are you sure to unfollow ${this.name}?`, 'unfollow', {
                        confirmButtonText: 'confirm'
                    }).then(() => {
                        this.unSubscribeCurrency(this.id)
                    })
                } else {
                    this.$alert(`Are you sure to follow ${this.name}?`, 'follow', {
                        confirmButtonText: 'confirm'
                    }).then(() => {
                        this.subscribeCurrency(this.id)
                    })
                }
            },
            subscribeCurrency (id) {
                let url = config.JAVABASEDOMAIN + '/subscribe/add';
                let data = {currencyId: id};
                let succ = res => {
                    if (!res.errorMsg) {
                        this.getSubscribeCurrencyList();
                        this.$message({type: 'success', message: this.$t('success')})
                    } else {
                        this.$message({type: 'error', message: this.$t('error')})
                    }
                };
                let fail = res => {
                    this.$message({type: 'error', message: this.$t('error')})
                };
                net_util.getRequest(url, data, succ, fail)
            },
            // 请求取消订阅货币接口
            unSubscribeCurrency (id) {
                let url = config.JAVABASEDOMAIN + '/subscribe/remove';
                let data = {currencyId: id};
                let succ = res => {
                    if (!res.errorMsg) {
                        this.getSubscribeCurrencyList();
                        this.$message({type: 'success', message: this.$t('success')})
                    } else {
                        this.$message({type: 'error', message: this.$t('error')})
                    }
                };
                let fail = res => {
                    this.$message({type: 'error', message: this.$t('error')})
                };
                net_util.getRequest(url, data, succ, fail)
            },
        },
        mounted () {
            $(".top-pinned").pin({padding: {top: 70}, containerSelector: '.container'});
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../static/css/base.styl"

    #currency-detail
        padding 0
        .top
            padding 0 50px
            height 80px
            background #FFFFFF
            z-index 999
            width 100%!important
            box-sizing border-box
            .name
                span
                    font-size 36px
                    line-height 80px
                    font-weight normal
                img
                    width 30px
                    height 30px
            .subscribe
                line-height:80px
                img
                    cursor pointer
                    width 30px
                    height 30px
                    vertical-align middle
        .content
            margin-top 20px
            .side-bar
                width 240px
                text-align right
                .side-nav
                    width 200px
                    border 1px solid #eeeeee
                    border-radius 5px
                    background #FFFFFF
                    .menu-item
                        position relative
                        text-align left
                        color #666666
                        cursor pointer
                        border-bottom 1px solid #EEEEEE
                        &:last-child
                            border-bottom none
                        .active
                            background-color rgba(64,158,255,0.06);
                            border-right 4px solid #409eff
                        .active_submenu
                            font-weight bold
                        a
                            display: block
                            color #666666
                    .nav-title
                        padding 0 25px
                    .right-icon
                        line-height 60px
                        float right
                    .level1
                        line-height 60px
                    .level2
                        line-height 50px
                        border-bottom none
                        a
                            padding-left 40px
                        .logo
                            width 20px
                            height 20px
                            vertical-align middle
                            margin-right 5px
            .detail-wrap
                margin-left 240px
                padding 0 30px
                color #333333

</style>
