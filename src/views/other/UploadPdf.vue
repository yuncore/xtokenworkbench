<template>
    <div>
        <div class="eventList" style="overflow: auto; height: 100%"><!--:style="{height: windowsHeight+'px'}"-->
            <div style="height: 100px; width:100%; background:#38435b; position: fixed; top: 0; z-index: 999;">
                <router-link to="/index">
                    <img src="../../../static/img/logo.svg" style="margin-left: 30px;margin-top: 36px; cursor: pointer;-webkit-transition: width 0.5s;transition: width 0.5s;">
                </router-link>
            </div>
            <div style=" padding: 40px 50px; overflow: auto; margin-top: 100px"><!--height: calc(100% - 100px);-->
                <div class="zhuti" style="width: 100%; height: 720px;">
                    <div style="background:#38435b; height:60px; width: calc(100% - 20px); margin:10px 10px; border-radius: 10px; box-shadow: 0 2px 12px 0 #A0A1A2;">
                        <div style="height:20px; width: 100%; font-size: 13px; margin-top: 20px;">
                            <p style="float: left; margin-left: 55px; height: 20px; line-height: 20px; vertical-align: middle; color: white; font-size: 14px;">白皮书</p>
                            <p style="float: right; margin-right: 47%; height: 20px; line-height: 20px; vertical-align: middle; color: white; font-size: 16px; font-weight: bold; letter-spacing:10px;">{{currencyId}}</p>
                        </div>
                    </div>
                    <div style="height:calc(100% - 90px); width:100%; margin-top: 30px;">
                            <!--<div style="width: 100%; height: 100px; background-color: red; margin-top: 20px;">
                                <div class="upFileTitle">6</div>
                                <div class="upFileTitle">6</div>
                                <div class="upFileTitle">6</div>
                                <div class="upFileTitle">6</div>
                                <div class="upFileTitle">6</div>
                            </div>-->
                        <div style=" height: 100%; width: 100%;">
                            <div v-for="(item, index) in dataList" :style="{'height': '100%','width':'20%', 'float': 'left'}"> <!--@click="submitA"-->
                                <div style="height: calc(100% - 40px); width: calc(100% - 26px); margin:20px 13px; border-radius: 4px;box-shadow: 0 2px 12px 0 black; float: left; border-radius: 1px; overflow: hidden; background-color: white;">
                                    <div style="height: 450px; width:100%; border: 1px white solid; border-bottom-color: black;">
                                      <div :class="'pdfIn' + index" style="width:calc(100% + 11px); height:calc(100% + 11px); background-color: white;"></div>
                                    </div>
                                    <div style="height: 60px; line-height: 60px; vertical-align: middle; margin-left: 30px; float: left; color: #38435B; margin-top: 10px">{{item.name}}</div>
                                    <button @click="showPdf(item.source)" :disabled="!(item.source != '' && item.source != null)" onmouseover="this.style.backgroundColor='lavender';this.style.color='black';" onmouseout="this.style.backgroundColor='#999999';this.style.color='white';"
                                            style="float: right; margin-right: 30px; border-radius:15px; height: 20px; width: 70px; border: none; background-color: #999999; color: white; font-family:PingFangSC-Regular; font-size:13px; letter-spacing:0; margin-top: 30px;">放大查看</button>
                                    <div style="clear: both; display: block; background-color: white;">
                                        <p style="color: #999999; float: left; margin-left: 30px; margin-top: 10px;" >{{getTimeForLong(item.time)}}</p>
                                        <button @click="submitA(item)" onmouseover="this.style.backgroundColor='lavender';this.style.color='black';" onmouseout="this.style.backgroundColor='#38435B';this.style.color='white';"
                                                style="float: right; margin-right: 30px; border-radius:15px; height: 20px; width: 70px; border: none; background-color: #38435B; color: white; font-family:PingFangSC-Regular; font-size:13px; letter-spacing:0; margin-top: 8px;">上传文件</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <div hidden="hidden">
                <form id="uploadFormA">
                    <input id="fileA" type="file" name="file"
                           onChange="if(!/(\.*.pdf)/.test(this.value)){alert('仅支持pdf格式的文件！'); $('#uploadForm #oid').val('') } else {$('#fileSubmitA').click();}"/>
                    <input type="hidden" value="flow" name="textType"/>
                    <input type="hidden" value="" name="content"/>
                    <input type="hidden" value="file" name="fileType"/>
                    <input type="hidden" value="pdf" name="suffix"/>
                    <p id="fileSubmitA" @click="fileSubmit"/>
                </form>
            </div>
        </div>

       <!-- <el-dialog :title="strK+'   正在上传'" v-model="dialogK" fullscreen="true"> &lt;!&ndash;size="tiny"&ndash;&gt;

        </el-dialog>-->
        <el-dialog
            :title="strK+'   正在上传'"
            :visible.sync="dialogK"
            width="30%"
            :before-close="handleClose">
            <div class="containerK">
                <div id="barK" style="width:0%;"></div>
            </div>
            <span id="totalK" style="float: left; margin-top: 3px; margin-left: 15px;"></span>
            <div style="height: 20px;">&nbsp;</div>
        </el-dialog>

        <el-dialog
            :title="查看PDF文件"
            :visible.sync="dialogZ"
            fullscreen="true"
            :before-close="handleClose" >

            <div class="pdfBig" style="height: 900px;">

            </div>
        </el-dialog>
    </div>
</template>
<script>
    import net_util from '../../assets/js/net_utils'
    import config from '../../assets/js/config'
    import utils from '../../assets/js/utils'
    import consts from '../../assets/js/consts'
    import RichEditor from '../../components/editor/Editor.vue'
    import { Loading } from 'element-ui';


    export default {
        data: function () {
            return {
                dialogK: false,
                strK: '',

                currencyId: '',
                dataList: [
                    /*{"jpgPrefix":"201801/bitcoin_en","language":"en","name":"tt","saveDir":"201801","source":"201801/xt151540555182510.pdf","time":1515413500521}*/
                ],
                obj: null,

                dialogZ: false
            }
        },
        watch: {

        },
        methods: {
            showPdf(urlEnd){
                this.dialogZ = true;
                setTimeout(function () {
                    PDFObject.embed("http://jsrelease-file.yunmaster.cn/store/doc/" + urlEnd, ".pdfBig");
                }, 360);
            },
            fileSubmit(){
                this.strK = $("#fileA").val()+"   "
                this.dialogK = true;
                this.run();
            },
            fileSubmitNext(){
                var self = this;
                var formData = new FormData(document.querySelector("#uploadFormA"));
                $.ajax({
                    type: "post",
                    url: config.JAVABASEDOMAIN + "/upload/file",
                    data: formData,
                    processData:false,
                    contentType:false,
                    async:false,
                    success:function(res){
                        console.log(JSON.stringify(res))
                        //alert("aa" + JSON.stringify(res))
                        self.runNext(res.responseText);
                    },
                    error:function(err){
                        console.log(JSON.stringify(err))
                        //alert("bb"+JSON.stringify(err));
                        self.runNext(err.responseText);
                    }
                });
            },
            getValue(str){
                return $("input[name="+str +"]").val();
            },
            run(){
                console.log("liuYuting")
                var self = this;
                setTimeout(function(){
                    var bar = document.getElementById("barK");
                    var total = document.getElementById("totalK");
                    bar.style.width=parseInt(bar.style.width) + self.getRandomNum(10, 25) + "%";
                    total.innerHTML = bar.style.width;
                    if(Number(bar.style.width.replace("%","")) >= 75){
                        bar.style.width= "100%";
                        total.innerHTML = "100%";
                        window.clearTimeout(timeout);
                        this.dialogK = false;
                        self.fileSubmitNext();
                        return;
                    }
                    var timeout=window.setTimeout(self.run(),100);
                },500);
            },
            runNext(path){
                var bar = document.getElementById("barK");
                var total = document.getElementById("totalK");
                bar.style.width= "0%";
                total.innerHTML = "0%";
                this.dialogK = false;
                //this.$message({type: 'success', message: '已上传!'});
                var file = document.getElementById("fileA");
                // for IE, Opera, Safari, Chrome
                if (file.outerHTML) {
                    file.outerHTML = file.outerHTML;
                } else { // FF(包括3.5)
                    file.value = "";
                }
                this.eventAddSummit(path);
            },
            eventAddSummit(path){
                var loadingInstance = Loading.service({ fullscreen: true });

                var self = this
                var url = config.JAVABASEDOMAIN + '/book/site/add';
                var data = {
                    currencyId: this.currencyId,
                    name: this.obj.name,
                    source: path,
                    language: this.obj.language
                }
                var succ = function success (data) {
                    loadingInstance.close();
                    //alert("aa"+JSON.stringify(data));
                    if(data.errorCode == 0){
                        self.$message({type: 'success', message: '已上传文件!'});
                        setTimeout(function(){
                            window.location.reload();
                        },1000);
                    } else {
                        self.$message({type: 'error', message: data.errorMsg});
                    }
                }
                var fail = function error (data) {
                    loadingInstance.close();
                    self.$message({type: 'error', message: JSON.stringify(data)});
                    //alert("bb"+JSON.stringify(data));
                }
                console.log(JSON.stringify(data));
                net_util.getRequest(url, data, succ, fail, this);
            },
            getRandomNum(Min,Max){
                var Range = Max - Min;
                var Rand = Math.random();
                return(Min + Math.round(Rand * Range));
            },
            submitA(item){
                this.obj = item;
                $("#fileA").click();
            },
            getListData(id){
                var self = this
                var url = config.JAVABASEDOMAIN + '/book/site/list';
                var data = {
                    currencyId: this.currencyId
                }
                var succ = function success (data) {
                    console.log(JSON.stringify(data))
                    //self.listData = data.result;
                    self.chuliRtnListData(data.result);

                }
                var fail = function error (data) {
                    //alert("bb"+JSON.stringify(data));
                }
                console.log(JSON.stringify(data));
                net_util.getRequest(url, data, succ, fail, this);
            },
            chuliRtnListData(arr){
                var list = [
                    {"jpgPrefix":"","language":"en","name":"英文原版","saveDir":"","source":"","time":null},
                    {"jpgPrefix":"","language":"ch1","name":"中文翻译版（1）","saveDir":"","source":"","time":null},
                    {"jpgPrefix":"","language":"ch2","name":"中文翻译版（2）","saveDir":"","source":"","time":null},
                    {"jpgPrefix":"","language":"ch3","name":"中文翻译版（3）","saveDir":"","source":"","time":null},
                    {"jpgPrefix":"","language":"ch4","name":"中文翻译版（4）","saveDir":"","source":"","time":null},
                ]
                for(var i = 0; i < 5; i++){
                    this.inForfindForKey(list[i].language, arr, list)
                }
                this.dataList = list;

                var self = this;
                setTimeout(function () {
                    for (var i = 0; i < self.dataList.length; i++) {
                        var urnEnd = self.dataList[i].source;
                        if (urnEnd != '' && urnEnd != null && urnEnd != undefined) {
                            PDFObject.embed("http://jsrelease-file.yunmaster.cn/store/doc/" + urnEnd, ".pdfIn" + i);
                        }
                    }
                }, 500);
                //alert(JSON.stringify(this.dataList));
            },
            inForfindForKey(key, arr, list){
                for(var i = 0; i < arr.length; i++){
                    if(arr[i].language == key){
                        for(var j = 0; j < 5; j++){
                            if(list[j].language == arr[i].language){
                                list[j] = arr[i];
                                return;
                            }
                        }
                    }
                }
            },
            getTimeForLong: function (longTime, flag) {
                //alert(longTime)
                if(longTime == '' || longTime == null || longTime == undefined)
                    return "- -"
                else
                    return utils.getSmpFormatDateByLong(longTime, true);
            }
        },
        mounted () {
            this.currencyId = this.$route.query.id
            this.getListData(this.currencyId)
        },
        components: {

        },
    }

</script>
<style  lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../static/css/base.styl"

    .eventList *{overflow: hidden; margin: 0px; padding: 0px;}
    .eventList button, a{cursor:pointer;}

    .eventList .cardleftTopIcon{height: 50px; width: 50px; border-radius: 50%; background-color: #4A90E2; margin-left: -22px; margin-top: -32px; display: block;}

    .eventList .upFileTitle{text-align: center; width: 20%; height: 100px; line-height: 100px; vertical-align: middle; float: left;}
    .eventList .upFileContent{}

    .containerK{
        width:450px;
        border:1px solid #6C9C2C;
        height:25px;
        float: left;
    }
     #barK{
        background:#95CA0D;
        float:left;
        height:100%;
        text-align:center;
        line-height:150%;
    }

    /*滚动条垂直方向的宽度*/
    ::-webkit-scrollbar{
        width: 10px;
    }
    /* 垂直滚动条的滑动块 */
    ::-webkit-scrollbar-thumb:vertical {
        border-radius: 4px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color:rgba(129,129,129,0.5);
    }
</style>
