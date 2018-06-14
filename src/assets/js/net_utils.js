function request({
                     type,
                     url,
                     data,
                     succ,
                     fail,
                     dataType = false,
                     contentType = false,
                     traditional = false,
                     async = true,
                     processData = false,
                     source = 'web'
                 }) {
    let headerParam = {
        token: sessionStorage.getItem('token'),
        source: source
    };
    let requestObj = {
        headers: headerParam,
        type: type,
        url: url,
        data: data,
        async: async,
        success: function (resMsg) {
            if (resMsg && resMsg.errorCode && resMsg.errorCode === 5101) {
                window.location.href = ""
            }
            succ(resMsg)
        },
        error: function (resMsg) {
            fail(resMsg)
        }
    };
    if(dataType){
        requestObj.dataType = dataType
    }
    if(contentType){
        requestObj.contentType = contentType
    }
    if (traditional) {
        requestObj.traditional = true
    }
    if (processData) {
        requestObj.processData = true
    }
    $.ajax(requestObj)
}

function getRequest(url, data, succ, fail) {
    return request({
        url: url,
        data: data,
        succ: succ,
        fail: fail,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
    })
}

function postRequest(url, data, succ, fail) {
    return request({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        succ: succ,
        fail: fail,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
    })
}

function formRequest(url, data, succ, fail) {
    return request({
        type: 'POST',
        url: url,
        data: data,
        succ: succ,
        fail: fail,
        dataType: 'json',
        traditional: true,
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8'
    })
}

function deleteRequest(url, data, succ, fail) {
    return request({
        type: 'DELETE',
        url: url,
        data: JSON.stringify(data),
        succ: succ,
        fail: fail,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
    })
}

function formDataRequest(url, data, succ, fail) {
    return request({
        type: 'POST',
        url: url,
        data: data,
        succ: succ,
        fail: fail,
        processData: false,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
    })
}

function putRequest(url, data, succ, fail) {
    return request({
        type: 'PUT',
        url: url,
        data: data,
        succ: succ,
        fail: fail
    });
}


export default {
    postRequest,
    getRequest,
    deleteRequest,
    formRequest,
    formDataRequest,
    putRequest
}
