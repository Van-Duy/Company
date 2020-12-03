$(document).ready(function () {
    let $btnSearch = $("button#btn-search");
    let $btnClearSearch = $("button#btn-clear-search");
    let pathname = window.location.pathname;
    let $inputSearchField = $("input[name  = search_field]");
    let $inputSearchValue = $("input[name  = search_value]");
    let $selectChangeAttr = $("select[name = select_change_attr]");

    $("a.select-field").click(function (e) {
        e.preventDefault();
 
        let field = $(this).data('field');
        let fieldName = $(this).html();
        $("button.btn-active-field").html(fieldName + ' <span class="caret"></span>');
        $inputSearchField.val(field);
    });

    $('#fill-category').change(function (e) { 
        var pathname = window.location.pathname;
        let searchParams = new URLSearchParams(window.location.search);
        let category_id = $(this).val();
        let link = "";
        params = ['filter_status'];
        $.each(params, function (key, param) { // filter_status
            if (searchParams.has(param)) {
                link += param + "=" + searchParams.get(param) + "&" // filter_status=active
            }
        });
        window.location.href = pathname + "?" + link + 'category_id=' + category_id;
    }); 

    $btnSearch.click(function () {

        var pathname = window.location.pathname;
        let params = ['filter_status'];
        let searchParams = new URLSearchParams(window.location.search); // ?filter_status=active

        let link = "";
        $.each(params, function (key, param) { // filter_status
            if (searchParams.has(param)) {
                link += param + "=" + searchParams.get(param) + "&" // filter_status=active
            }
        });

        let search_field = $inputSearchField.val();
        let search_value = $inputSearchValue.val();

        if (search_value.replace(/\s/g, "") == "") {
            alert("Nhập vào giá trị cần tìm !!");
        } else {
            window.location.href = pathname + "?" + link + 'search_field=' + search_field + '&search_value=' + search_value;
        }
    });

    $btnClearSearch.click(function () {
        var pathname = window.location.pathname;
        let searchParams = new URLSearchParams(window.location.search);

        params = ['filter_status'];

        let link = "";
        $.each(params, function (key, param) {
            if (searchParams.has(param)) {
                link += param + "=" + searchParams.get(param) + "&"
            }
        });

        window.location.href = pathname + "?" + link.slice(0, -1);
    });

    $('.btn-delete').on('click', function (e) {
        e.preventDefault();
        Swal.fire({
            title: 'Bạn chắc chắn muốn xóa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33', 
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                window.location = this.href;
            }
        })
    });

    $selectChangeAttr.on('change', function () {
        let thisSelect = $(this);
        let value = $(this).val();
        let url = $(this).data('url');
        $.get(url.replace('value_new', value),
            function (data) {
                thisSelect.notify('Cập nhật thành công!', {
                    className: 'success',
                    position: 'top center',
                });
            },
        );
    });
 
    changeItem = function (url) {
        $.get(url,
            function (data) {
                let thisSelect = data['status'] + '-' + data['id'];
                $('#' + thisSelect).html(data['htmlStatus'])
                $('#' + thisSelect + ' a').notify('Cập nhật thành công!', {
                    className: 'success',
                    position: 'top center',
                });
            }, 'json'
        );
    }

    // Change ordering event
    $('.chkOrdering').change(function () {
        $chkOrdering = $(this);
        let ordering = $(this).val();
        let id = $(this).attr('id');
        let url = pathname + '/change-ordering-' + ordering + '/' + id;
        if (ordering > 0) {
            $.get(url, function (data) {
                $chkOrdering.notify('Cập nhật thành công!', {
                    className: 'success',
                    position: 'top center',
                });
            });
        } else {
            toastr.error('Số thứ tự lớn hơn 0', 'Cảnh báo !!!')
        }

    });

    $('#name').change(function (e) {
        var name = $(this).val();
        if (name != '') {
            $.get(route('article/slug', {
                    'name': name
                }),
                function (data) {
                    $('#slug').val(data['slug']);
                }, "json");
        } else {
            $('#slug').val('');
        }
    });

    $('#save-form').click(function (e) {
        $('#main-form').submit();
    });

    $('#add-attr-form').click(function (e) {
        e.preventDefault();
        let name = prompt('thuộc tính cần thêm');
        if (name != null && name) {
            let id = to_slug(name)
            let key = Math.floor(Math.random() * 10000);
            $(this).before('<div class="form-group" id="attr-' + key + '"><label for="metaTitle" class="control-label col-md-3 col-sm-3 col-xs-12">' + name + '</label><div class="col-md-5 col-sm-5 col-xs-11"><input class="form-control col-md-6 col-xs-12" name="attribute[' + name + ']" type="text" id="' + id + '"></div><a href="javascript:deleteAttr(' + key + ');" class=" control-label btn btn-danger new-delete"><i class="fa fa-trash-o" aria-hidden="true"></i></a></div>');
            $(this).before('<script>$("#' + id + '").tagsInput({"height":"100px","width":"130px","delimiter": [";"],"defaultText":"",});</script>');
        }

    });

    $(function () {
        $("#sortable").sortable();
        $("#sortable").disableSelection();
    });


    $('.changeCode').click(function (e) {
        $('input[name=code]').val(random(12));
    });

    $('input[name="link-youtube"]').change(function (e) {
        $input = $(this);
        let url = $(this).data('url');
        let val = $(this).val();
        $.get(url, {
                'val': val
            },
            function (data) {
                notice($input, data.notice, data.class)
            }, 'json',
        );

    });

    console.log(route("home"));
    $('#attr_group_id').select2();

    Dropzone.autoDiscover = false;
    $("div#myDropzone").sortable({

        change: function (event, ui) {

            ui.placeholder.css({
                visibility: 'visible',
                border: '1px solid#337ab7'
            });

        }

    });
    $("div#myDropzone").dropzone({
        url: route("product/saveImg"),
        method: 'post',
        maxFiles: 8,
        addRemoveLinks: true,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
  
        },
        init: function () {
            var thisDropzone = this;
            var id = $('input[name=id]').val();
            if (id) {
                var url = route('product/getJsonImg', {
                    "name": id
                });
                $.getJSON(url, function (data) { // get the json response
                    $.each(data, function (key, value) {

                        var mockFile = {
                            name: value.name,
                            alt: value.alt
                        };
                        thisDropzone.options.addedfile.call(thisDropzone, mockFile);
                        thisDropzone.options.thumbnail.call(thisDropzone, mockFile, '/images/product/' + value.name);
                        mockFile.previewElement.classList.add('dz-success');
                        $(mockFile.previewElement).append('<input type="hidden" name="document[]" value="' + value.name + '">')
                        $(mockFile.previewElement).append('<input class="alt btn btn-xs btn-default" name="altThumb[]" type="text" placeholder="' + value.altThumb + '" value="' + value.altThumb + '"></input>')
                    });

                });
            }
        },

        success: function (file, response) {
            var imgName = response;
            $(file.previewElement).append('<input type="hidden" name="document[]" value="' + imgName.name + '">')
            $(file.previewElement).append('<input class="alt btn btn-xs btn-default" name="altThumb[]" type="text" placeholder="alt"></input>')
            file.previewElement.classList.add("dz-success");
        },
        error: function (file, response) {
            file.previewElement.classList.add("dz-error");
        }
    });


    $('input[name=back]').click(function (e) {
 
        $('input[name=back]').click(function (e) { 
            e.preventDefault();
            location.href = route('dashboard');

        });
    }); 
});

function to_slug(str) {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();

    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');

    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '-');

    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '');

    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '');

    // return
    return str;
}

function random(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function notice(main, data, notice) {
    return main.notify(data, {
        className: notice,
        position: 'top center',
    });
}
