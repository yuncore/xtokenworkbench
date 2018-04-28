/**
 * Created by Administrator on 2016/12/13.
 */

import net from "../../../assets/js/net_utils"
import utils from '../../../assets/js/utils'
import app_config from "../../..//assets/js/app_config"

/**
 * 样式类型
 * @type {{TITLE: string, TEXT: string, IMAGETEXT: string}}
 */
const STYLE_TYPE = {
  TITLE: "title",
  TEXT: "text",
  IMAGETEXT: "image-text",
  TABLE: "table"
}

const DEFAULT_STYLE_TYPE = STYLE_TYPE.TITLE
//const BASE_API_URL = "http://192.168.1.227:8082/editor/"

//const BASE_API_URL = "http://"+app_config.getSession().ptag+".yunmaster.net/editor/"
const BASE_API_URL = "http://workbench.yunmaster.cn/editor/"

//API
const STYLE_LIST_API = BASE_API_URL + "style/list"
const STYLE_ADD_API = BASE_API_URL + "style/add"



/**
 * 格式化url，把跨域的url转换成当前域下的url
 * @param url
 * @returns {*}
 */
function formatUrl(url) {
  return url
}

/**
 * 根据类型请求样式列表
 * @param type
 * @param page
 * @param num
 * @returns {Promise}
 */
function requestStyle(type,page,num) {
  var reqData = {
    type,page,num
  }
  var p = new Promise(function (resolve, reject) {
    net.asynRequest(STYLE_LIST_API,reqData,"jsonp").then(function (resMsg) {
      resolve(resMsg)
    }, function (resMsg) {
      reject(resMsg)
    })
  })
  return p;
}

function requestAddStyle(styleType,styleName,styleDesc) {
  var postData = {
    styleType,
    styleName,
    styleDesc
  }
  var p = new Promise(function (resolve, reject) {
    net.asynPostRequest(STYLE_ADD_API,postData).then(function (resMsg) {
      resolve(resMsg)
    }, function (resMsg) {
      reject(resMsg)
    })
  })
  return p
}


/**
 * 根据索引值获取样式类型
 * @param index
 * @returns {*}
 */
function getStyleType(index) {
  var type = null;
  switch (index) {
    case 0:
      type = STYLE_TYPE.TITLE
      break;
    case 1:
      type = STYLE_TYPE.TEXT
      break;
    case 2:
      type = STYLE_TYPE.IMAGETEXT
      break;
    case 3:
      break;
  }
  return type;
}



function RichEditor(ueId) {
  this.ue = null                   //百度ue
  this.tempContent = null        //临时内容(突然离开页面时存放的内容)
  this.autoSave = false;         //是否自动保存
  this.currentTarget = null;    //当前选中的目标样式
  this.ueId = ueId;
  this.ueReady = false;          //ue是否就绪
}

/**
 * 开始自动保存(一但开启，一定记得在离开组件时，调用stopAutoSave来停止自动保存
 * TODO:还未调试成功
 */
RichEditor.prototype.startAutoSave = function () {
  this.autoSave = true;
  var me = this
  this.tempContent = this.ue.getContent();
  if(this.autoSave) {
    setTimeout(function() {
      me.save()
    },5000)
  }
}

/**
 * 停止自动保存
 */
RichEditor.prototype.stopAutoSave = function () {
  this.autoSave = false;
}


/**
 * 获取编缉器内容
 * @returns {null}
 */
RichEditor.prototype.getContent = function () {
  this.removeBorder();             //获取内容前，把所有选定时产生的边框移除
  var content = this.ue.getContent();
  return content;
}

/**
 * 设置内容
 * @param content
 */
RichEditor.prototype.setContent = function (content) {
  var me = this;
  if(this.ueReady) {
    this.ue.setContent(content)
    this.bindSelectedEventToUe()
    console.log("设置内容成功")
  }
  else {
    console.log("设置内容，UE没有就绪")
    setTimeout(function () {
      me.setContent(content)
    },100)
  }
}

RichEditor.prototype.loadContent = function (url) {
  //TODO:从url中加载内容到编缉器
  return null;
}

/**
 * 在页面上渲染出百度ue，完成body的事件缄定
 * @param serverParam  每次向服务器上传图片时，会携带的参数
 */
RichEditor.prototype.render = function (serverParam) {
  var me = this;

  UE.delEditor(this.ueId)
  this.ue = UE.getEditor(this.ueId)

  this.ue.ready(function () {
    //渲染的同时，在body上绑定一个click事件,当焦点离开样式时能去掉样式身上由于选中产生的边框
    var $editor_body = $("#"+me.ueId+" iframe").contents().find('body.view')
    $editor_body.click(function(evt) {
      //evt.stopPropagation();
      me.removeBorder()
    });
    me.ueReady = true;
    console.log("ue就绪成功")
    if(serverParam) {
      me.setServerParam(serverParam)
    }

    //添加focus事件，解决切换到源码模式返回不能对样式进行选中的bug
    me.ue.on('focus', function (evtName) {
      me.bindSelectedEventToUe()
    })
  })
}


/**
 * 移除选定时产生的边框
 */
RichEditor.prototype.removeBorder = function() {
  var $styleArr = $("#"+this.ueId+" iframe").contents().find("body.view section[style-id]")
  $styleArr.each(function(index,el) {
    if($(el).css("padding") != "0px" || $(el).css("border") != "") {
      $(el).css({padding: "0px", border: ""})
    }
  })
  this.currentTarget = null;
}


/**
 * 离开页面时，删除百度ue
 */
RichEditor.prototype.delUe = function () {
  UE.delEditor(this.ueId)
  this.stopAutoSave()
}

/**
 * 插入内容
 * @param content
 */
RichEditor.prototype.insertContent = function (content) {
  var me = this;
  if(me.ueReady) {
    try {
      //this.ue.setContent(content)
      this.ue.execCommand("inserthtml", content)
      this.bindSelectedEventToUe()
    }
    catch(e) {}
    console.log("ue就绪，插入内容成功")
  }
  else {
    setTimeout(function () {
      me.insertContent(content)
    },100)
  }

}

/**
 * 绑定点击事件到选中的样式上
 */
RichEditor.prototype.bindSelectedEventToUe = function() {
  var me = this;
  var $styleArr = $("#"+this.ueId+" iframe").contents().find("body.view section[style-id]")
  $styleArr.off("click")
  if($styleArr.length > 0) {
    $styleArr.click(function(evt) {
      var target = utils.getEventTarget(evt)
      if(target && target.tagName.toLocaleLowerCase() != 'img') {
        evt.stopPropagation();
        me.removeBorder();
        $(evt.currentTarget).css({border:"1px dashed green",padding: "2px"})
        me.currentTarget = evt.currentTarget
      }
    })
  }
}

RichEditor.prototype.setServerParam = function (param) {
  var me = this
  if(this.ueReady) {
    this.ue.execCommand("serverparam", function (editor) {
      return param
    });
    console.log("设置参数成功")
  }
  else {
    console.log("设置递交给服务器的参数，UE没有就绪")
    setTimeout(function () {
      me.setServerParam(param)
    },100)
  }

}

/**
 * 移除选定的样式
 */
RichEditor.prototype.removeStyle = function() {
  if(this.currentTarget) {
    $(this.currentTarget).remove()
    this.currentTarget = null
    this.ue.focus(true)
  }
}

/**
 * 清除文档
 */
RichEditor.prototype.clearDoc = function() {
  this.ue.execCommand('cleardoc')
}

/**
 * 设置颜色
 * @param color
 */
RichEditor.prototype.setColor = function(color) {
  if(this.currentTarget) {
    var $elArr = $(this.currentTarget).find("*[data-color]")
    $elArr.each(function (index, el) {
      var data_color = $(el).attr('data-color');
      if (data_color) {
        $(el).css(data_color, color)
      }
    })
  }
}

RichEditor.prototype.ueOpt = function (name) {
  return this.ue.getOpt(name)
}

export {
  STYLE_TYPE,
  requestStyle,
  requestAddStyle,
  getStyleType,
  RichEditor
}
