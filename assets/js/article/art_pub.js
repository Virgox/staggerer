$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    //   定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 00) {
                    return layer.msg('初始化文章失败')
                }
                var htmlStr = template('ipt-cate', res)
                $('[name=cate_id]').html(htmlStr);
                form.render()
            }
        })
    }
    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 通过选择封面按钮间接给 隐藏的选择文件按钮激活绑定事件
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();
        })
        // 监听选择文件的change事件，获取用户选择文件的列表
    $('#coverFile').on('change', function(e) {
            // 获取到文件的列表数组
            var files = e.target.files;
            if (files.length === 0) {
                return layer.msg('请选择文件')
            }
            var newImgURL = URL.createObjectURL(files[0]);
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿按钮，绑定事件处理函数
    $('#btnSave2').on('click', function() {
            art_state = '草稿';
        })
        // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            // 2、 基于form表单，快速创建一个FormData对象
            // 注意，FormData对象传数据需要使用DOM元素
        var fd = new FormData($(this)[0]) //  在jQ选择器后面添加[0]，就可以转化为DOM对象
            //  此时fd里面已经存储的有部分内容了
            // 将发布状态存到fd
        fd.append('state', art_state)
            //  封面裁剪过后的文件，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)
            })
            //  发起请求，上传文件
        publishArticle(fd);
    })
})

function publishArticle(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd, //  如果是向服务器发送的data数据格式，必须要添加以下两个配置项：
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败')
            }
            layer.msg('发布文章成功')
            location.href = '/article/art_list.html'
        }
    })
}