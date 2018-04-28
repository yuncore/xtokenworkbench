<!--
 要对百度UE源码进行修改，修改地方为
 baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = this.getDom().style.zIndex - 4;
 修改为
 baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = this.getDom().style.zIndex - 4 + 5000;

 或者修改ueditor.config.js中zIndex的参数，让层的基数大于2000以上。

 RichEditor在渲染时，可以给出每次上传图片携带给服务器的参数,例如
 var param = {'key1':'value1','key2':'value2'}
 RichEditor editor = new RichEditor()
 editor.render(param)
-->
<template>
    <div id="edit-container">
      <!--<button type="button" @click="done()">编缉完成</button>
      <button type="button" @click="preview()">手机预览</button>
      <button type="button" @click="delSection()">删除样式</button>
      <button type="button" @click="clear()">清空内容</button>-->
      <div class="center" style="width: 750px">
        <div class="body" style="width: 750px">
          <!--<Left @clickstyle="insertStyle($event)"></Left>-->
          <div class="editor">
            <script :id="editorId" type="text/plain" style="width:100%;height:749px;">

            </script>
          </div>
          <Right @clickColor="setColor($event)" @clearContent="clear()" @delSection="delSection()" @preview="preview()" @done="done()"></Right>
        </div>
      </div>

      <el-dialog  size="tiny" top="5%" custom-class="editor_preview_cls" :modal="modal" v-model="isPreView">
        <PreView :content="previewContent"></PreView>
      </el-dialog>

      <!-- 基于百度ue的层次，一定比百度ue层次高 -->
      <div :class="{vmodal:isPreView}" style="z-index: 6500 !important;"></div>
    </div>
</template>
<style>
    @import "css/global.css";
    .editor_preview_cls {
      background: none;
      box-shadow: none;
    }

    .vmodal {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: .5;
      background: #000;
    }

    /*重新el-dialog__wrapper样式，定义层次比遮罩高*/
    #edit-container > .el-dialog__wrapper {
      z-index: 6501 !important;
    }
    #edit-container > .el-dialog__wrapper > div {
      margin-bottom: 0 !important;
    }

</style>

<script>
  import Left from "./Left.vue"
  import Right from "./Right.vue"
  import {RichEditor} from "./js/editor"

  import PreView from "./Preview.vue"
  import utils from "../../assets/js/utils"
  import app_config from "../../assets/js/app_config"


  export default {
    name: "ym-rich-editor",

    destroyed: function () {
      console.log("Editor-destroyed")
      this.richEditor.delUe();
    },

    computed: {
      editorId: function () {
        if(!this._editorId) {
          this._editorId = utils.uuid(8,16)
        }
        return this._editorId;
      },

      richEditor: function () {
        if(!this._richEditor) {
          this._richEditor = new RichEditor(this.editorId)
        }
        return this._richEditor
      }
    },

    data: function () {
      return {
        _editorId: null,
        _richEditor : null,
        isPreView: false,
        previewContent: "",
        modal: false,
        lockScroll: false
      }
    },

    mounted: function () {
      console.log("Editor-mounted")
      this.richEditor.render(app_config.getUpLoaderServerParam());
    },

    components: {
      Left,
      Right,
      PreView
    },

    methods: {
      insertStyle: function (evt) {
        console.log(evt.styleHtml)
        this.richEditor.insertContent(evt.styleHtml)
      },

      setColor: function (evt) {
        this.richEditor.setColor(evt.color)
      },

      clear: function (evt) {
        this.richEditor.clearDoc()
      },

      delSection: function (evt) {
        this.richEditor.removeStyle()
      },

      btn: function () {
        this.richEditor.ue.execCommand('source')
      },

      preview: function () {
        this.previewContent = this.richEditor.getContent()
        if(!this.previewContent) {
          this.previewContent = ""
        }
        this.isPreView = true;
        $(".el-dialog__wrapper").css("z-index","5000")
      },

      replaceImgSrc: function(template) {
        var pattern = /src=\".*?((wx_fmt=(jpeg|jpg|png|gif|bmp)(&.*?))|(jpeg|png|bmp|gif|jpg))\"/g
        var res, tempTemplate = template;
        while ((res = pattern.exec(template)) != null) {
          if (res[4]) {
            tempTemplate = tempTemplate.replace(res[4], '')
          }
        }
        return tempTemplate
      },

      done: function () {
        var content = this.replaceImgSrc(this.richEditor.getContent())
        this.richEditor.setContent('');
        this.$emit("done",{content})
      },

      setContent: function (content) {
        this.richEditor.setContent(content)
      },

      getContent: function () {
        var content = this.richEditor.getContent()
        return content;
      },

      setServerParam: function (param) {
        this.richEditor.setServerParam(param)
      }
    }
  }
</script>
