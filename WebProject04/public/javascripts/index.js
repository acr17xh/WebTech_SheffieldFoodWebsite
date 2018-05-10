$(function () {
    $("#search").click(function () {
        PostKeyword();
    });
});

//get the all matching keyword restaurants
function PostKeyword() {
    var keyword = $("#keyword").val();
    var Formdata = {
        "keyword": keyword
    };
    $.ajax({
        url:"http://localhost:3000/restaurants/restaurants",
        data:Formdata,
        type:'GET',
        success: function (data) {
            alert("GET Ajax is successful, return data in success: function (data): \n" + data);
            //在这里使用JQuery或者JS把data里的值设置进HTML元素里去
            //如果是数组类型的Json用JS函数遍历一下设置列表或表格就行
            //res.json返回的是json object
            console.log(data);
            var num = data.length;
            if (num != 0){
                for (var i = 0; i < num; i++) {
                    console.log(i);

                    //GenerateSection used to show data returned from ajax
                    GenerateSection(data[i].official_photo_url,data[i].restaurant_name,data[i].type_of_cuisine,
                        data[i].description,data[i].address,data[i].restaurant_rating);

                    //OMG!:选择ajaxData里面最后一个h3(也就是restaurant name)前面加上标号;
                    // 因为每次最后一个是最新添加的
                    $("#ajaxData h3:last").prepend(i+1 + ". ");
                }
            }

            else {alert("Sorry, no restaurant matching your condition...")}
        },
        error: function (xhr, status, error) {
            alert("wrong");
            alert(error.message);
        }
    })
}

//generate display area via ajax
function GenerateSection(img_path,para_name,para_type,para_discription,para_address,para_rating){
    //Built rely on the html document from chu xi
    var section = $("<section></section>");
    var container_div = $("<div class='container'></div>");
    var row_div = $("<div class='row align-items-center'></div>");
    var col_div = $("<div class='col-lg-6'></div>");
    var p5_div = $("<div class='p-5'></div>");
    var img = $("<img class='img-fluid rounded-circle'>");

    var another_col_div = $("<div class='col-lg-6'></div>");
    var another_p5_div = $("<div class='p-5'></div>");
    var restname = $("<h3 class='display-4'></h3>");
    var foodtype = $("<h4>Food type: </h4>");
    var discription = $("<p>Description: </p>");
    var address = $("<p>Address: </p>");
    var rating = $("<p>Rating: </p>");

    var butt = $(" <input type=\"button\" class=\"btn btn-primary btn-lg\" value=\"Have a look!\">");

    img.attr("src", img_path);

    p5_div.append(img);
    col_div.append(p5_div);
    row_div.append(col_div);
    container_div.append(row_div);
    section.append(container_div);

    restname.append(para_name);
    foodtype.append(para_type);
    discription.append(para_discription);
    address.append(para_address);
    rating.append(para_rating);

    another_p5_div.append(restname);
    another_p5_div.append(foodtype);
    another_p5_div.append(discription);
    another_p5_div.append(address);
    another_p5_div.append(rating);
    another_p5_div.append(butt);
    another_col_div.append(another_p5_div);
    row_div.append(another_col_div);

    $("#ajaxData").append(section);
}






//*****************************示例程序*********************
$(function () {
    //用button触发
    $("#xFormbutton").click(function (e) {
        // e.preventDefault();
        alert("Form submitted!");
        //试一试POST和GET两种方式
        //MyAjaxSubmit();
        MyAjaxSubmit();
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
                $("#ajaxData").text("哒POST：" + dataJSON.a);
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