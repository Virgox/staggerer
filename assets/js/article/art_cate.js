$(function() {
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
            // 弹出层会返回一个数值，用于关闭弹出层使用，我们声明一个全局变量，
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            })
        })
        // 因为#form-add是我们后来通过其他方式添加的，所以不能直接绑定提交事件，要通过代理的方式
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败')
                }
                initArtCateList();
                layer.msg('添加成功');
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        })
    })
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                form.val('form-edit', res.data)
            }
        })
    })
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })
    $('tbody').on('click', '.btn-delete', function() {
        var indexRemove = $(this).siblings('.btn-edit').attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + indexRemove,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })
})