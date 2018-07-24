$(function () {

    //Initial google map
    initMap();

    //Button event of "search"
    $("#search").click(function () {
        //clear
        $("#ajaxData").text("");

        //AJAX get data, render restaurant list and set marker
        PostKeyword();

        //first animation
        $('html, body').animate({
            scrollTop: $("#map").offset().top //map到顶部距离，滑动这个距离
        }, 1000);
        //second time animation
        window.setTimeout(function () {
            $('html, body').animate({
                scrollTop: $("#ajaxData").offset().top //ajaxData到顶部距离，滑动这个距离
            }, 1000);
        }, 3000);
    });

});



//Function that get the all restaurants which is matching keyword
function PostKeyword() {
    var keyword = $("#keyword").val();
    var Formdata = {
        "keyword": keyword
    };

    //Get the specific restaurant page
    //事件委托，将id为ajaxData下的input元素的事件绑定到ajaxData
    //点击input就会触发ajaxData的绑定的事件
    $("#ajaxData").on("click","input",function () {

        //跳转到具体的餐厅页面，其余事情在页面加载过后自动运行ajax生成
        var restaurant_id = this.id;
        var url = "http://localhost:3000/restaurant";
        var url0 = url + "?restaurant_id=" + restaurant_id;
        window.location.href = url0;
    });


    //Get the restaurants list via Ajax when clicking search
    $.ajax({
        url:"http://localhost:3000/restaurants/restaurants",
        data:Formdata,
        type:'GET',
        success: function (data) {
            //在这里使用JQuery或者JS把data里的值设置进HTML元素里去
            //如果是数组类型的Json用JS函数遍历一下设置列表或表格就行
            //res.json返回的是json object

            console.log(data);
            var num = data.length;
            if (num != 0){


                for (var i = 0; i < num; i++) {
                    console.log(i);

                    //Put the marker on the map
                    var lat = data[i].coordinate.lat;
                    var lng = data[i].coordinate.lng;
                    addMarker(lat, lng, i);

                    //GenerateSection used to show data returned from ajax
                    GenerateSection(data[i].official_photo_url,data[i].restaurant_name,data[i].type_of_cuisine,
                        data[i].description,data[i].address,data[i].restaurant_rating);

                    //OMG!:选择ajaxData里面最后一个h3(也就是restaurant name)前面加上标号;因为每次最后一个是最新添加的
                    $("#ajaxData h3:last").prepend(i+1 + ". ");
                    $("#ajaxData input:last").attr("value","More details");//give an id to every single button
                    $("#ajaxData input:last").attr("id",data[i]._id);
                }


                //add the jump style when click the img
                var sec = document.getElementsByTagName("img");
                for (let j=0; j<sec.length; j++){
                    sec[j].addEventListener("click", function () {
                        CleanAnimation();
                        console.log(allMarker[j]);
                        allMarker[j].setAnimation(google.maps.Animation.BOUNCE);
                    });
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

//function that generate display area via ajax
function GenerateSection(img_path,para_name,para_type,para_discription,para_address,para_rating){
    //Built rely on the html document from chu xi
    var section = $("<section></section>");
    var container_div = $("<div class='container'></div>");
    var row_div = $("<div class='row align-items-center'></div>");
    var col_div = $("<div class='col-lg-6'></div>");
    var p5_div = $("<div class='p-5'></div>");
    var img = $("<img class='img-fluid rounded-circle' style='width: 380px;height: 370px'>");

    var another_col_div = $("<div class='col-lg-6'></div>");
    var another_p5_div = $("<div class='p-5'></div>");
    var restname = $("<h3 class='display-4'></h3>");
    var foodtype = $("<h4>Food type: </h4>");
    var discription = $("<p>Description: </p>");
    var address = $("<p>Address: </p>");
    var rating = $("<p>Rating: </p>");

    var butt = $(" <input type=\"button\" class=\"btn btn-primary btn-lg\">");

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


//function which related to Google map API
//function that initial Google map
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        styles:[
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ebe3cd"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#523735"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#f5f1e6"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#c9b2a6"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#dcd2be"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#ae9e90"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#93817c"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#a5b076"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#447530"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f1e6"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#fdfcf8"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f8c967"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#e9bc62"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e98d58"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#db8555"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#806b63"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8f7d77"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ebe3cd"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#b9d3c2"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#92998d"
                    }
                ]
            }
        ]
    });
    //获取当前设备所在地区位置
    var infoWindow = new google.maps.InfoWindow({map: map});
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here man');
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }
    else {
        //When browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    //定义定位异常处理程序
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }
};
//function that add marker in map
var allMarker = new Array();
function addMarker(lat, lng ,i){
    //make marker in the map
    var delay = i * 200 + 600;
    //setTimeout写在里面是因为要让传进来的lat和lng做全局参数()
    window.setTimeout(function () {
        var myLatlng = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            position: myLatlng,
            animation: google.maps.Animation.DROP
        });
        marker.setMap(map);
        allMarker.push(marker);
    }, delay);
}
//function that clean jump animation
function CleanAnimation() {
    for (var q = 0; q < allMarker.length;q++){
        allMarker[q].setAnimation(null);
    }
}










// var Allmarker = new Array(); //This arry used to save marker标记
// function addMarker(position, timeout) {
//     window.setTimeout(function() {
//         Allmarker.push(new google.maps.Marker({
//             position: position,
//             map: map,
//             animation: google.maps.Animation.DROP
//         }));
//     }, timeout);
// }












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