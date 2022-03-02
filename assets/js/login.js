$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    });
    $('#link_login').on('click', function() {
            $('.reg-box').hide()
            $('.login-box').show()
        })
        // 自定义 表单验证
        // 1、先从LayUI中 获取  form对象
    var form = layui.form;
    var layer = layui.layer;
    //  2、 通过form.verify()函数自定义校验规则
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
            // 校验两次密码是否输入一致
            repwd: function(value) {
                // value 确认密码框中的内容
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码输入不一致,请重新输入'
                }
            }
        })
        //侦听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault()
            $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function(res) {
                if (res.status !== 0) {
                    return layer.alert(res.message);
                }
                layer.alert('注册成功 请登录!')
                $('#link_login').click()
            })
        })
        // 侦听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                    //将返回的token值存储到本地
                localStorage.setItem('token', res.token)
                location.href = 'index.html';
            }
        })
    })
})