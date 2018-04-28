/**
 * Created by Sun on 2016/11/28 0028.
 */

/*var session = {
  'fileDomain':'',
  'imgDomain':'',
  'psessionid':'',
  'ptag':'',
  'puserid':''
}*/
var session={}

var GLOBAL_SERVER_PARAM = null            //全局的上传文件使用的服务器参数

var isBarLoader = false;

function setBarLoader() {
  sessionStorage.setItem("barLoader", isBarLoader);
}

function getBarLoader() {
  var loader = sessionStorage.getItem("barLoader");
  if(loader == null || loader == ''){
    return false
  }
  return loader;
}

function setSession(data) {
   this.session = data;
  sessionStorage.setItem("session", JSON.stringify(this.session));
}

function getSession() {
  var data = sessionStorage.getItem("session");
  // this.session = JSON.parse(data);
  return JSON.parse(data);
}


var GLOBAL_SERVER_PARAM = null

function setUpLoaderServerParam(param) {
  GLOBAL_SERVER_PARAM = param
  if(!GLOBAL_SERVER_PARAM) {
    GLOBAL_SERVER_PARAM = {}
  }
  sessionStorage.setItem("uploader_param", JSON.stringify(GLOBAL_SERVER_PARAM));
}

function getUpLoaderServerParam() {
  if(!GLOBAL_SERVER_PARAM) {
    var data = sessionStorage.getItem("uploader_param");
    GLOBAL_SERVER_PARAM = JSON.parse(data)
  }

  if(!GLOBAL_SERVER_PARAM) {
    return {}
  }
  return GLOBAL_SERVER_PARAM
}


export default {
  session,
  setSession,
  getSession,
  setUpLoaderServerParam,
  getUpLoaderServerParam,
  setBarLoader,
  getBarLoader,
}
