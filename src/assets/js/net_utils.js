function getRequest (url, data, succ, fail, asyn = true, source='web') {
    let headerParam = {
        token: sessionStorage.getItem('token'),
        source: source
    }
    $.ajax({
        headers: headerParam,
        type: 'GET',
        url: url,
        data: data,
        dataType: 'json',
        async: asyn,
        contentType: 'application/json;charset=UTF-8',
        success: function (resMsg) {
            if(resMsg && resMsg.errorCode && resMsg.errorCode === 5101){
                window.location.href = ""
            }
            succ(resMsg)
        },
        error: function (resMsg) {
            fail(resMsg)
        }
    })
}

function postRequest (url, data, succ, fail, asyn = true, source='web') {
    let headerParam = {
        token: sessionStorage.getItem('token'),
        source: source
    }
    $.ajax({
        headers: headerParam,
        type: 'POST',
        url: url,
        dataType: 'json',
        data: JSON.stringify(data),
        async: asyn,
            contentType: 'application/json;charset=UTF-8',
        success: function (resMsg) {
            if(resMsg && resMsg.errorCode && resMsg.errorCode === 5101){
                window.location.href = ""
            }
            succ(resMsg)
        },
        error: function (resMsg) {
            fail(resMsg)
        }
    })
}

function formRequest (url, data, succ, fail, asyn = true, source='web') {
    let headerParam = {
        token: sessionStorage.getItem('token'),
        source: source
    }
    $.ajax({
        headers: headerParam,
        type: 'POST',
        url: url,
        dataType: 'json',
        data: data,
        async: asyn,
        traditional:true,
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        success: function (resMsg) {
            if(resMsg && resMsg.errorCode && resMsg.errorCode === 5101){
                window.location.href = ""
            }
            succ(resMsg)
        },
        error: function (resMsg) {
            fail(resMsg)
        }
    })
}

function deleteRequest (url, data, succ, fail, asyn = true, source='web') {
    let headerParam = {
        token: sessionStorage.getItem('token'),
        source: source
    }
    $.ajax({
        headers: headerParam,
        type: 'DELETE',
        url: url,
        dataType: 'json',
        data: JSON.stringify(data),
        async: asyn,
        contentType: 'application/json;charset=UTF-8',
        success: function (resMsg) {
            if(resMsg && resMsg.errorCode && resMsg.errorCode === 5101){
                window.location.href = ""
                console.log(headerParam)
            }
            succ(resMsg)
        },
        error: function (resMsg) {
            fail(resMsg)
        }
    })
}

export default {
    postRequest,
    getRequest,
    deleteRequest,
    formRequest
}
