$(function() {
    var form = layui.form;
    var layer = layui.layer;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        m = m < 10 ? 0 + 'm' : m;
        var d = dt.getDate();
        d = d < 10 ? 0 + 'd' : d;
        var hh = dt.getHours();
        hh = hh < 10 ? 0 + 'hh' : hh;
        var mm = dt.getMinutes();
        mm = mm < 10 ? 0 + 'mm' : mm;
        var ss = dt.getSeconds();
        ss = ss < 10 ? 0 + 'ss' : ss;
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
    }
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', // 文章分类的ID
        state: '' // 文章的发布状态
    };
    initTable();
    initCate();
    //  获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                    // 调用分页的方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败');
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render()
            }
        })
    }
    // 给筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault();
            // 获取表单中选中的值
            var cat_id = $('[name=cate_id]').val();
            var state = $('[name=state]').val();
            //修改查询对象q的属性赋值
            q.cate_id = cat_id;
            q.state = state;
            // 根据最新的筛选条件重新渲染表格的数据
            initTable()
        })
        // 定义渲染分页部分的方法
    function renderPage(total) {
        //执行一个laypage实例  渲染分页结构
        laypage.render({
            elem: pageBox, //注意，这里的 test1 是 ID，不用加 # 号

            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 10, 15]
        });

    }
    // 点击删除按钮，删除文章：
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length; // 获取删除按钮的个数
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功')
                        // 删除成功以后，先判断当前页面是否还有数据，如果没有数据的话先让页码减 1 再调用initTable 方法渲染页面
                    if (len === 1) {
                        // 如果len的值等于1，那么删除完毕之后页面就没有任何数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });

    })
})