<template>
  <div id="ideasPublish">
    <div class="container top-search">
      <div class="page-back" @click="back">
        <img src="../../../../static/img/history_back.svg">
        {{$t('page.ideasPublish.t2')}}
      </div>
      <div style="flex:1;"></div>
    </div>
    <el-input
      style="width:100%;"
      :placeholder="$t('page.ideasPublish.t3')"
      maxlength="50"
      v-model="title"
      clearable>
    </el-input>
    <el-input
      style="margin-top: 30px;"
      type="textarea"
      resize="none"
      :autosize="{ minRows: 20}"
      placeholder=""
      v-model="content">
    </el-input>
    <div class="publish-line">
      <el-button class="publish" type="primary" @click="sendPublish">{{$t('page.ideasPublish.t1')}}</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import net_util from "../../../assets/js/net_utils";
  import config from "../../../assets/js/config";

  export default {
    data() {
      return {
        title: '',
        content: ''
      }
    },
    methods: {
      back: function () {
        this.$router.back(-1);
      },
      sendPublish: function () {
        if (this.title) {
          if (this.content) {
            var detail = this.getFormatCode(this.content);
            this.requestSendIdeas(detail)
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('page.ideasPublish.t4')
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('page.ideasPublish.t3')
          })
        }
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
      requestSendIdeas: function (content) {
        let url = config.JAVABASEDOMAIN + '/idea/add';
        net_util.postRequest(url, {title: this.title, content}, (res) => {
          if (!res.errorMsg) {
            this.title = '';
            this.content = '';
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
      requestIdeas: function (ideaId) {
        let url = config.JAVABASEDOMAIN + '/idea/get';
        net_util.getRequest(url, {ideaId}, (res) => {
          if (!res.errorMsg) {
            console.log(res)
            this.texts = res.result.content
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
</script>
<style scoped>
  @import '../../../../static/css/base.styl';

  #ideasPublish {
    max-width: 1000px;
    margin: 0 auto;
    padding-top: 60px;
    background: #ffffff;
  }

  .top-search {
    display: flex;
    margin-top: 10px;
  }

  .page-back{
    padding-bottom: 40px;
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0;
    line-height: 24px;
    cursor: pointer;
  }

  .page-back img {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }

  .publish-line {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }

  .publish {
    background: #409eff;
    width: 130px;
  }
</style>
