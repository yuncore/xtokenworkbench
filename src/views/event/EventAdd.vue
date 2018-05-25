<template>
    <div>
        <el-dialog title="" :visible.sync="richEditorOpened" fullscreen="true">
            <RichEditor ref="editor" @done="closeEditor($event)"></RichEditor>
        </el-dialog>
        <div class="container">
            <div class="card price" style="border-radius: 10px; overflow: auto; height: 680px;padding: 50px; margin: 0">
                <div style="width: 75%; float: left;">
                    <p class="paramA" style="margin-top: 0px;float: left">类型</p>
                    <br>
                    <el-select v-model="value" placeholder="选择事件类型" style="margin-top: 15px; border-radius:12px; clear: both">
                        <el-option key="0" label="ICO" value="ICO"></el-option>
                        <el-option key="1" label="大事件" value="Comments"></el-option>
                    </el-select>
                    <p class="paramA">标题</p>
                    <el-input class="paramB" placeholder="填写事件标题" v-model.trim="title" style=" border-radius:12px;"></el-input>
                    <p class="paramA">内容</p>
                    <div @click="showEditor" v-html="intro"
                         style="height: 160px; width: 100%; border-radius: 4px; margin-top: 15px; border:1px solid #E8E8E8 !important; overflow: auto;padding: 10px;">
                    </div>
                    <br>
                    <p class="paramA" style="float: left">关联项目</p>
                    <div class="coin-search">
                        <el-autocomplete
                            v-model="coinSearchContent"
                            :fetch-suggestions="coinSearch"
                            @select="handleCoinSelect"
                            class="inline-input"
                            size="small"
                            valueKey="name"
                            placeholder="请输入关键字">
                            <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-autocomplete>
                    </div>
                    <div style="clear: both"></div>
                    <ul class="coin-select" v-if="selectedCurrencyList.length !== 0">
                        <li v-for="(item, index) in selectedCurrencyList" :key="index">
                            <img :src="'static/img/coinLogos/'+ item.id + '.png'">
                            <p>{{item['name']}}</p>
                            <p>{{item['symbol']}}</p>
                            <i class="el-icon-close" @click="removeCoin(index)"></i>
                        </li>
                    </ul>
                    <div v-else class="tip">
                        请选择关联项目
                    </div>
                </div>
                <div style="height: 100%; width: 5%; float: left; text-align: center">
                    <center style="height: 100%">
                        <div class="ballA" style=""></div>
                        <div style="width:1px; height: calc(100% - 20px); background-color: #E8E8E8;"></div>
                        <div class="ballA"
                             style="width: 10px; height: 10px; border-radius: 50%; background-color: #D0D0D0;"></div>
                    </center>
                </div>
                <div style="height: 100%; width: 20%; float: left; text-align: left;">
                    <i class="el-icon-setting" style="font-size: 25px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;权限设置</i>
                    <template>
                        <el-checkbox v-model="checkbox1" label="1"
                                     style="display: block; font-size: 26px; margin-top: 10%;">让用户判断是真是假
                        </el-checkbox>
                        <el-checkbox v-model="checkbox2" label="2"
                                     style="display: block; margin-left: 0px; margin-top: 10%;">让用户看涨看跌
                        </el-checkbox>
                    </template>
                    <br>
                    <i class="el-icon-setting" style="font-size: 25px; margin-top: 15%;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;投票设置</i>
                    <br>
                    <el-date-picker
                        v-model="dateTimeA"
                        style="margin-left: 0px; width: 300px; margin-top: 50px;"
                        type="datetime"
                        placeholder="投票开始时间">
                    </el-date-picker>
                    <el-date-picker
                        v-model="dateTimeB"
                        style="margin-left: 0px; width: 300px; margin-top: 30px;"
                        type="datetime"
                        placeholder="投票结束时间">
                    </el-date-picker>
                    <el-button @click="up"
                               style="margin-top: 20%; background:#38435b; border:1px solid #979797; border-radius:43px; font-size: 1em; color: white;">
                        确认添加
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import net_util from '../../assets/js/net_utils'
    import config from '../../assets/js/config'
    import utils from '../../assets/js/utils'
    import consts from '../../assets/js/consts'
    import RichEditor from '../../components/editor/Editor.vue'

    export default {
        data: function () {
            return {
                title: '',
                value: '',
                checkList: [],
                coinSearchContent: '',
                selectedCurrencyList: [],
                checkbox1: false,
                checkbox2: false,
                intro: null,
                //富文本信息编辑器状态
                richEditorOpened: false,
                dateTimeA: '',
                dateTimeB: ''
            }
        },
        methods: {
            coinSearch(value, cb){
                let url = config.PYTHONBASEDOMAIN + '/currency/search'
                let succ = res => {
                    cb(res.data)
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || '未知错误'})
                }
                net_util.getRequest(url, {keyword: value}, succ, fail)
            },
            handleCoinSelect(coin){
                let seleted = this.selectedCurrencyList.find(item => {
                    return item.id === coin.id
                })
                if(seleted === undefined){
                    this.coinSearchContent = ''
                    if(this.selectedCurrencyList.length >= 5){
                        this.$message({type: 'warning', message: '最多关联五个项目'})
                    }else{
                        this.selectedCurrencyList.push(coin)
                    }
                }
            },
            removeCoin(index){
                this.selectedCurrencyList.splice(index, 1)
            },
            tijiao (tt) {
                var self = this
                var url = config.JAVABASEDOMAIN + '/event/add'
                var data = {
                    type: this.value,
                    title: this.title,
                    urlPath: tt,
                    trueFalse: this.checkbox1 ? 1 : 0,
                    roseFall: this.checkbox2 ? 1 : 0,
                    voteStartTime: this.dateTimeA.getTime(),
                    voteEndTime: this.dateTimeB.getTime()
                }
                data.proList = this.selectedCurrencyList.map(item =>{
                    return item['id']
                })
                var succ = function success (data) {
                    if (data.errorCode == 0) {
                        self.$message({type: 'success', message: '已提交！'})
                    } else {
                        self.$message({type: 'error', message: '提交出现异常！'})
                    }
                }
                var fail = function error (data) {
                    self.$message({type: 'error', message: data.errorMsg})
                }
                net_util.postRequest(url, data, succ, fail, this)
            },
            up () {
                if (!this.checkParams()) {
                    return
                }
                var self = this
                var url = config.JAVABASEDOMAIN + '/upload/file/txt'
                var data = {
                    textType: 'txt',
                    content: this.intro
                }
                var succ = function success (data) {
                    if(data.errorCode === 0){
                        self.tijiao(data.result)
                    }else{
                        self.$message({type: 'error', message: '上传事件内容出错'})
                    }
                }
                var fail = function error (data) {
                    self.$message({type: 'error', message: '上传事件内容出错'})
                }
                net_util.postRequest(url, data, succ, fail, this)
            },
            checkParams () {
                let msg = ''
                if (this.type === '') {
                    msg = '请选择事件类型'
                } else if (this.title === '') {
                    msg = '请填写title'
                } else if (this.intro === null) {
                    msg = '请填写事件内容'
                } else if (this.checkbox1 === false && this.checkbox2 === false) {
                    msg = '请选择权限'
                } else if (this.dateTimeA === '' || this.dateTimeB === '') {
                    msg = '请选择开始时间或结束时间'
                } else if (this.selectedCurrencyList.length ===0 ){
                    msg = '请选择关联项目'
                }
                if(msg !== ''){
                    this.$message({type: 'warning', message: msg})
                    return false
                }
                return true
            },
            //打开富文本编辑器
            showEditor () {
                this.richEditorOpened = true
                this.$nextTick(() => {
                    this.$refs.editor.setContent(this.intro)
                })
                setInterval(function () {
                    $(' #edit-container .editor-tool li ').css('width', 'auto')
                }, 300)
            },
            //关闭富文本编辑器
            closeEditor (evt) {
                this.intro = evt.content
                this.richEditorOpened = false
            },
        },
        mounted () {
        },
        components: {
            RichEditor
        },
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../static/css/base.styl"

    .paramA {
        font-family: AvenirNext-Bold;
        font-size: 12px;
        color: #4a4a4a;
        font-weight: bold;
        width: 100px;
        margin-top: 35px;
        clear: both
    }

    .paramB {
        width: 100%;
        border-radius: 12px;
        height: 40px;
        margin-top: 15px;
    }

    .el-input__inner {
        border-radius: 12px !important;
        background: #F6F6F6;
        border-radius: 12px;
    }

    .el-textarea__inner {
        background-color: #F6F6F6;
        border-radius: 12px;
        height: 160px !important;
        border: 1px solid #E8E8E8 !important;
    }

    .fengeXian {
        width: 100%;
        height: 10px;
        clear: both;
        border-bottom: 1px #E8E8E8 solid;
        float: left
    }

    .el-checkbox__input {
        display: block !important;
        position: absolute;
        bottom: 0px;
        left: 49%;
    }

    .ballA {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #D0D0D0;
        border: 1px solid #979797;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #38435B;
    }

    .el-checkbox__input.is-checked .el-checkbox__label {
        background-color: #38435B;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
        font-weight: bold;
        color: black
    }

    .el-checkbox__inner {
        width: 20px;
        height: 20px;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner::after {
        width: 7px;
        height: 10px;
    }

    .coin-search{
        display: inline-block;
        float: right;
        margin-top: 30px;
    }

    .coin-select li{
        position: relative;
        text-align: center;
        display: inline-block;
        width: 150px;
        height: 150px;
        border: 1px solid #ebebeb;
        border-radius: 3px;
        transition: .2s;
        margin-left: 20px;
    }

    .coin-select li:first-child{
        margin-left: 0;
    }

    .coin-select li img{
        height: 42px;
        width: 42px;
        margin: 16px auto;
    }

    .coin-select li p{
        color: #409EFF;
        font-size:14px;
        line-height: 25px;
    }

    .coin-select i{
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 20px;
        cursor: pointer;
    }

    .coin-select i:hover{
        color: #409EFF;
    }

    .tip{
        margin: 20px 0;
        font-size: 14px;
        color: #909399;
    }

</style>
