/**
 * Created by vhchung on 6/9/15.
 */
(function ($) {
    "use strict";

    $.callAvatarModal = function (elem, opts) {
        var defaults = {
            root: '/img/avatar-gallery/',
            input_elem: 'input[name=avatar]',
            preview_elem: '#preview',
            form: '#edit-form'
        };

        opts = $.extend({}, defaults, opts);

        var fnc = '<script>function selectAvatar() {'+
            'var img = $("#avt-upload-zone img").attr("src");'+
            'var src;'+
            'if(!img)'+
                'src = $(".avt-choose img").attr("src");'+
            'else src = img;'+
            'if(!src) return false;'+
            'if(!img) $("' + opts.input_elem + '").val(src);'+
            '$("' + opts.preview_elem + '").attr("src", src);'+
            '$("#avt-upload-zone img").attr("src", "");' +
            '$("#avt-gallery-modal").modal("hide");'+
        '}</script>';
        var body = $('body');
        body.append(fnc);

        // bootstrap modal show avatar gallery for user
        var modal =
            '<div class="modal fade" id="avt-gallery-modal" tabindex="-1" aria-hidden="true">' +
                '<div class="modal-dialog">' +
                    '<div class="row">' +
                        '<div class="modal-content col-md-12 col-sm-12">' +
                            '<div class=row>' +
                                '<div class="modal-header col-md-12 col-sm-12">' +
                                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
                                    '<h4 class="modal-title">Thiết lập ảnh đại diện</h4>' +
                                '</div>' +
                                '<div class="modal-body col-md-12 col-sm-12" id="avatar-body">' +
                                    '<ul class="nav nav-tabs" role="tablist" id="avt-tab">' +
                                        '<li role="presentation" class="active"><a href="#avt-upload-tab" aria-controls="avt-upload-tab" role="tab" data-toggle="tab">Đăng ảnh lên</a></li>' +
                                        '<li role="presentation"><a href="#avt-gal-tab" aria-controls="avt-gal-tab" role="tab" data-toggle="tab">Chọn từ thư viện ảnh</a></li>' +
                                    '</ul>' +
                                    '<div class="tab-content">' +
                                        '<div role="tabpanel" class="tab-pane fade in active" id="avt-upload-tab">' +
                                            '<div id="image-cropper" class="col-md-6 col-sm-6">' +
                                                '<!-- The preview container is needed for background image to work -->' +
                                                '<div class="select-btn-wrap">' +
                                                    '<a class="select-image-btn btn btn-primary"><i class="fa fa-upload"></i> Đăng ảnh mới</a>' +
                                                    '<a class="save-image-btn btn btn-success"><i class="fa fa-save"></i> Lưu làm ảnh đại diện</a>' +
                                                '</div>' +
                                                '<div class="cropit-image-preview-container">' +
                                                    '<div class="cropit-image-preview"></div>' +
                                                    '<input type="range" class="cropit-image-zoom-input" />' +
                                                '</div>' +
                                                '<input type="file" class="cropit-image-input" />' +
                                            '</div>' +
                                            '<div id="avt-upload-zone" class="col-md-6 col-sm-6">' +
                                                '<span class="help-block">Xem trước</span>' +
                                                '<img class="img img-thumbnail" src="" id="avt-upload-preview">' +
                                            '</div>' +
                                        '</div>' +
                                        '<div role="tabpanel" class="tab-pane fade" id="avt-gal-tab">' +
                                            '<div id="avt-wrap"></div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="modal-footer col-md-12 col-sm-12">' +
                                    '<button type="button" class="btn default" data-dismiss="modal">Hủy</button> ' +
                                    '<button type="button" class="btn btn-danger" onclick="return selectAvatar()">Đồng ý</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div><style>img#avt-upload-preview[src=""]{display: none;}</style>';
        body.append(modal);
        $('#avt-tab a:first').tab('show');
        $.ajax({
            url: '/admin/users/avatar',
            method: 'POST',
            data: {
                root_path: opts.root
            },
            success: function(files) {
                files.forEach(function (f) {
                    var path =  opts.root + f;
                    var img = '<div class="avt-item">' +
                        '<img src="' + path + '" class="img img-thumbnail">' +
                        '</div>';
                    $('#avt-wrap').append(img);
                });
            },
            error: function(err) {
                console.log(err);
            }
        });
        elem.click(function() {
            var imgcroper = $('#image-cropper');
            imgcroper.cropit({ imageBackground: true });
            imgcroper.cropit('previewSize', { width: 150, height: 150 });
            $('#avt-gallery-modal').modal('show');
        });
        $('.select-image-btn').click(function() {
            $('.cropit-image-input').click();
        });
        $('.save-image-btn').click(function(){
            var src = $('#image-cropper').cropit('export', {
                type: 'image/png',
                quality: .9,
                originalSize: false
            });
            $('#avt-upload-preview').attr("src", src);
        });
        $(document).on('click', '.avt-item img', function() {
            $('.avt-choose').removeClass('avt-choose');
            $(this).parent().addClass('avt-choose');
        });
        $(document).on('dblclick', '.avt-item img', function() {
            $('.avt-choose').removeClass('avt-choose');
            $(this).parent().addClass('avt-choose');
            var src = $(".avt-choose img").attr("src");
            $(opts.preview_elem).attr("src", src);
            $(opts.input_elem).val(src);
            $("#avt-gallery-modal").modal("hide");
        });
        
        $(opts.form).submit(function () {
            var form = $(opts.form);
            var img = $(opts.preview_elem).attr("src");
            if (img && img != '' && img.indexOf('data:image\/png;base64,') !== -1) {
                var img_base64 = $("<input>")
                    .attr("type", "hidden")
                    .attr("name", "base64").val(img);
                form.append($(img_base64));
            }
        });
    };
}(jQuery));



