$(function () {
        //用button触发
        $("#xFormbutton").click(function (e) {
            // e.preventDefault();
            alert("Form submitted!");
            //试一试POST和GET两种方式
            //MyAjaxSubmit();
            MyAjaxSubmit2();
        });
        //用表单的submit触发，两种皆可
        /*  $("#xForm").submit(function (e) {
              e.preventDefault();
              alert("Form submitted!");
              onSubmit();
          });*/
});




//POST版
function MyAjaxSubmit() {
    var formSerialized = $('#xForm').serialize();
    //这formSerialized的值TM是空的，我也不知道为什么，隔壁JSP,FreeMarker也没这问题啊, 怀疑是EJS模板的问题，最好看看官方EJS文档
    alert("(空的？)formSerialized: " + formSerialized);
    //POST:手动拼接，表单元素一般不多，直接手工取值就行，而且这样我觉得细节上更好操作
    //GET: type: 'POST'的jquey ajax, 必须在url里拼接参数
    var firstName = $("#firstname").val();
    var lastName = $("#lastname").val();
    var birthYear = $("#birthyear").val();
    var formData = {'firstName': firstName, 'lastName': lastName, 'birthYear': birthYear};
    var JSONData = JSON.stringify(formData);
    alert("JSONData: " + JSONData);
    $.ajax(
        {
            url: 'http://localhost:3000/test1',
            data: JSONData,
            contentType: 'application/json',
            type: 'POST',
            success: function (data) {
                alert("POST Ajax is successful, return data in success: function (data): \n" + data);
                //在这里使用JQuery或者JS把data里的值设置进HTML元素里去
                //如果是数组类型的Json用JS函数遍历一下设置列表或表格就行
                //注意res.json返回的不是json object,是个string
                alert("data typeof: " + typeof data);
                //转成json对象吧，省的字符串取值
                var dataJSON = JSON.parse(data);
                //Chrome里F12查看
                console.log(dataJSON);
                //直接取dataJSON里的a字段的值就行
                $("#ajaxData").text("咯咯哒POST：" + dataJSON.a);
            },
            error: function (xhr, status, error) {
                alert(error.message);
            }
        }
    );
}



//GET版
function MyAjaxSubmit2() {
    var formSerialized = $('#xForm').serialize();
    //这formSerialized的值TM是空的，我也不知道为什么，隔壁JSP,FreeMarker也没这问题啊, 怀疑是EJS模板的问题，最好看看官方EJS文档
    alert("(空的？)formSerialized: " + formSerialized);
    //POST:手动拼接，表单元素一般不多，直接手工取值就行，而且这样我觉得细节上更好操作
    //GET: type: 'POST'的jquey ajax, 必须在url里拼接参数
    var firstName = $("#firstname").val();
    var lastName = $("#lastname").val();
    var birthYear = $("#birthyear").val();
    var formData = {'firstName': firstName, 'lastName': lastName, 'birthYear': birthYear};
    var JSONData = JSON.stringify(formData);
    //序列化formData
    alert("JSONData: " + JSONData);
    $.ajax(
        {
            url: 'http://localhost:3000/test2',
            //注意：GET方式因为是URL传参，jquery ajax会自动把对象转成参数，不需要转JSON，conntentType也不需要设置
            data: formData,
            // contentType: 'application/json',
            type: 'GET',
            success: function (data) {
                alert("GET Ajax is successful, return data in success: function (data): \n" + data);
                //在这里使用JQuery或者JS把data里的值设置进HTML元素里去
                //如果是数组类型的Json用JS函数遍历一下设置列表或表格就行
                //注意res.json返回的不是json object,是个string
                alert("data typeof: " + typeof data);
                //转成json对象吧，省的字符串取值
                var dataJSON = JSON.parse(data);
                console.log(dataJSON);
                //直接取dataJSON里的a字段的值就行
                $("#ajaxData").text("咯咯哒GET: " + dataJSON.a);
            },
            error: function (xhr, status, error) {
                alert(error.message);
            }
        }
    );
}