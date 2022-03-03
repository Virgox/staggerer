$(function() {
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }

    })
    initUserInfo();
    // 初始化用户基本信息的函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置表单数据,实现重置按钮功能
    $('#btnReset').on('click', function(e) {
            e.preventDefault();
            initUserInfo();
        })
        // 更新用户的基本信息,实现提交修改功能的实现
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败! ');
                }
                layer.msg('修改用户信息成功! ');
                window.parent.getUserInfo();
            }
        })
    })

})