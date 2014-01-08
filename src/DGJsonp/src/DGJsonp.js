L.DG.Jsonp = function (params) {
    'use strict';

    var query = '',
        resUrl, timer, head, script,
        callbackId, callbackName,
        url = params.url || '',
        data = params.data || {},
        success = params.success || function () {},
        error = params.error || function () {},
        beforeSend = params.beforeSend || function () {},
        complete = params.complete || function () {},
        timeout = params.timeout || 30 * 1000;

    head = document.getElementsByTagName('head')[0];

    callbackId = 'dga_' + ('' + Math.random()).slice(2);
    callbackName = 'L.DG.Jsonp.callback.' + callbackId;

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            query += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
        }
    }

    if (url.indexOf('?') === -1) {
        resUrl = url + '?' + query + 'callback=' + callbackName;
    } else {
        resUrl = url + '&' + query + 'callback=' + callbackName;
    }

    timer = setTimeout(function () {
        cancelCallback();
        error({ url: resUrl, event: 'Request timeout error' });
        complete({ url: resUrl, event: 'Request timeout error' }, 'timeout');
    }, timeout);

    L.DG.Jsonp.callback[callbackId] = function (data) {
        clearTimeout(timer);
        success(data);
        complete(data, 'success');
        removeScript(callbackId);
        delete L.DG.Jsonp.callback[callbackId];
    };

    script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.id = callbackId;

    script.onerror = /*window.onerror = */function (e) { // @todo for debug, remove before ending of Geoclicker development
        error({ url: resUrl, event: e });
        complete({ url: resUrl, event: e }, 'error');
        script.parentNode.removeChild(script);
        return true;
    };

    script.src = resUrl;
    beforeSend();
    head.appendChild(script);

    function cancelCallback() {
        removeScript(callbackId);
        if (L.DG.Jsonp.callback.hasOwnProperty(callbackId)) {
            L.DG.Jsonp.callback[callbackId] = function () {
            };
        }
    }

    function removeScript(callbackId) {
        var script = document.getElementById(callbackId);
        if (script && script.parentNode) {
            script.parentNode.removeChild(script);
        }
    }

    return {
        cancel: cancelCallback
    };
};

L.DG.Jsonp.callback = {};