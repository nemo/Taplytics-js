var log = require('./logger');

var CookieJar = require('cookiejar').CookieJar;
var Cookie = require('cookiejar').Cookie;
var CookieAccess = require('cookiejar').CookieAccessInfo;

var accessInfo = new CookieAccess();

exports.get = function(key) {
    var jar = getJar();
    var cookie = jar.getCookie(key, accessInfo);
    if (!cookie) return;

    return cookie.value;
};

exports.set = function(key, value, options) {
    if (!key)
        return;

    value   = value || "";
    options = options || {};

    var cookieToSet = keyValueToCookie(key, value, options.expires);
    var cookieStr = cookieToSet.toString();

    document.cookie = cookieStr;

    log.log("Setting cookies to:", cookieStr, log.DEBUG);
};

exports.expire = function(key) {
    exports.set(key, "-", {
        expires: new Date()
    });
};


function getJar() {
    var jar = new CookieJar();

    if (document.cookie && document.cookie.length) {
        var ca = document.cookie.split(';');
        var cValue;

        for (var i = 0; i < ca.length; i++) {
             cValue = ca[i];

            while (cValue.charAt(0) == ' ') cValue = cValue.substring(1);

            jar.setCookies(cValue);
        }
    }

    return jar;
}

function keyValueToCookie(key, value, expiration) {
    var cookieStr = key;
    if (value)
        cookieStr += "=" + value;

    var cookie = new Cookie(cookieStr);

    if (expiration)
        cookie.expiration_date = expiration;

    return cookie;
}
