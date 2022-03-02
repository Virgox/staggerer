$(function() {
        // 获取用户信息
        getUserInfo();
        var layer = layui.layer;
        // 实现退出功能
        $('#btnLogout').on('click', function() {
            // 提示是否退出登录
            layer.confirm('确定退出 ?', { icon: 3, title: '提示' }, function(index) {
                // 清空本地存储的token
                localStorage.removeItem('token');
                location.href = 'login.html';
                layer.close(index);
            });
        })
    })
    // 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        // 不管成功还是失败都会调用complete 函数
        // complete: function(res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空本地存储 
        //         localStorage.removeItem('token');
        //         console.log(1);
        //         // 强制返回登录页
        //         location.href = 'login.html'
        //     }
        // }
    })
}
// 渲染用户信息
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    // 渲染用户名称
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 判断并按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    };
}