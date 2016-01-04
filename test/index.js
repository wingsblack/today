/// <reference path="index.html" />

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


    var Q = {
        oriWidth: 640,
        oriHeight: 1136,
        drawRect: {
            x: 0,
            y: 0,
            width: 640,
            height:920
        },
        _scene: {},
        canvas: null,
        context: null,
        init: function () {
            var _this = this;

            this.canvas = $("canvas");
            if (!this.canvas.getContext) return alert("您的浏览器不支持");
            this.context = this.canvas.getContext("2d");
            Q.C.context = this.context;
            this.setSize();
            window.addEventListener("resize", function () {
                _this.resize();
            });
        },
        addScene: function (no, scene) {
            this._scene[no] = scene;
        },
        _currScene: null,
        goScene: function (no) {
            this._currScene = no;
            this._scene[no].onScene(this);
        },
        renderCurrent: function () {
            if (this._currScene != null && this._scene[this._currScene].render) {
                this._scene[this._currScene].render();
            }
        },
        getWinSize: function () {
            var result = {};
            var elm = document.documentElement;
            result.width = elm.clientWidth;
            result.height = elm.clientHeight;
            return result;
        },
        realSize: { width: 0, height: 0 },
        setSize: function () {
            var size = this.getWinSize();

            this.realSize.width = size.width;
            this.realSize.height = this.oriHeight / this.oriWidth * this.realSize.width;
            //alert(this.realSize.width + "____" + this.realSize.height);
            var body = $("body");
            body.style.width = this.canvas.style.width = this.realSize.width + "px";
            body.style.height = this.canvas.style.height = this.realSize.height + "px";
            this.canvas.width = this.oriWidth;
            this.canvas.height = this.oriHeight





        },
        resize: function () {
            this.setSize();
            this.renderCurrent();
        }

    }
    Q.P = parseInt(Math.random() * 10000000 + "");
    Q.N = "tc";
    Q.C = {
        context: null,
        transformWidth: function (value) {
            return parseInt(value / Q.oriWidth * Q.realSize.width);
        },
        transformHeight: function (value) {
            return parseInt(value / Q.oriHeight * Q.realSize.height);
        },
        clearRect: function (x, y, width, height) {
            x = this.transformWidth(x);
            y = this.transformHeight(y);
            width = this.transformWidth(width);
            height = this.transformHeight(height);
            this.context.clearRect(x, y, width, height);
        },
        drawImage: function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
            if (arguments.length == 3) {
                destX = sourceX;
                destY = sourceY;
                sourceX = sourceY = 0;
                sourceWidth = destWidth = image.width;
                sourceHeight = destHeight = image.height;
            } else if (arguments.length == 5) {
                destX = sourceX;
                destY = sourceY;
                destWidth = sourceWidth;
                destHeight = sourceHeight;
                sourceX = sourceY = 0;
                sourceWidth = image.width;
                sourceHeight = image.height;
            }

            //destX = this.transformWidth(destX);
            //destY = this.transformHeight(destY);
            //destWidth = this.transformWidth(destWidth);
            //destHeight = this.transformHeight(destHeight);

            this.context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        }
    }



    var isIphone = /IPhone/i.test(window.navigator.userAgent);
  

    Q.addScene(2, {
        onScene: function () {
            var _this = this;
            $("scene2").style.display = "block"
            $("mfile").onchange = function () {
                $("btn_paizhao").style.display = "none";
                $("btn_chongpai").style.display = $("btn_queren").style.display = "block"
                _this.showPreview(this);
            }
            $("btn_chongpai").onclick = function () {
                $("btn_paizhao").style.display = "block";
                $("btn_chongpai").style.display = $("btn_queren").style.display = "none";
                $("showPic").style.display = "none";
                _this.image = null;
                _this.render();
                $("mform").reset();
            }

            $("btn_queren").onclick = function () {
                $("btn_chongpai").style.display = $("btn_queren").style.display = "none";
                _this.save();
            }
            this.render();
        },

        image: null,
        save: function () {
            $("hidP").value = Q.P;
            $("hidN").value = Q.N;
            $("isIphone").value = isIphone ? "yes" : "";
            $("mform").submit();
        },
        showPreview: function (source) {
            var _this = this;
            var file = source.files[0];
            if (window.FileReader) {
                var fr = new FileReader();
                fr.onloadend = function (e) {
                    _this.image = new Image();
                    _this.image.onload = function () {
                        _this.render();
                    }
                    $("showPic").src = _this.image.src = e.target.result;


                };
                fr.readAsDataURL(file);
            }
        },
        suofang: function (nW, nH, b) {
            var tW = Q.drawRect.width, tH = Q.drawRect.height;
            var tB = tW / tH;
            //var nW = this.image.width, nH = this.image.height;
            var nB = nW / nH;
            var dW, dH, dX, dY;
            if (tB > nB) {
                dW = tW;
                dH = nH / nW * dW;
            } else {
                dH = tH;
                dW = nW / nH * dH;
            }

            dX = (tW - dW) / 2;
            dY = (tH - dH) / 2;

            return {
                bl: tB > nB,
                x: dX,
                y: dY,
                width: dW,
                height: dH
            }
        },
        mmm: null,
        pici: function (image, x, y, width, height, tx, ty, twidth, theight) {

            return;
            Q.context.drawImage(image, x, y, width, height, tx, ty, twidth, theight);


        },
        render: function () {
            Q.C.clearRect(0, 0, Q.oriWidth, Q.oriHeight);
            var size = Q.getWinSize();
            var bg = $("bg");

            Q.C.drawImage(bg, 0, 0);
            //Q.C.drawImage($("img_default"), 65, 77, 590, 994);


            if (this.image != null) {
                Q.C.clearRect(Q.drawRect.x, Q.drawRect.y, Q.drawRect.width, Q.drawRect.height);
                //alert(this.image.width + "_" + this.image.height);

                var sf = this.suofang(this.image.width, this.image.height);
                if (isIphone) {
                    sf = this.suofang(this.image.height, this.image.width);
                }

                $("showPic").style.width = Q.C.transformWidth(sf.width) + "px";
                $("showPic").style.height = Q.C.transformHeight(sf.height) + "px";
                $("showPic").style.left = Q.C.transformWidth(sf.x) + "px";
                $("showPic").style.top = Q.C.transformHeight(sf.y) + "px";
                $("showPic").style.display = "block"

            }
          



        }
    });




    window.onload = function () {
        Q.init();
        //Q._scene[2].image = $('img_test');
        Q.goScene(2);
        //Q._scene[2].save();
    }

}());