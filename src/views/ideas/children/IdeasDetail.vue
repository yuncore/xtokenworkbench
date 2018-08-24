<template>
  <div id="ideasDetail">
    <div class="container top-search">
      <div class="head">IDEAS</div>
      <div class="head-title">/{{idea.title}}</div>
      <button class="head-comment" @click="askComment">{{$t('page.ideasDetail.t1')}}</button>
    </div>
    <div class="author-info">
      <div class="ideas-feedback">
        <div class="ideas-num">{{detail.cmmCount}}</div>
        {{$t('page.ideasDetail.t2')}}
        <div class="ideas-num">{{detail.agree+detail.oppose}}</div>
        {{$t('page.ideasDetail.t3')}}
      </div>
      <img class="author-img" :src="idea.icon?imgDir+idea.icon:'static/img/ava-default.svg'"/>
      <div class="author-name">{{idea.name}}</div>
      <div class="publish-time">{{getDate(idea.time)}}</div>
    </div>
    <div class="title">{{idea.title}}</div>
    <div class="public-content margin-90" v-html="idea.content"></div>
    <div class="standpoint margin-90">
      <div class="agree" @click="requestSendStandpoint(1)">
        <img class="agree-img" src="static/img/idea_agree.png">
        <div class="agree-title">{{$t('page.ideasDetail.t4')}}
          <div class="agree-choice" v-if="type==1">({{$t('page.ideasDetail.t5')}})</div>
        </div>
      </div>
      <div class="agree" @click="requestSendStandpoint(0)">
        <img class="agree-img" src="static/img/idea_oppose.png">
        <div class="agree-title">{{$t('page.ideasDetail.t6')}}
          <div class="agree-choice" v-if="type==0">({{$t('page.ideasDetail.t5')}})</div>
        </div>
      </div>
    </div>
    <div class="all-standpoint">{{detail.agree}}{{$t('page.ideasDetail.t7')}} {{detail.oppose}}{{$t('page.ideasDetail.t8')}}</div>
    <div class="line"></div>
    <div class="other" v-for="(item,index) in list">
      <div class="other-info">
        <img style="width: 30px;height: 30px;" :src="item.icon?imgDir+item.icon:'static/img/ava-default.svg'">
        <div class="other-name">{{item.name}}</div>
        <div class="other-time">{{getDate(item.time)}}</div>
      </div>
      <div style="width:100%;height: 1px;background: #f1f1f1;"></div>
      <div class="other-content" v-html="item.content"></div>
    </div>
    <div class="other-line"></div>
    <div style="margin: 0 90px;">
      <textarea class="comment" v-model="comment"></textarea>
    </div>
    <div class="send-comment">
      <button class="send" @click="sendComment">{{$t('page.ideasDetail.t9')}}</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import net_util from "../../../assets/js/net_utils";
  import config from "../../../assets/js/config";
  import utils from "../../../assets/js/utils";
  import { mapGetters } from "vuex";

  export default {
    data() {
      return {
        id: 0,
        detail: '',
        idea:'',
        type: -1,
        list: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        comment: '',
        imgDir:'',
      }
    },
    mounted() {
      this.imgDir=config.IMGDOMAIN;
      this.id = this.$route.query.id;
      this.requestIdeas(this.id);
      this.requestCommentes(this.id);
    },
    computed: {
      ...mapGetters(["name", "icon"])
    },
    methods: {
      requestIdeas: function (ideaId) {
        let url = config.JAVABASEDOMAIN + '/idea/get';
        net_util.getRequest(url, {ideaId}, (res) => {
          console.log(res)
          if (!res.errorMsg) {
            this.detail = res.result;
            this.idea=res.result.idea;
            this.type = res.result.type;
          } else {
            this.$message({type: "error", message: res.errorMsg});
          }
        }, (err) => {
          this.$message({
            type: "error",
            message: res.responseJSON.message || this.$t("error")
          });
        })
      },
      requestCommentes: function (ideaId) {
        let url = config.JAVABASEDOMAIN + '/idea/cmmt/list';
        net_util.getRequest(url, {ideaId, page: 1, num: 10000}, (res) => {
          console.log(res)
          if (!res.errorMsg) {
            this.list = res.result.list;
          } else {
            this.$message({type: "error", message: res.errorMsg});
          }
        }, (err) => {
          this.$message({
            type: "error",
            message: res.responseJSON.message || this.$t("error")
          });
        })
      },
      getDate: function (time) {
        return utils.getSmpFormatDateByLong(time, false)
      },
      askComment: function () {
        document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
      },
      sendComment: function () {
        if (this.comment) {
          this.requestSendComment();
        } else {
          this.$message({type: "warning", message: ''});
        }
      },
      requestSendComment: function () {
        let url = config.JAVABASEDOMAIN + '/idea/cmmt/add';
        var content=this.getFormatCode(this.comment);
        net_util.getRequest(url, {ideaId: this.id, content}, (res) => {
          console.log(res)
          if (!res.errorMsg) {
            this.comment = '';
            var name=this.getName(this.name);
            var icon=sessionStorage.getItem('icon');
            var com={content,time:new Date().getTime(),name,icon,}
            this.list.unshift(com);
            this.detail.cmmCount=this.detail.cmmCount+1;
            this.$message({type: 'success', message: this.$t("success")})
          } else {
            this.$message({type: "error", message: res.errorMsg});
          }
        }, (err) => {
          this.$message({
            type: "error",
            message: res.responseJSON.message || this.$t("error")
          });
        })
      },

      getName:function (name) {
        if (name=='yourName'){
          var phone=sessionStorage.getItem('phone');
          return phone.substring(0,3)+"****"+phone.substring(7);
        }
        return name;
      },
      /*
        * 根据Value格式化为带有换行、空格格式的HTML代码
        * @param strValue {String} 需要转换的值
        * @return  {String}转换后的HTML代码
        * @example
        * getFormatCode("测\r\n\s试")  =>  “测<br/> 试”
        */
      getFormatCode: function (strValue) {
        return strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');

      },
      requestSendStandpoint: function (type) {
        if (this.type == -1) {
          let url = config.JAVABASEDOMAIN + '/idea/agree/add';
          net_util.getRequest(url, {ideaId: this.id, type}, (res) => {
            console.log(res)
            if (!res.errorMsg) {
              this.type = type;
              if (type == 1) {
                this.detail.agree = this.detail.agree + 1;
              } else {
                this.detail.oppose = this.detail.oppose + 1;
              }
            } else {
              this.$message({type: "error", message: res.errorMsg});
            }
          }, (err) => {
            this.$message({
              type: "error",
              message: res.responseJSON.message || this.$t("error")
            });
          })
        }
      }
    }
  }
</script>
<style scoped>
  @import '../../../../static/css/base.styl';

  #ideasDetail {
    max-width: 1000px;
    margin: 0 auto;
    padding-top: 60px;
    background: #ffffff;
  }

  .top-search {
    padding: 10px 90px;
    display: flex;
    align-items: center;
  }

  .head {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0;
    text-align: left;
  }

  .head-title {
    margin-left: 5px;
    flex: 1;
    font-family: PingFangSC-Regular;
    padding-right: 20px;
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .head-comment {
    background: #409eff;
    border-radius: 1.55px;
    width: 70px;
    height: 30px;
    font-size: 13px;
    color: #ffffff;
    border: none;
  }

  .author-info {
    background: #fafafa;
    padding: 10px 90px;
    display: flex;
    align-items: center;
  }

  .ideas-feedback {
    flex: 1;
    font-size: 13px;
    color: #666666;
    display: flex;
  }

  .ideas-num {
    margin-left: 8px;
    margin-right: 5px;
    color: #409eff;
  }

  .author-img {
    border: 1px solid #ffffff;
    width: 30px;
    height: 30px;
    border-radius: 100%;
  }

  .author-name {
    font-size: 14px;
    color: #536475;
    margin-left: 8px;
  }

  .publish-time {
    font-size: 14px;
    color: #999999;
    margin-left: 8px;
    margin-right: 15px;
  }

  .margin-90 {
    margin: 0 90px;
  }

  .title {
    margin: 20px 90px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0;
    text-align: left;
  }

  .public-content {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    text-align: left;
  }

  .standpoint {
    display: flex;
    justify-content: center;
  }

  .agree {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fafafa;
    border: 1px solid #dddddd;
    border-radius: 3px;
    width: 240px;
    height: 100px;
    margin: 40px 40px 20px 40px;
  }

  .agree-img {
    width: 30px;
    height: 30px;
  }

  .agree-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333333;
    margin-top: 8px;
  }

  .agree-choice {
    color: #999999;
  }

  .all-standpoint {
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #999999;
    text-align: center;
  }

  .line {
    margin: 40px 90px 10px 90px;
    background: #f1f1f1;
    height: 1px;
  }

  .other {
    margin: 10px 100px 0 100px;
    border: 1px solid #f1f1f1;
    box-shadow: 0 1px 2px 0 rgba(51, 51, 51, 0.10);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }

  .other-info {
    padding: 10px 20px;
    display: flex;
    align-items: center;
  }

  .other-name {
    margin-left: 8px;
    font-size: 14px;
    color: #536475;
  }

  .other-time {
    margin-left: 8px;
    font-size: 14px;
    color: #999999;
  }

  .other-content {
    padding: 10px 20px;
    font-size: 14px;
    color: #666666;
  }

  .other-line {
    margin: 20px 90px 0 90px;
    background: #f1f1f1;
    height: 1px;
  }

  .comment {
    background: #fafafa;
    border: 1px solid #dddddd;
    border-radius: 5px;
    width: 100%;
    height: 150px;
    margin-top: 60px;
    resize: none;
    padding: 15px;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
  }

  .send-comment {
    display: flex;
    justify-content: flex-end;
  }

  .send {
    margin: 30px 100px 100px 0;
    background: #409eff;
    border-radius: 1.55px;
    width: 70px;
    height: 30px;
    border: none;
    font-size: 13px;
    color: #ffffff;
  }
</style>
