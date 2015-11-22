$(function () {
    // Allow drag widget from Widget List to Sidebar
    $('.widget-list').sortable({
        connectWith: ".sidebar-widget",
        placeholder: "placeholder",
        helper: function (event, ui) {
            copyHelper = ui.clone().insertAfter(ui);
            return ui.clone();
        },
        stop: function (event, ui) {
            copyHelper && copyHelper.remove();
        },
        update: function (event, ui) {
            var dropItem = $(ui.item[0]);

            var li = $('<li id=""></li>');
            li.append('<div class="widget-item">' + dropItem.text().trim() + '</div>');
            li.append('<a href="#" class="fa fa-caret-down expand_arrow" onclick="return showDetail(this);"></a>');

            var ul = $(this);

            $.ajax({
                url: '/admin/widgets/add/' + dropItem.attr('data-alias')
            }).done(function (result) {
                if (result) {
                    // Render widget setting form after drop item
                    var new_box = $("<div class='box box-solid open'><div class='box-body'></div></div>");
                    new_box.find(".box-body").first().append(result);
                    new_box.find("form").first().append("<input type='hidden' name='sidebar' value='" + dropItem.parents('.box').first().attr('id') + "'>");
                    new_box.find("form").first().append("<input type='hidden' name='ordering' value='" + (ul.find("li").length + 1) + "'>");
                    li.append(new_box);
                    dropItem.after(li);
                }

                // Remove drop item
                dropItem.remove();
            });
        }
    });

    // Allow sort widgets in sidebar
    $(".sidebar-widget").sortable({
        connectWith: ".sidebar-widget",
        handle: ".widget-item",
        delay: 100,
        items: "li",
        placeholder: "placeholder",
        start: function (event, ui) {
            // Close open widget in sidebar
            var arrow = $(ui.item).children('a.expand_arrow');
            var box = $(ui.item).children('div.box');

            if (arrow.hasClass('fa-caret-down')) {
                arrow.removeClass('fa-caret-down').addClass('fa-caret-left');
            }

            if (box.hasClass('open')) {
                box.removeClass('open').addClass('close');
            }
        },
        sort: function () {
            $(this).removeClass("ui-state-default");
        },
        receive: function () {
            copyHelper = null;
            var ids = $(this).sortable('toArray');
            sorting(this, ids);
        },
        stop: function () {
            var ids = $(this).sortable('toArray');
            sorting(this, ids);
        }
    });
});

function showDetail(element, changeIcon) {
    var box = $(element).parents("li").find('.box').first();

    if (box.hasClass('open')) {
        box.removeClass('open');
        box.addClass('close');

        if (changeIcon == undefined) {
            $(element).removeClass('fa-caret-down');
            $(element).addClass('fa-caret-left');
        } else {
            var el = $(element).parents('li').find('a').first();
            $(el).removeClass('fa-caret-down');
            $(el).addClass('fa-caret-left');
        }
    } else {
        box.removeClass('close');
        box.addClass('open');

        if (changeIcon == undefined) {
            $(element).removeClass('fa-caret-left');
            $(element).addClass('fa-caret-down');
        }
    }

    return false;
}

function saveWidget(button) {
    var form = $(button).parents('form').first();
    var box = $(button).parents('.box').first();

    showBlock(box);

    $.ajax({
        type: 'POST',
        url: '/admin/widgets/save',
        data: form.serialize()
    }).done(function (id) {
        if (parseInt(id)) {
            form.find('input[name="id"]').val(id);
            form.find('input[name="ordering"]').remove();
        } else {
            console.log(id);
        }

        removeBlock(box);
        return false;
    }).fail(function (err) {
        console.log(err);
        removeBlock(box);
    });

    return false;
}

function removeWidget(button) {
    var id = $(button).parents('form').find('input[name="id"]').val();
    var box = $(button).parents('.box').first();

    if (id != '') {
        showBlock(box);

        $.ajax({
            type: 'POST',
            url: '/admin/widgets/delete',
            data: {id: id}
        }).done(function (result) {
            if (parseInt(result) == 1) {
                $(button).parents('li').first().remove();
            } else {
                alert('Fail to delete this widget!');
            }

            removeBlock(box);
            return false;
        }).fail(function (error) {
            console.log(error);
        });
    } else {
        $(button).parents('li').first().remove();
    }

    return false;
}

function sorting(element, ids) {
    var box = $(element).parents(".box").first();

    for (var i in ids) {
        if (ids[i] == '') {
            box.find("form").find("input[name='ordering']").val(parseInt(i) + 1);
        }
    }

    showBlock(box);

    $.ajax({
        url: '/admin/widgets/sort',
        type: 'POST',
        data: {
            ids: ids.join(','),
            sidebar: box.attr('id')
        }
    }).done(function (re) {
        removeBlock(box);
    }).fail(function(error){
        console.log(error);
        removeBlock(box);
    });
}

function showBlock(element) {
    $(element).append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
}

function removeBlock(element) {
    $(element).find(".overlay").remove();
}