<template>
    <div>
        <div class="eventList">
            <div class="qiao" @click="qiaoClick"></div>
            <div id="head">
                <router-link :to="{name: 'currencyList', query: {page: this.$route.query.page}}">
                    <img src="../../../static/img/logo.svg" class="logo">
                </router-link>
            </div>
            <div style=" padding:26px; overflow: auto; margin-top: 100px; background: #fff;">
                <div class="zhuti" style="width: 100%; height: 750px;">
                    <div
                        style="background:#38435b; height:60px; width: calc(100% - 20px); margin:10px 10px; border-radius: 10px; box-shadow: 0 2px 12px 0 #A0A1A2;">
                        <div style="height:20px; width: 100%; font-size: 13px; margin-top: 20px;">
                            <p style="float: left; margin-left: 55px; height: 20px; line-height: 20px; vertical-align: middle; color: white; font-size: 14px; margin-right: 20px;">
                                类型</p>
                            <el-radio v-model="radio" label="">ALL</el-radio>
                            <el-radio v-model="radio" label="ICO">ICO</el-radio>
                            <el-radio v-model="radio" label="Comments">大事件</el-radio>
                        </div>
                    </div>
                    <div style="height:calc(100% - 90px); width:100%; margin-top: 30px;">
                        <div style="float: left; width:66%; max-height:100%;overflow: auto;">
                            <template v-if="listData.length > 0">
                                <div v-for="item in listData"
                                     style="background-color: #FFFFFF; height: 183px; width: calc(100% - 20px); margin:10px 10px; border-radius: 10px; box-shadow: 0 2px 12px 0 #B2B2B2; margin-bottom: 18px;">
                                    <div class="cardleftTopIcon"
                                         :style="{backgroundColor: item.type === 'ICO' ? '#FF7474': '#4A90E2'}"></div>
                                    <div
                                        style="width: calc(100% - 145px); margin-left: 55px; height: 220px; margin-top: -5px;">
                                        <p style="font-family:PingFangSC-Regular; font-size:13px; color:#38435b; letter-spacing:0; height: 17px; line-height: 17px; vertical-align: middle;">
                                            Sandra Burns · {{getDateDiff(item.pusTime)}}</p>
                                        <p style="font-family:PingFangSC-Medium; font-size:22px; color:black; letter-spacing:0; height: 40px; line-height: 40px; vertical-align: middle; font-weight: bold; margin-top: 20px;">
                                            {{radios[item.type]}}）{{item.title}}</p>
                                        <div
                                            style="height: 40px; width: 99%; border-bottom:1px solid #9b9b9b; opacity:0.32;">
                                            &nbsp;
                                        </div>
                                        <div style="width: 100%; height: 20px; margin-top: 15px;">
                                            <p style="font-family:PingFangSC-Medium; font-size:13px; color:#b2b2b2; letter-spacing:0.46px; height: 20px; line-height: 20px; vertical-align: middle; float: left;">
                                                88532 人看过</p>
                                            <button @click="toPageView(item)"
                                                    onmouseover="this.style.backgroundColor='lavender';this.style.color='black';"
                                                    onmouseout="this.style.backgroundColor='#38435B';this.style.color='white';"
                                                    style="border-radius:10px; float: right; height: 20px; width: 100px; border: none; background-color: #38435B; color: white; font-family:PingFangSC-Regular; font-size:13px; letter-spacing:0;">
                                                To view&nbsp;&nbsp;&nbsp;>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <div v-else
                                 style="background-color: #FFFFFF; height: 573px; width: calc(100% - 20px); margin:10px 10px; border-radius: 10px; box-shadow: 0 2px 12px 0 #B2B2B2; margin-bottom: 18px;">
                                <center :style="{marginTop: (windowsHeight-320-172-30)/2 +'px' }">
                                    <p style="opacity:0.24; font-family:HYYaKuHeiW; font-size:44px; color:#5a5a5a; letter-spacing:0; font-weight: bold;">
                                        暂时没有添加事件</p>
                                    <button v-if="isAdmin" @click="toAdd"
                                            onmouseover="this.style.backgroundColor='lavender';this.style.color='black';"
                                            onmouseout="this.style.backgroundColor='#38435B';this.style.color='white';"
                                            style="border-radius:15px; height: 30px; width: 140px; border: none; background-color: #38435B; color: white; font-family:PingFangSC-Regular; font-size:13px; letter-spacing:0; margin-top: 50px;">
                                        去添加事件&nbsp;&nbsp;&nbsp;>
                                    </button>
                                </center>
                            </div>

                        </div>

                        <div style="float: right; width:34%; height: 600px;">
                            <div
                                style="background-color: #FFFFFF; height: calc(100% - 30px); width: calc(100% - 20px); margin:10px 10px; border-radius: 10px; box-shadow: 0 2px 12px 0 #B2B2B2;">
                                <!--<object style="border:0px; height:100%; width: 100%" type="text/x-scriptlet" data="static/html/xx.html"></object>-->
                                <iframe name="riliIframe" style="width: 100%; height:420px;" marginwidth="0"
                                        scrolling="no" marginheight="0" frameborder="no" border="0"
                                        src="static/html/xx.html">
                                </iframe>

                                <div
                                    style="margin-left: 60px; height: calc(100% - 420px); width: calc(100% - 120px); border-top: 1px solid #DFDFDF; padding-top: 40px;">
                                    <img style="width: 18px; height: 12px; float: left;"
                                         :src="'static/img/' + radioIcons[radio] + '.png'"/>
                                    <p style="font-family:PingFangSC-Medium;font-size:14px;color:#38435b;letter-spacing:0; float: left; margin-left: 20px; margin-top: -2px;">
                                        <b>{{radios[radio]}}</b>）&nbsp;&nbsp;{{listData.length}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    import base64 from '../../assets/js/base64'
    import net_util from '../../assets/js/net_utils'
    import config from '../../assets/js/config'
    import utils from '../../assets/js/utils'
    import consts from '../../assets/js/consts'
    import RichEditor from '../../components/editor/Editor.vue'

    export default {
        data: function () {
            return {
                //是否为管理员
                isAdmin: sessionStorage.getItem('admin'),
                listData: [],
                windowsHeight: $(window).height(),
                radio: '',
                radios: {
                    '': '事件总数',
                    'ICO': 'ICO发布',
                    'Comments': '大事件'
                },
                radioIcons: {
                    '': 'icon4',
                    'ICO': 'icon2',
                    'Comments': 'icon3'
                }
            }
        },
        watch: {
            radio (val) {
                this.getListData(this.getNYR(), this.radio)
            },
        },
        methods: {
            getListData (pdate, ptype) {
                var self = this
                var url = config.JAVABASEDOMAIN + '/event/site/list'
                var data = {
                    date: pdate
                }
                if (ptype != null && ptype != '') {
                    data.type = ptype
                }
                var succ = function success (data) {
                    if (!data.errorMsg) {
                        self.listData = data.result
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                var fail = function error (data) {
                    self.$meesage({type: 'error', message: '连接失败'})
                }
                net_util.getRequest(url, data, succ, fail, this)
            },
            qiaoClick () {
                this.getListData(this.getNYR(), this.radio)
            },
            addZero (str) {
                if ((str + '').length == 1)
                    return '0' + str
                else
                    return str
            },
            getHtml (url) {
                $.ajaxSetup({
                    async: false //取消异步
                })
                $.get('http://jsrelease-file.yunmaster.cn/store/doc/' + url, function (result) {
                    //alert(result)
                    return result
                })
            },
            getNYR () {
                var strA = window.frames['riliIframe'].document.getElementById('selectYear').value
                var strB = window.frames['riliIframe'].document.getElementById('selectMonth').value
                var strC = window.frames['riliIframe'].document.getElementById('selectDay').value
                return strA + '-' + this.addZero(strB * 1 + 1) + '-' + this.addZero(strC)
            },
            getDateDiff (dateTimeStamp) {
                var result = null
                var minute = 1000 * 60
                var hour = minute * 60
                var day = hour * 24
                var halfamonth = day * 15
                var month = day * 30
                var now = new Date().getTime()
                var diffValue = now - dateTimeStamp
                if (diffValue < 0) {return}
                var monthC = diffValue / month
                var weekC = diffValue / (7 * day)
                var dayC = diffValue / day
                var hourC = diffValue / hour
                var minC = diffValue / minute
                if (monthC >= 1) {
                    result = '' + parseInt(monthC) + '月前'
                }
                else if (weekC >= 1) {
                    result = '' + parseInt(weekC) + '周前'
                }
                else if (dayC >= 1) {
                    result = '' + parseInt(dayC) + '天前'
                }
                else if (hourC >= 1) {
                    result = '' + parseInt(hourC) + '小时前'
                }
                else if (minC >= 1) {
                    result = '' + parseInt(minC) + '分钟前'
                } else
                    result = '刚刚'
                return result
            },
            toAdd () {
                this.$router.push('/event/add')
            },
            toPageView (item) {
                this.$router.push({path: '/event/detail', query: {id: item.id}})
            }
        },
        mounted () {
            this.getListData(new Date().Format('yyyy-MM-dd'), this.radio)
        },
        components: {},
    }

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds(), //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            'S': this.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        return fmt
    }
</script>
<style>
    .eventList * {
        overflow: hidden;
        margin: 0px;
        padding: 0px;
    }

    .eventList button, a {
        cursor: pointer;
    }

    .cardleftTopIcon {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background-color: #4A90E2;
        margin-left: -22px;
        margin-top: -32px;
        display: block;
    }

    .el-radio__inner {
        width: 20px;
        height: 20px;
        margin-left: 20px;
        background-color: #38435B;
        border: none;
    }

    .el-radio__label {
        color: #b2b2b2;
        height: 20px;
        line-height: 18px;
        margin-left: 13px;
    }

    .el-radio__input.is-checked + .el-radio__label {
        color: white;
        font-weight: bold;
    }

</style>
