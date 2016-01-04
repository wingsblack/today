/// <reference path="share.html" />

(function () {

    var $ = function (id) { return document.getElementById(id); };
    $.ajax = function (obj) {
        var http = new XMLHttpRequest();
        obj.method = obj.method || "POST";
        http.open(obj.method, obj.url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status = 200) {
                    obj.success(http.responseText, http);
                } else {
                    obj.error(http);
                }
            }
        }
        http.send(obj.data);
    }

    function init() {
        var size = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }

        var realSize = {
            width: size.width,
            height: 1136 / 640 * size.width
        }

       
        $("body").style.height = realSize.height + "px";
        $("body").style.width = realSize.width + "px";


      

        
       
    }

    window.onload = init;

}());