/**
 * Created by Administrator on 2016/11/23.
 */

function getsec (str) {
    var str1 = str.substring(1, str.length) * 1
    var str2 = str.substring(0, 1)
    if (str2 == 's') {
        return str1 * 1000
    } else if (str2 == 'h') {
        return str1 * 60 * 60 * 1000
    } else if (str2 == 'd') {
        return str1 * 24 * 60 * 60 * 1000
    }
}

// s:表示秒,h:表示小时,d:表示天
function setCookie (name, value, time) {
    var strsec = getsec(time)
    var exp = new Date()
    exp.setTime(exp.getTime() + strsec * 1)
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
}

function getCookie (name, cookiestr) {
    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    var str
    if (!cookiestr) {
        str = document.cookie
    } else {
        str = cookiestr
    }

    if (arr = str.match(reg)) { return unescape(arr[2]) } else { return null }
}

function delCookie (name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = getCookie(name)
    if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/' }
}

function pagerFilter (data) {
    if (typeof data.length === 'number' && typeof data.splice === 'function') { // is array
        data = {
            total: data.length,
            rows: data
        }
    }
    var dateList = $(this)
    var opts = dateList.datagrid('options')
    var pager = dateList.datagrid('getPager')
    pager.pagination({
        onSelectPage: function (pageNum, pageSize) {
            opts.pageNumber = pageNum
            opts.pageSize = pageSize
            pager.pagination('refresh', {
                pageNumber: pageNum,
                pageSize: pageSize
            })
            dateList.datagrid('loadData', data)
        }
    })
    if (!data.originalRows) {
        data.originalRows = (data.rows)
    }
    var start = (opts.pageNumber - 1) * parseInt(opts.pageSize)
    var end = start + parseInt(opts.pageSize)
    data.rows = (data.originalRows.slice(start, end))
    return data
}

function trim (str) {
    return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '')
}

function isString (obj) {
    return ($.type(obj) === 'string')
}

function str2json (s) {
    if (!isString(s)) return null
    if (window.JSON) {
        return JSON.parse(s)
    } else {
        return (new Function('return ' + trim(s || '')))()
    }
}

function isArray (obj) {
    return $.isArray(obj)
}

function isObject (obj) {
    var t = (typeof obj)
    if (t === 'object') {
        return true
    }
    return false
}

/**
 * 在数组中查找指定key的对像
 * @param arr
 * @param key
 */
function findArray (arr, key, val) {
    var index = -1
    for (var i = 0; i < arr.length; i++) {
        // 如果为字符串，或者key没有给定值，则直接检查是否为val
        if (isString(arr[i]) || key === null || key === undefined) {
            if (arr[i] === val) {
                index = i
                break
            }
        } else if (isObject(arr[i])) {   // 如果为普通对像,则检查有符合key的val
            if (key === null || key === undefined) {
                continue
            }

            var isfind = false
            for (var property in arr[i]) {
                if (property != key) {
                    continue
                }
                if (arr[i][property] === val) {   // 找到了
                    isfind = true
                    break
                }
            }

            if (isfind) {
                index = i
                break
            }
        }
    }
    return index
}

/**
 * uuid生成
 * @param len   长度
 * @param radix  进制
 * @returns {string}
 */
function uuid (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = [], i
    radix = radix || chars.length

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
        // rfc4122, version 4 form
        var r

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }

    return uuid.join('')
}

function getEventTarget (originalEvt) {
    return originalEvt.target ? originalEvt.target : originalEvt.srcElement
}

/**
 * 格式化url地址
 * @param url
 * @returns {*}
 */
function formatUrl (url) {
    var u = url.replace(/&&/g, '&')
    u = u.replace(/\?&/g, '?')
    u = u.replace(/&$/g, '')
    u = u.replace(/&#/g, '#')
    u = u.replace(/&+/g, '&')
    return u
}

/**
 * 序列化url参数
 * @param json
 * @returns {string}
 */
function serializeUrlParam (json) {
    var strArr = []
    for (var i in json) {
        // 忽略默认的几个参数
        if (i == 'method' || i == 'timeout' || i == 'async') continue
        // 传递过来的对象和函数不在提交之列
        if (!((typeof json[i]).toLowerCase() == 'function' || (typeof json[i]).toLowerCase() == 'object')) {
            strArr.push(encodeURIComponent(i) + '=' + encodeURIComponent(json[i]))
        } else if (utils.isArray(json[i])) {
            // 支持传数组内容
            for (var j = 0; j < json[i].length; j++) {
                strArr.push(encodeURIComponent(i) + '[]=' + encodeURIComponent(json[i][j]))
            }
        }
    }
    return strArr.join('&')
}

function isCrossDomainUrl (url) {
    var a = document.createElement('a')
    a.href = url
    if (browser.ie) {
        a.href = a.href
    }
    return !(a.protocol == location.protocol && a.hostname == location.hostname &&
        (a.port == location.port || (a.port == '80' && location.port == '') || (a.port == '' && location.port == '80')))
}

/**
 * 解析图片的路径
 */
function getPathImg (str, num) {
    var i = 0
    var result = ''
    var lastIndex = str.lastIndexOf('?')
    if (lastIndex > 0) {
        str = str.substring(0, lastIndex)
    }
    while (i < num) {
        var lastFrist = str.lastIndexOf('/')
        result = str.substring(lastFrist) + result
        str = str.substring(0, lastFrist)
        i++
    }
    result = result.substring(1, result.length)

    return result
}

// 扩展Date的format方法
Date.prototype.format = function (format) {
    var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return format
}

/* function getFormatDate(time,pattern) {
  var date = ''
  if(Number instanceof time){
    date = new Date(time);
  }else if (Date instanceof time){
    date = time;
  }
  if(pattern == undefined || pattern == null){
    pattern = "yyyy-MM-dd hh:mm:ss"
  }

  return date.format(pattern);
} */

/**
 *转换日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDate (date, isFull) {
    var pattern = ''
    if (isFull == true || isFull == undefined) {
        pattern = 'yyyy-MM-dd hh:mm:ss'
    } else {
        pattern = 'yyyy-MM-dd'
    }
    return getFormatDate(date, pattern)
}

/**
 *转换当前日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */

function getSmpFormatNowDate (isFull) {
    return getSmpFormatDate(new Date(), isFull)
}

/**
 *转换long值为日期字符串
 * @param l long值
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */

function getSmpFormatDateByLong (l, isFull) {
    return getSmpFormatDate(new Date(l), isFull)
}

/**
 *转换long值为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */

function getFormatDateByLong (l, pattern) {
    return getFormatDate(new Date(l), pattern)
}

/**
 *转换日期对象为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
function getFormatDate (date, pattern) {
    if (date == 'undefined') {
        date = new Date()
    }
    if (pattern == undefined) {
        pattern = 'yyyy-MM-dd hh:mm:ss'
    }
    return date.format(pattern)
}

function getMonthDay (year, month) {
    var total = 0
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            total = 31
            break
        case 4:
        case 6:
        case 9:
        case 11:
            total = 30
            break
        case 2:
            if (isLeapYear(year)) {
                total = 29
            } else {
                total = 28
            }
            break
    }
    return total
}

function isLeapYear (year) {
    var isleap = false
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        isleap = true
    }
    return isleap
}

function getDayState (time) {
    var split = time.split('-')
    var year = Number(split[0])
    var month = Number(split[1])
    var day = Number(split[2])
    // var t = new Date(year, month, day);
    var t = new Date(time)

    var tday = t.getDay()
    if (tday == 0 || tday == 6) {
        return '双休日'
    } else {
        return '工作日'
    }
}

/**
 * 获取相同域指定地址的body内容，返回一个Promise对像，调用如下
 * utils.getSameUrlBodyContent("/static/test1.html").then(function (data) {
       //data:为返回的文本数据
   }, function (error) {
       //只要发生错误就会调用，error是返回的错误类型
   }).catch(function(e) {
      //整个过程发生异常时调用
   })
 *
 * @param url
 * @returns {Promise}
 */
function getSameUrlBodyContent (url) {
    var p = new Promise(function (resolve, reject) {
        $.ajax(url, {
            dataType: 'text',
            success: function (html) {
                var ifr = document.createElement('iframe')
                var uid = uuid(8, 16)
                ifr.id = uid
                ifr.width = '0px'
                ifr.height = '0px'
                ifr.frameborder = '0px'
                ifr.style.display = 'none'
                ifr.src = 'javascript:void(function(){document.open();document.write(\'' + html + '\');document.close();}())'
                var app = document.querySelector('#app')
                app.appendChild(ifr)
                var $body = $(ifr).contents().find('body > div[id=\'body\']').html()
                if ($body === null || $body === undefined || $body === '') {
                    $body = $(ifr).contents().find('body').html()
                }
                $(ifr).remove()
                resolve($body)
            },
            error: function (xhr, type, errorThrown) {
                reject(type)
            }
        })
    })
    return p
}

/**
 * 弹出消息框(替换原始的alert)
 * @param self   当前对象
 * @param msg    显示消息
 * @param type   可选参数[可以填写 success,error,info,warning]
 */
function alertMessageBox (self, msg, type) {
    if (type == undefined || type == '') {
        type = 'error'
    }
    self.$confirm(msg, '警告', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: type
    })
}

/**
 * 浅克隆对像
 * @param obj
 * @returns {{}}
 */
function shadowCloneObject (obj) {
    var cloneObj = {}
    for (var property in obj) {
        var val = obj[property]
        cloneObj[property] = val
    }
    return cloneObj
}

/**
 * 解析url上面的查询参数
 * @param url
 * @returns {{}}
 */
function parseUrlQueryParam (url) {
    var query = {}
    var index = url.indexOf('?')
    if (index != -1) {
        var str = url.substr(index + 1)
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
            query[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
    }
    return query
}

/**
 * 数组转置
 */
function transpose (arr) {
    var arr2 = []
    for (var i = 0; i < arr[0].length; i++) {
        arr2[i] = []
    }
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            arr2[j][i] = arr[i][j]
        }
    }
    return arr2
}

/**
 * 混合对像，把源对像混合到目标对像上,如果有相同属性，则覆盖目标对像的属性,返回目标对像
 * @param source
 * @param target
 */
function mixtureObject (source, target) {
    for (var property in source) {
        var val = source[property]
        target[property] = val
    }
    return target
}

function customerParseFloat (num, prefix = null) {
    if (num == null || num == undefined) {
        return '- -'
    } else {
        var str = parseFloat(num).toLocaleString()
        if (prefix != null) {
            return prefix + str
        } else {
            return str
        }
    }
}

function getDateDiff (dateTimeStamp, i18n) {
    let text1, text2, text3, text4, text5, text6
    if(i18n === 'EN' ){
        text1 = 'months ago'
        text2 = 'weeks ago'
        text3 = 'days ago'
        text4 = 'hours ago'
        text5 = 'minutes ago'
        text6 = 'just now'
    }else{
        text1 = '月前'
        text2 = '周前'
        text3 = '天前'
        text4 = '小时前'
        text5 = '分钟前'
        text6 = '刚刚'
    }
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
        result = '' + parseInt(monthC) + text1
    }
    else if (weekC >= 1) {
        result = '' + parseInt(weekC) + text2
    }
    else if (dayC >= 1) {
        result = '' + parseInt(dayC) + text3
    }
    else if (hourC >= 1) {
        result = '' + parseInt(hourC) + text4
    }
    else if (minC >= 1) {
        result = '' + parseInt(minC) + text5
    } else
        result = text6
    return result
}

export default {
    setCookie,
    getCookie,
    delCookie,
    pagerFilter,
    isString,
    str2json,
    trim,
    isArray,
    isObject,
    findArray,
    uuid,
    getEventTarget,
    formatUrl,
    serializeUrlParam,
    isCrossDomainUrl,
    getPathImg,
    getSmpFormatDateByLong,
    getFormatDate,
    getSameUrlBodyContent,
    getMonthDay,
    getDayState,
    alertMessageBox,
    shadowCloneObject,
    parseUrlQueryParam,
    mixtureObject,
    transpose,
    customerParseFloat,
    getDateDiff
}
