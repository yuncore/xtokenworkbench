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
        timeout:10000,
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
    if(dataType && dataType.need){
        requestObj.dataType = dataType.value
    }
    if(contentType && contentType.need){
        requestObj.contentType = contentType.value
    }
    if (traditional && traditional.need) {
        requestObj.traditional = traditional.value
    }
    if (processData && processData.need) {
        requestObj.processData = processData.value
    }
    $.ajax(requestObj)
}

function getRequest(url, data, succ, fail, async=true) {
    return request({
        url: url,
        data: data,
        succ: succ,
        fail: fail,
        async: async,
        dataType: {need: true, value: 'json'},
        contentType: {need: true, value: 'application/json;charset=UTF-8'}
    })
}

function postRequest(url, data, succ, fail, async=true) {
    return request({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        succ: succ,
        fail: fail,
        async: async,
        dataType: {need: true, value: 'json'},
        contentType: {need: true, value: 'application/json;charset=UTF-8'}
    })
}

function formRequest(url, data, succ, fail, async=true) {
    return request({
        type: 'POST',
        url: url,
        data: data,
        succ: succ,
        fail: fail,
        async: async,
        dataType: {need: true, value: 'json'},
        traditional: {need: true, value: true},
        contentType: {need: true, value: 'application/x-www-form-urlencoded;charset=UTF-8'}
    })
}

function deleteRequest(url, data, succ, fail, async=async) {
    return request({
        type: 'DELETE',
        url: url,
        data: JSON.stringify(data),
        succ: succ,
        fail: fail,
        async: async,
        dataType: {need: true, value: 'json'},
        contentType: {need: true, value: 'application/json;charset=UTF-8'}
    })
}

function formDataRequest(url, data, succ, fail, async=true) {
    return request({
        type: 'POST',
        url: url,
        data: data,
        succ: succ,
        fail: fail,
        async: async,
        processData: {need: true, value: false},
        contentType: {need: true, value: false}
    })
}

function putRequest(url, data, succ, fail, async=true) {
    return request({
        type: 'PUT',
        url: url,
        data: data,
        succ: succ,
        fail: fail,
        async: async
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
