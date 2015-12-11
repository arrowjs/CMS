﻿function removeDomainFromUrl(f) {
    return f.replace(/^https?:\/\/[^\/]+/i, "")
}
var IMG_PARAM = {
        URL: 0,
        TITLE: 1,
        ALT: 2,
        WIDTH: 3,
        HEIGHT: 4
    }, pluginPath = removeDomainFromUrl(CKEDITOR.plugins.get("slideshow").path),
    BASE_PATH = removeDomainFromUrl(CKEDITOR.basePath),
    SCRIPT_JQUERY = "https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js",
    SCRIPT_FANCYBOX = pluginPath + "3rdParty/fancybox2/jquery.fancybox.pack.js?v=2.1.5",
    CSS_FANCYBOX = pluginPath + "3rdParty/fancybox2/jquery.fancybox.css?v=2.1.5",
    SCRIPT_BX = pluginPath + "3rdParty/bxslider/jquery.bxslider.min.js",
    CSS_BX = pluginPath + "3rdParty/bxslider/jquery.bxslider.css";
function var_dump(f, i) {
    var j = "";
    i || (i = 0);
    for (var m = "", h = 0; h < i + 1; h++)m += "    ";
    if ("object" == typeof f)for (var l in f)h = f[l], "object" == typeof h ? (j += m + "'" + l + "' ...\n", j += var_dump(h, i + 1)) : j += m + "'" + l + "' => \"" + h + '"\n'; else j = "===>" + f + "<===(" + typeof f + ")";
    return j
}
var listItem = function (f) {
    return f.type == CKEDITOR.NODE_ELEMENT && f.is("li")
}, ULItem = function (f) {
    return f.type == CKEDITOR.NODE_ELEMENT && f.is("ul")
}, iFrameItem = function (f) {
    return f.type == CKEDITOR.NODE_ELEMENT && f.is("iframe")
};
Array.prototype.pushUnique = function (f) {
    for (var i = 0; i < this.length; i++)if (this[i][0] == f[0])return -1;
    this.push(f);
    return this.length - 1
};
Array.prototype.updateVal = function (f, i) {
    for (var j = 0; j < this.length; j++)if (this[j][0] == f)return this[j] = [f, i], !0;
    this[j] = [f, i];
    return !1
};
Array.prototype.getVal = function (f) {
    for (var i = 0; i < this.length; i++)if (this[i][0] == f)return this[i][1];
    return null
};
CKEDITOR.dialog.add("slideshowDialog", function (f) {
    function i(a, b, d, c, e) {
        a = h(a);
        c = c ? c.createElement("OPTION") : document.createElement("OPTION");
        if (a && c && "option" == c.getName())CKEDITOR.env.ie ? (isNaN(parseInt(e, 10)) ? a.$.options.add(c.$) : a.$.options.add(c.$, e), c.$.innerHTML = 0 < b.length ? b : "", c.$.value = d) : (null !== e && e < a.getChildCount() ? a.getChild(0 > e ? 0 : e).insertBeforeMe(c) : a.append(c), c.setText(0 < b.length ? b : ""), c.setValue(d)); else return !1;
        return c
    }

    function j(a) {
        return (a = h(a)) ? a.$.selectedIndex : -1
    }

    function m(a,
               b) {
        a = h(a);
        if (0 > b)return null;
        var d = a.getChildren().count();
        a.$.selectedIndex = b >= d ? d - 1 : b;
        return a
    }

    function h(a) {
        return a && a.domId && a.getInputElement().$ ? a.getInputElement() : a && a.$ ? a : !1
    }

    function l(a) {
        !0 != a.openCloseStep && (a.getContentElement("slideshowinfoid", "framepreviewid").isVisible() ? r(a) : p(a))
    }

    function s(a) {
        a = a.getContentElement("slideshowinfoid", "imglistitemsid");
        return j(a)
    }

    function p(a) {
        var b = a.getContentElement("slideshowinfoid", "imglistitemsid"), b = j(b), d = a.imagesList[b], b = a.getContentElement("slideshowinfoid",
            "imgtitleid"), b = h(b);
        b.setValue(d[1]);
        b = a.getContentElement("slideshowinfoid", "imgdescid");
        b = h(b);
        b.setValue(d[2]);
        b = a.getContentElement("slideshowinfoid", "imgpreviewid");
        b = h(b);
        b.setHtml('<div style="text-align:center;"> <img src="' + d[0] + '" title="' + d[1] + '" alt="' + d[2] + '" style=" max-height: 200px;  max-width: 350px;"> </div>');
        b = a.getContentElement("slideshowinfoid", "framepreviewid");
        a = a.getContentElement("slideshowinfoid", "imgparamsid");
        b = h(b);
        b.hide();
        a = h(a);
        a.show()
    }

    function r(a) {
        var b = a.getContentElement("slideshowinfoid",
            "framepreviewid"), d = a.getContentElement("slideshowinfoid", "imgparamsid"), d = h(d);
        d.hide();
        b = h(b);
        b.show();
        x(a)
    }

    function x(a) {
        var b = 400;
        !0 == a.params.getVal("showthumbid") ? b -= 120 : !0 == a.params.getVal("showcontrolid") && (b -= 30);
        if (0 != a.imagesList.length) {
            var d = a.getContentElement("slideshowinfoid", "imglistitemsid"), c = j(d);
            0 > c && (c = 0);
            var d = a.getContentElement("slideshowinfoid", "framepreviewid"), e = "", e = e + "<head>", e = e + ('<script src="' + SCRIPT_JQUERY + '" type="text/javascript"><\/script>'), e = e + ('<script type="text/javascript" src="' +
                SCRIPT_BX + '"><\/script>'), e = e + ('<link rel="stylesheet" type="text/css" href="' + CSS_BX + '" />');
            !0 == a.params.getVal("openOnClickId") && (e += '<link rel="stylesheet" type="text/css" href="' + CSS_FANCYBOX + '" />', e += '<script type="text/javascript" src="' + SCRIPT_FANCYBOX + '"><\/script>', e += '<script type="text/javascript">', e += t(a), e += "<\/script>");
            e += '<script type="text/javascript">';
            e += u(a, c, 436, b);
            e += "<\/script>";
            e += "</head>";
            e += "<body>";
            c = v(a);
            e += c.getOuterHtml();
            e += "</body>";
            e += "";
            d = h(d);
            (c = d.getFirst(iFrameItem)) &&
            c.remove();
            var f = null;
            !0 == a.params.getVal("showthumbid") ? b += 120 : !0 == a.params.getVal("showcontrolid") && (b += 30);
            a = CKEDITOR.dom.element.createFromHtml('<iframe style="width:496px;height:' + b + 'px;background:azure; " class="cke_pasteframe" frameborder="10"  allowTransparency="false" role="region" scrolling="no"></iframe>');
            a.setAttribute("name", "totoFrame");
            a.setAttribute("id", "totoFrame");
            a.on("load", function () {
                if (f == null) {
                    f = this.$;
                    if (f.contentDocument)iframedoc = f.contentDocument; else if (f.contentWindow)iframedoc =
                        f.contentWindow.document;
                    if (iframedoc) {
                        var a = iframedoc, b = e;
                        a.open();
                        a.writeln(b);
                        a.close()
                    } else alert("Cannot inject dynamic contents into iframe.")
                }
            });
            d.append(a)
        }
    }

    function n() {
        var a = this.getDialog();
        if (a.newSlideShowMode)a.slideshowDOM.setAttribute("data-" + this.id, this.getValue()); else switch (this.type) {
            case "checkbox":
                this.setValue("true" == a.slideshowDOM.getAttribute("data-" + this.id));
                break;
            case "text":
                this.setValue(a.slideshowDOM.getAttribute("data-" + this.id));
                break;
            case "select":
                this.setValue(a.slideshowDOM.getAttribute("data-" +
                    this.id))
        }
    }

    function k() {
        var a = this.getDialog();
        a.params.updateVal(this.id, this.getValue());
        l(a)
    }

    function w(a) {
        a.previewImage && (a.previewImage.removeListener("load", q), a.previewImage.removeListener("error", o), a.previewImage.removeListener("abort", o), a.previewImage.remove(), a.previewImage = null);
        a.imagesList = null;
        a.params = null;
        a.slideshowDOM = null;
        for (var b = combo = a.getContentElement("slideshowinfoid", "imglistitemsid"), b = h(b); b.getChild(0) && b.getChild(0).remove(););
        a.openCloseStep = !1
    }

    function y(a) {
        for (var b =
            ""; b.length < a;)b += Math.random().toString(36).substring(2);
        return b.substring(0, a)
    }

    function u(a, b, d, c) {
        var e = "ad-gallery_" + a.params.getVal("slideshowid"), f, g = "";
        f = "(function($) {$(function() {";
        0 == d && (d = "false");
        0 == c && (c = a.params.getVal("pictheightid"));
        !1 == a.params.getVal("showtitleid") && (g = ",  hooks: { displayDescription: function(image) {}}");
        //b = "loader_image: '" + pluginPath + "3rdParty/ad-gallery/loader.gif', width:" + d + ", height:" + c + ", start_at_index: " + b + ", animation_speed: " + a.params.getVal("animspeedid") +
        //    g + ", update_window_hash: false, effect: '" + a.params.getVal("transitiontypeid") + "',";
        //a = " slideshow: { enable: true, autostart: " + a.params.getVal("autostartid") + ", speed: " + 1E3 * a.params.getVal("speedid") + ",},";
        //return f + ("   var galleries = $('#" + e + "').adGallery({" + b + a + "});") + "});})(jQuery);"
        b = "mode: '" + a.params.getVal("transitiontypeid") + "', " +
            "speed: " + a.params.getVal("animspeedid") + ", " +
            "captions: " + a.params.getVal("showtitleid") + ", " +
            "autoStart: " + a.params.getVal("autostartid") + ", " +
            "slideWidth: " + a.params.getVal("pictheightid") + ", preloadImages: 'all'";

        if (a.params.getVal("showcontrolid")) {
            b += ", auto: true, autoControls: " + a.params.getVal("showcontrolid");
        }
        if (a.params.getVal("showthumbid")) {
            b += ", pagerCustom: '#bx-pager'";
        }

        return f + ("   var galleries = $('#" + e + "').bxSlider({" + b + "});") + "});})(jQuery);"
    }

    function t(a) {
        a = "ad-gallery_" + a.params.getVal("slideshowid");
        return "(function($) {$(function() {" + ('$("#' + a + '").on("click",".ad-image",function(){') + "var imgObj =$(this).find(\"img\");var isrc=imgObj.attr(\"src\");var ititle=null;var idesc=null;var iname=isrc.split('/');iname=iname[iname.length-1];var imgdescid=$(this).find(\".ad-image-description\");if(imgdescid){ititle=$(this).find(\".ad-description-title\");if(ititle)ititle=ititle.text();if(ititle!='')ititle='<big>'+ititle+'</big>';idesc=$(this).find(\"span\");if(idesc)idesc=idesc.text();if(idesc!=''){if(ititle!='')ititle=ititle+'<br>';idesc='<i>'+idesc+'</i>';}}$.fancybox.open({href:isrc,beforeLoad:function(){this.title=ititle+idesc;},});});});})(jQuery);"
    }

    function v(a) {
        var b = a.params.getVal("slideshowid"), d = "ad-gallery_" + b, c = "display: block;", e = "display: block;";
        !1 == a.params.getVal("showthumbid") && (c = "display: none;");
        !1 == a.params.getVal("showcontrolid") && (e = "visibility: hidden;");
        var g = f.document.createElement("div");
        g.setAttribute("id", b);
        g.setAttribute("class", "slideshowPlugin");
        g.setAttribute("contenteditable", "false");
        b = g.append("ul");
        b.setAttribute("class", "bxslider");
        b.setAttribute("contenteditable", "false");
        b.setAttribute("id", d);

        for (e = 0; e < a.imagesList.length; e++)c = b.append("li"), c.setAttribute("contenteditable", "false"), spanDom = c.append("span"), spanDom.setAttribute("class", "vertical-span"), newImgDOM = c.append("img"), newImgDOM.setAttribute("src", removeDomainFromUrl(a.imagesList[e][IMG_PARAM.URL])), newImgDOM.setAttribute("title", a.imagesList[e][IMG_PARAM.TITLE]), newImgDOM.setAttribute("alt", a.imagesList[e][IMG_PARAM.ALT]), newImgDOM.setAttribute("contenteditable",
            "false");

        if (a.params.getVal("showthumbid")) {
            b = g.append('div');
            b.setAttribute('id', 'bx-pager');
            b.setAttribute("contenteditable", "false");
            for (e = 0; e < a.imagesList.length; e++) {
                c = b.append("a"), c.setAttribute("contenteditable", "false"), c.setAttribute('data-slide-index', e), newImgDOM = c.append("img"), newImgDOM.setAttribute("src", removeDomainFromUrl(a.imagesList[e][IMG_PARAM.URL])), newImgDOM.setAttribute("contenteditable", "false");
            }
        }
        return g
    }

    var g = f.lang.slideshow, q = function () {
        var a = this.previewImage;
        a.removeListener("load", q);
        a.removeListener("error", o);
        a.removeListener("abort", o);
        a = BASE_PATH + "plugins/slideshow/icons/placeholder.png";
        1 == this.imagesList.length && this.imagesList[0][IMG_PARAM.URL] == a && (a = this.getContentElement("slideshowinfoid", "imglistitemsid"), a = h(a), this.imagesList.splice(0,
            1), a.getChild(0).remove());
        var b = this.previewImage, a = b.$.src, b = b.$.width / b.$.height, d = 50, c = 50;
        1 < b ? c /= b : d *= b;
        b = this.imagesList.pushUnique([a, "", "", d.toFixed(0), c.toFixed(0)]);
        0 <= b && (oOption = i(combo, "IMG_" + b + " : " + a.substring(a.lastIndexOf("/") + 1), a, this.getParentEditor().document), m(combo, b), l(this))
    }, o = function () {
        var a = this.previewImage;
        a.removeListener("load", q);
        a.removeListener("error", o);
        a.removeListener("abort", o)
    };
    return {
        title: g.dialogTitle, width: 500, height: 600, resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        buttons: [CKEDITOR.dialog.okButton(f, {label: "OkCK", style: "display:none;"}), CKEDITOR.dialog.cancelButton, {
            id: "myokbtnid",
            type: "button",
            label: "OK",
            title: "Button description",
            style: "color:white;background:blue;",
            accessKey: "C",
            disabled: !1,
            onClick: function () {
                var a = this.getDialog(), b = {};
                a.openCloseStep = !0;
                a.commitContent(a);
                for (var d = v(a), c = 0; c < a.params.length; c++)d.data(a.params[c][0], a.params[c][1]);
                c = CKEDITOR.document.createElement("script", {
                    attributes: {
                        type: "text/javascript",
                        src: SCRIPT_BX
                    }
                });
                d.append(c);
                !0 == a.params.getVal("openOnClickId") && (c = CKEDITOR.document.createElement("script", {attributes: {type: "text/javascript"}}), c.setText("(function($) { $('head').append('<link rel=\"stylesheet\" href=\"" + CSS_FANCYBOX + '" type="text/css" />\'); })(jQuery);'), d.append(c), c = CKEDITOR.document.createElement("script", {
                    attributes: {
                        type: "text/javascript",
                        src: SCRIPT_FANCYBOX
                    }
                }), d.append(c), c = CKEDITOR.document.createElement("script", {attributes: {type: "text/javascript"}}), c.setText(t(a)), d.append(c));
                c = CKEDITOR.document.createElement("script",
                    {attributes: {type: "text/javascript"}});
                c.setText("(function($) { $('head').append('<link rel=\"stylesheet\" href=\"" + CSS_BX + '" type="text/css" />\'); })(jQuery);');
                d.append(c);
                c = CKEDITOR.document.createElement("script", {attributes: {type: "text/javascript"}});
                c.setText(u(a, 0, 0, 0));
                d.append(c);
                a.imagesList.length && (b.backgroundImage = 'url("' + a.imagesList[0][IMG_PARAM.URL] + '")');
                b.backgroundSize = "50%";
                b.display = "block";
                d = f.createFakeElement(d, "cke_slideShow", "slideShow", !1);
                d.setAttributes({});
                d.setStyles(b);
                a.fakeImage ? (d.replace(a.fakeImage), f.getSelection().selectElement(d)) : f.insertElement(d);
                w(a);
                a.hide()
            }
        }], contents: [{
            id: "slideshowinfoid",
            label: "Basic Settings",
            align: "center",
            elements: [{
                type: "text", id: "id", style: "display:none;", onLoad: function () {
                    this.getInputElement().setAttribute("readOnly", !0)
                }
            }, {
                type: "text", id: "txturlid", style: "display:none;", label: g.imgList, onChange: function () {
                    var a = this.getDialog(), b = this.getValue();
                    if (0 < b.length) {
                        var d = a.previewImage;
                        d.on("load", q, a);
                        d.on("error", o, a);
                        d.on("abort",
                            o, a);
                        d.setAttribute("src", b)
                    }
                }
            }, {
                type: "button",
                id: "browse",
                hidden: "true",
                style: "display:inline-block;margin-top:0px;",
                filebrowser: {
                    action: "Browse",
                    target: "slideshowinfoid:txturlid",
                    url: f.config.filebrowserImageBrowseUrl || f.config.filebrowserBrowseUrl
                },
                label: g.imgAdd
            }, {
                type: "hbox",
                align: "center",
                children: [{
                    type: "html",
                    id: "helpLabel",
                    html: '<p style="color: #919191;font-size: 16px;font-weight: bold;">Please select the images have same height and width</p>'
                }]
            }, {
                type: "vbox",
                align: "center",
                children: [{
                    type: "html",
                    align: "center",
                    id: "framepreviewtitleid",
                    style: "font-family: Amaranth; color: #1E66EB;\tfont-size: 20px; font-weight: bold;",
                    html: "Preview"
                }, {
                    type: "html", id: "framepreviewid", align: "center",
                    style: "width:500px;height:320px", html: ""
                }
                    , {
                        type: "hbox",
                        id: "imgparamsid",
                        style: "display:none;width:500px;",
                        height: "325px",
                        children: [{
                            type: "vbox",
                            align: "center",
                            width: "400px",
                            children: [{
                                type: "text", id: "imgtitleid", label: g.imgTitle, onChange: function () {
                                    if (this.getValue()) {
                                        var a = this.getDialog(), b = this.getValue();
                                        a.imagesList[s(a)][IMG_PARAM.TITLE] = b;
                                        p(a)
                                    }
                                }
                            }, {
                                type: "text", id: "imgdescid", label: g.imgDesc, onChange: function () {
                                    if (this.getValue()) {
                                        var a = this.getDialog(), b = this.getValue();
                                        a.imagesList[s(a)][IMG_PARAM.ALT] =
                                            b;
                                        p(a)
                                    }
                                }
                            }, {
                                type: "html",
                                id: "imgpreviewid",
                                style: "width:400px;height:200px;",
                                html: "<div>xx</div>"
                            }]
                        }]
                    }, {
                        type: "hbox", align: "center", height: 110, widths: ["25%", "50%"], children: [{
                            type: "vbox",
                            children: [{
                                type: "checkbox",
                                id: "autostartid",
                                label: g.autoStart,
                                "default": "checked",
                                style: "margin-top:15px;",
                                onChange: k,
                                commit: k,
                                setup: n
                            }, {
                                type: "checkbox",
                                id: "showtitleid",
                                label: g.showTitle,
                                "default": "checked",
                                onChange: k,
                                commit: k,
                                setup: n
                            }, {
                                type: "checkbox",
                                id: "showcontrolid",
                                label: g.showControls,
                                "default": "checked",
                                onChange: k,
                                commit: k,
                                setup: n
                            }
                                //    ,
                                //    {
                                //    type: "checkbox",
                                //    id: "showthumbid",
                                //    label: g.showThumbs,
                                //    "default": "checked",
                                //    onChange: k,
                                //    commit: k,
                                //    setup: n
                                //}
                            ]
                        }, {
                            type: "select",
                            id: "imglistitemsid",
                            label: g.picturesList,
                            multiple: !1,
                            style: "height:120px;width:250px",
                            items: [],
                            onChange: function () {
                                for (var a = this, b = a.getDialog(), a = h(a), d = 0, c = 0; c < a.getChildren().count(); c++) {
                                    var e = a.getChild(c);
                                    if (e.$.selected) {
                                        selectefItem = e;
                                        d = c;
                                        break
                                    }
                                }
                                m(a,
                                    d);
                                l(b)
                            }
                        }, {
                            type: "vbox",
                            children: [{
                                type: "button",
                                id: "previewbtn",
                                style: "margin-top:15px;margin-left:25px;",
                                label: g.previewMode,
                                onClick: function () {
                                    r(this.getDialog())
                                }
                            }, {
                                type: "button",
                                id: "removeselectedbtn",
                                style: "margin-left:25px;",
                                label: g.imgDelete,
                                onClick: function () {
                                    for (var a = this.getDialog(), b = a.getContentElement("slideshowinfoid", "imglistitemsid"), b = h(b), d = !1, c = b.getChildren().count() - 1; 0 <= c; c--)b.getChild(c).$.selected && (a.imagesList.splice(c, 1), b.getChild(c).remove(), d = !0);
                                    d && (0 == a.imagesList.length &&
                                    (d = BASE_PATH + "plugins/slideshow/icons/placeholder.png", oOption = i(b, "IMG_0 : " + d.substring(d.lastIndexOf("/") + 1), d, a.getParentEditor().document), a.imagesList.pushUnique([d, g.imgTitle, g.imgDesc, "50", "50"])), m(b, 0), l(a))
                                }
                            }, {
                                type: "button",
                                id: "editselectedbtn",
                                style: "margin-left:25px;",
                                label: g.imgEdit,
                                onClick: function () {
                                    p(this.getDialog())
                                }
                            }]
                        }]
                    }, {
                        type: 'vbox',
                        children: [{
                            type: 'html',
                            html: '<p></p>'
                        }]
                    },
                    {
                        type: "hbox", children: [{
                        type: "text",
                        id: "pictheightid",
                        label: "Max width (px)",
                        maxLength: 3,
                        style: "width:100px;",
                        "default": "800",
                        onChange: function () {
                            !1 == /^\d+$/.test(this.getValue()) &&
                            this.setValue(800);
                            this.getDialog().params.updateVal(this.id, this.getValue());
                            l(this.getDialog())
                        },
                        commit: k,
                        setup: n
                    }, {
                        type: "text",
                        id: "animspeedid",
                        label: "Transition Time (ms)",
                        style: "width:100px;",
                        maxLength: 4,
                        "default": "500",
                        onChange: function () {
                            !1 ==
                            /^\d+$/.test(this.getValue()) && this.setValue(500);
                            this.getDialog().params.updateVal(this.id, this.getValue());
                            l(this.getDialog())
                        },
                        commit: k,
                        setup: n
                    }, {
                        type: "select",
                        id: "transitiontypeid",
                        label: g.transition,
                        items: [["Horizontal", "horizontal"], ["Vertical", "vertical"], ["Fade", "fade"]],
                        "default": "horizontal",
                        style: "width:100px;",
                        commit: k,
                        setup: n,
                        onChange: k
                    }]
                    }]
            }]
        }], onLoad: function () {
        }, onShow: function () {
            this.dialog = this;
            this.slideshowDOM = null;
            this.openCloseStep = !0;
            var a = this.fakeImage = null;
            this.imagesList = [];
            this.params = [];
            this.previewImage = f.document.createElement("img");
            this.okRefresh = !0;
            var b = this.getSelectedElement();
            b && (b.data("cke-real-element-type") && "slideShow" == b.data("cke-real-element-type")) && (this.fakeImage = b, a = f.restoreRealElement(b));
            if (a) {
                this.slideshowDOM = a;
                b = a.getElementsByTag("ul");
                b = null == b ? null : 1 == b.count() ? b.getItem(0) : null;
                if (null == b)return alert("BIG Problem slideShowContainer !!"), !1;
                var d = a.getAttribute("id");
                if (null == d)return alert("BIG Problem slideshowid !!"),
                    !1;
                this.params.push(["slideshowid", d]);
                var c, e, h, j = b.$.getElementsByTagName("img");
                combo = this.getContentElement("slideshowinfoid", "imglistitemsid");
                for (b = 0; b < j.length; b++) {
                    c = j[b];
                    d = c.src;
                    e = c.width;
                    0 == e && (e = c.naturalWidth);
                    if (0 == e)h = e = 50; else if (h = c.height, 0 == h && (h = c.naturalHeight), 0 == h)h = e = 50;
                    e /= h;
                    var k = h = 50;
                    1 < e ? k /= e : h *= e;
                    c = this.imagesList.pushUnique([d, c.title, c.alt, h, k]);
                    0 <= c && (oOption = i(combo, "IMG_" + c + " : " + d.substring(d.lastIndexOf("/") + 1), d, this.getParentEditor().document))
                }
                m(combo, 0);
                l(this);
                a = a.$.dataset;
                for (param in a)this.params.push([param, a[param]]);
                this.setupContent(this, !0);
                this.newSlideShowMode = !1
            } else this.params.push(["slideshowid", "cke_" + y(8) + "_slideShow"]), combo = this.getContentElement("slideshowinfoid", "imglistitemsid"), a = BASE_PATH + "plugins/slideshow/icons/placeholder.png", oOption = i(combo, "IMG_0 : " + a.substring(a.lastIndexOf("/") + 1), a, this.getParentEditor().document), this.imagesList.pushUnique([a, g.imgTitle, g.imgDesc, "50", "50"]), m(combo, 0), l(this), this.commitContent(this);
            this.openCloseStep = !1;
            r(this)
        }, onOk: function () {
            return !1
        }, onHide: function () {
            w(this)
        }
    }
});