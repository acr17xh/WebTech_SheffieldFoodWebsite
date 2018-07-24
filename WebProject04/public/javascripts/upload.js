var lat;
var lng;


$(function () {
    //Ajax上传button 文件和普通文字表单混合，使用jquery.form.min.js
    $("#uploadForm").on("submit", function () {
        UploadAjaxSubmit();
    });

    //跳转获取字幕button
    $("#getCor").click(function () {
        $("#map_notice").css("opacity","0");
        $('html, body').animate({
            scrollTop: $("#map").offset().top
            //$("#ajaxData").offset().top 元素到顶部距离
        }, 1000);
        //延时出现提示字幕
        window.setTimeout(function () {
            $("#map_notice").animate({top: "200px", opacity: "1"}, 1500);
        }, 1500);
    });

    //监测合法性
    //Detect the input number in rating area
    $("#restaurant_rating").blur(function() {
        var val_rating_orgin = $("#restaurant_rating").val();
        var val_int = val_rating_orgin.toString();
        var val_rating = Math.floor(val_int)
        if (val_rating <=6 && val_rating >=1){
            var succ = $("<p id='rig' style='color: white'>Valid rating.</p>");
            $("#restaurant_rating").css("border-color","green");
            $("#restaurant_rating").after(succ);
            $(".text-danger").remove();
        }
        else {
            var err = $("<p id='err' style='color: white'>Error! Please input valid rating!</p>");
            $("#restaurant_rating").css("border-color","red");
            $("#restaurant_rating").val("");
            $("#restaurant_rating").after(err);
            $(".text-success").remove();
        }
    });
    $("#restaurant_rating").focus(function () {
        $("#rig").remove();
        $("#err").remove();
    });
});


var options = {
    target: '#ajaxData',   // target element(s) to be updated with server response
    beforeSubmit: showRequest,  // pre-submit callback
    success: showResponse, // post-submit callback
    // other available options:
    url: 'http://localhost:3000/restaurants/restaurants',        // override for form's 'action' attribute
    type: 'post',    // 'get' or 'post', override for form's 'method' attribute
};

//ajax 上传餐厅到mongodb
function UploadAjaxSubmit() {
    $("#uploadForm").ajaxSubmit(options);
    // !!! Important !!!
    // always return false to prevent standard browser submit and page navigation
    return false;
}

// pre-submit callback
function showRequest(formData, jqForm, options) {
    // formData is an array; here we use $.param to convert it to a string to display it
    // but the form plugin does this for you automatically when it submits the data
    var queryString = $.param(formData);

    // jqForm is a jQuery object encapsulating the form element.  To access the
    // DOM element for the form do this:
    // var formElement = jqForm[0];

    alert('About to submit: \n\n' + queryString);

    // here we could return false to prevent the form from being submitted;
    // returning anything other than false will allow the form submit to continue
    return true;
}

//这个回调好像没起作用?
// post-submit callback
function showResponse(responseText, statusText, xhr, $form) {
    // for normal html responses, the first argument to the success callback
    // is the XMLHttpRequest object's responseText property

    // if the ajaxSubmit method was passed an Options Object with the dataType
    // property set to 'xml' then the first argument to the success callback
    // is the XMLHttpRequest object's responseXML property

    // if the ajaxSubmit method was passed an Options Object with the dataType
    // property set to 'json' then the first argument to the success callback
    // is the json data object returned by the server
    //数据是插入了，这回调没起作用？
    alert("success showResponse!!!!!!!!!!!!!!!!");
    // alert('status: ' + statusText + '\n\nresponseText: \n' + responseText +
    //     '\n\nThe output div should have already been updated with the responseText.');
    window.location.href = "http://localhost:3000";

}







//function that initial Google map
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
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
            infoWindow.setContent('You');
            map.setCenter(pos);

            //The module used to get the coordinate
            var marker = new google.maps.Marker({
                map: map,
                draggable: true,
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            });


            //drag the marker event listener
            //拖拽marker的监听事件 回调函数行为

            google.maps.event.addListener(marker, 'dragend', function (MouseEvent) {

                lat = MouseEvent.latLng.lat();
                lng = MouseEvent.latLng.lng();
                $("#lat").attr("value", lat);
                $("#lng").attr("value", lng);

                $('html, body').animate({
                    scrollTop: $("#restaurant_rating").offset().top
                }, 1000);

                let get_notice1= $("<p class='h3' style='color: white'>Coordinates getting successful!</p>");
                $("#form_div").append(get_notice1);

            });

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

