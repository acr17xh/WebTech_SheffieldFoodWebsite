
//Function used to check online or not and saving in local storage
$(function () {

    $("#SubReview").click(function () {
        //used to get and save connecting status
        var Connect_Status = navigator.onLine;

        //if联网状态的话获取localstorage
        if (Connect_Status){
            //The two function below defined in the end of this script
            PostReviews();
            DeleteLocal();
        }//if断网状态的话存储进localstorage
        else if (!Connect_Status){
            SaveLocal();
            alert("Your are not connecting in network, your input already saved in localStorage." +
                "/n"+"Connect and refresh page, the value will be auto load");
        }
    });

});

//Function used to post photo to database via FileInput plugin
$(function () {

    //Bootstrap FileInput Plugin
    $("#fileinput1").fileinput({
        uploadUrl: 'http://localhost:3000/photos/photos?method=post',
        uploadAsync: true,
        showPreview: true,
        maxImageWidth: 1920,
        maxImageHeight: 1080,
        resizeImage: true,
        maxFilePreviewSize: 30720,
        maxFileSize: 30720,
        maxFileCount: 5,
        allowedFileExtensions: ["jpg", "png"],
        uploadExtraData: function (previewId, index) {
            var restaurant_id = $("#restaurant_id").val();
            var parameters = {"restaurant_id": restaurant_id};
            return parameters;
        }
    });
});




//Function run after loaded
$(document).ready(function () {

    //Check localStorage exist or not
    if (localStorage.getItem("username") != null){
        GetLocal();
    } else {}

    //get the restaurant id
    var restaurant_id = $("#rest_id").text();
    $("#restaurant_id").attr("value",restaurant_id);
    var itself = "http://localhost:3000/restaurant"+"?restaurant_id="+restaurant_id;
    $("#itself").attr("href",itself);

    //使用了app.use中的middleware,中间是restaurants,后面是route.get的/restaurant
    var url_rest = "http://localhost:3000/restaurants/restaurant"+"?restaurant_id="+restaurant_id;
    var url_review = "http://localhost:3000/reviews/reviews"+"?restaurant_id="+restaurant_id;
    var url_photo = "http://localhost:3000/photos/photos"+"?restaurant_id="+restaurant_id;

    //The Ajax which used to get restaurant detail
    $.ajax({
        url:url_rest,
        type:'GET',
        success: function (data) {
            var rest_name = data[0].restaurant_name;
            var rest_type = data[0].type_of_cuisine;
            var rest_address = data[0].address;
            var rest_description = data[0].description;
            var rest_rating = data[0].restaurant_rating;
            var rest_offcial_photo = data[0].official_photo_url;

            var rest_lat = data[0].coordinate.lat;
            var rest_lng = data[0].coordinate.lng;
            var rest_date = data[0].date;

            GenerateRestaurantDetail(rest_name,rest_type,rest_address,
                rest_description,rest_rating,rest_offcial_photo,
                rest_lat,rest_lng,rest_date);

            // addMarker(rest_lat, rest_lng);

            $("#review_title").prepend(rest_name);
        },
        error: function (xhr, status, error) {
            alert("wrong");
            alert(error.message);
        }
    });

    //The Ajax which used to get review detail
    $.ajax({
        url:url_review,
        type:'GET',
        success:function (data) {
            var num = data.length;
            for (var i = 0; i < num; i++) {
                var review_username = data[i].username;
                var review_description = data[i].review_description;
                var review_ratings = data[i].ratings;
                var review_date = data[i].date;

                GenerateReview(review_username,review_description,review_ratings,review_date);
            }
        },
        error: function (xhr, status, error) {
            alert("wrong");
            alert(error.message);
        }
    });

    //The Ajax which used to get photo
    $.ajax({
        url: url_photo,
        type: 'GET',
        success: function (data) {
            // alert("photo receive!");
            // alert(data.length);
            console.log(data);

            var numb = data.length;
            var ArrayOfImg = new Array();
            for (let i=0; i<numb; i++){
                var photo_url = data[i].user_photo_url;
                var photo_name = data[i].photo_name;
                var photo_date = data[i].date;

                var img = $("<img>");
                img.attr("src",photo_url);
                img.attr("alt",photo_name);
                img.attr("height","100%");
                $("#img_bar").append(img);

                ArrayOfImg.push(img);
            }

            //为照片墙添加click跳转事件监听
            for (let j=0; j<ArrayOfImg.length; j++){
                let img1 = ArrayOfImg[j];
                let img_url = img1.attr("src");
                console.log(img_url);
                ArrayOfImg[j].click(function () {
                    $("#main_img").attr("src", img_url);
                });
                ArrayOfImg[j].mouseenter(function () {
                    ArrayOfImg[j].css("border", "solid orange 2px");
                });
                ArrayOfImg[j].mouseleave(function () {
                    ArrayOfImg[j].css("border", "");
                });
            }
            if (ArrayOfImg[0] != null) {
                $("#main_img").attr("src", ArrayOfImg[0].attr("src"));
            }
        }
    });


    //一些回调方法验证特效什么的
    //Check value is valid or not; Clear old notice
    $("#ratings").blur(function() {
        var val_rating_orgin = $("#ratings").val();
        var val_int = val_rating_orgin.toString();
        var val_rating = Math.floor(val_int)
        if (val_rating <=6 && val_rating >=1){
            var succ = $("<p class='text-success'>Valid rating.</p>");
            $("#ratings").css("border-color","green");
            $("#ratings").after(succ);
            $(".text-danger").remove();
        }
        else {
            var err = $("<p class='text-danger'>Error! Please input valid rating!</p>");
            $("#ratings").css("border-color","red");
            $("#ratings").val(""); $("#ratings").after(err);
            $(".text-success").remove();
        }
    });
    $("#ratings").focus(function () {
        $(".text-success").remove();
        $(".text-danger").remove();
    });


    //restaurant description渐变出现
    $(window).scroll(function () {
        if ($(window).scrollTop() > 200){
            $("#anm1").animate({right: "0px", opacity: "1"}, 700);
            $("#anm2").animate({left: "0px", opacity: "1"}, 700);
        }
        else {}
    });
    //review渐变
    $(window).scroll(function () {
        if ($(window).scrollTop() > 1380){
            $("#anm3").animate({opacity: "1"}, 700);
            $("#anm4").animate({opacity: "1"}, 700);
        }
        else {
            $("#anm3").css("opacity","0");
            $("#anm4").css("opacity","0");
        }
    });
});




//Saving data to local storage
function SaveLocal() {
    var Restaurant_id = $("#rest_id").text();
    var Username = $("#username").val();
    var Review_descriptio = $("#review_description").val();
    var Rating = $("#ratings").val();
    localStorage.setItem("restaurant_id", Restaurant_id );
    localStorage.setItem("username", Username);
    localStorage.setItem("review_description", Review_descriptio);
    localStorage.setItem("rating", Rating);
}
function GetLocal() {
    var Restaurant_id = localStorage.getItem("restaurant_id");
    var Username = localStorage.getItem("username");
    var Review_description = localStorage.getItem("review_description");
    var Rating = localStorage.getItem("rating");
    $("#username").val(Username);
    $("#review_description").val(Review_description);
    $("#ratings").val(Rating);
}
function DeleteLocal() {
    localStorage.removeItem("restaurant_id");
    localStorage.removeItem("username");
    localStorage.removeItem("review_description");
    localStorage.removeItem("rating");
    $("#username").val("");
    $("#review_description").val("");
    $("#ratings").val("");
}

//Generate restaurant detail and used in ajax
function GenerateRestaurantDetail(name,type,address,descr,rating,photo,lat,lng,date) {
    $("#rest_name").text(name);

    var br = $("<br>");
    var section = $("<section></section>");
    var container_div = $("<div class='container-fluid' style='height: 650px'></div>");
    var row_div = $("<div class='row align-items-center' style='height: 100%'></div>");
    var col_div = $("<div class='col-lg-6' style='height: 100%'></div>");
    var col_div2 = $("<div class='col-lg-6 text-center' style='height: 100%'></div>");

    var p5_div = $("<div id='anm2' class='p-5' " +
        "style='height: 80%; position: relative;left:50px;top: 15%;opacity: 0'></div>");

    var img = $("<img id='anm1' class='img-fluid rounded-circle' " +
        "style='width: 500px;height: 480px; position: relative;left:50px;top: 15%;opacity: 0'>");

    var type_p = $("<p class='h4' style='color: #f4404f'></p>");
    var address_p = $("<p class='h4' style='color: #ee256c'></p>");
    var descr_p = $("<p class='h4' style='overflow: auto;color: #ff6e23'>");
    var rating_p = $("<p class='h4' style='color: #ee256c'></p>");
    var date_p = $("<em style='color: #999999'></em>");

    img.attr("src", photo);
    type_p.append("CUISINE TYPE: "+type);
    address_p.append("ADDRESS: "+address);
    descr_p.append("DESCRIPTION: "+descr);

    rating_p.append("RATING: ");
    for (let i=0; i<rating.toString(); i++) {
        rating_p.append("🍙 ");
    }
    date_p.append("-- Adding date: ")
    date_p.append(date);

    col_div2.append(img);
    p5_div.append(type_p);
    p5_div.append(address_p);
    p5_div.append(rating_p);
    p5_div.append(descr_p);
    p5_div.append(date_p);
    col_div.append(p5_div);

    row_div.append(col_div2);
    row_div.append(col_div);
    container_div.append(row_div);
    section.append(container_div);
    $("#ajaxData").append(section);
}

//Generate review detail and used in ajax
function GenerateReview(review_username,review_description,review_ratings,review_date) {

    var section = $("<section></section>");
    // var container_div = $("<div class='container'></div>");
    // var row_div = $("<div class='row'></div>");
    // var col_div = $("<div class='col-lg-12'></div>");
    var p5_div = $("<div></div>");

    var username_p = $("<h3 class='font-weight-bold' ></h3>");
    var review_descr_p = $("<h4 class='font-weight-normal'></h4>");
    var ratings_p = $("<h4 class='font-weight-normal'></h4>");
    var date_p = $("<em style='color: #999999'></em>");
    var devide = $("<br><br><div style='border-bottom: #999999 2px solid'></div>");

    username_p.append("👾");
    username_p.append(review_username);
    username_p.append(":");
    review_descr_p.append("\"");
    review_descr_p.append(review_description);
    review_descr_p.append("\"");
    date_p.append("-- ");
    date_p.append(review_date);

    ratings_p.append("Rating: ");
    for (let i=0; i<review_ratings; i++) {
        ratings_p.append("🍙");
    }

    p5_div.append(username_p);
    p5_div.append(review_descr_p);
    p5_div.append(ratings_p);
    p5_div.append(date_p);
    p5_div.append(devide);
    // col_div.append(p5_div);
    // row_div.append(col_div);
    // container_div.append(row_div);
    section.append(p5_div);
    $("#review_area").append(section);
}

//functions post review to database
function PostReviews() {
    var re_id = $("#rest_id").text();
    var username = $("#username").val();
    var review_description = $("#review_description").val();
    var ratings = $("#ratings").val();

    var url_post_review = "http://localhost:3000/reviews/reviews";
    var ReviewFormData = {
        "restaurant_id":re_id,
        "username":username,
        "review_description":review_description,
        "ratings":ratings
    };
    var JsonReviewFormData = JSON.stringify(ReviewFormData);

    $.ajax({
        url:url_post_review,
        type:'POST',
        data:JsonReviewFormData,
        contentType:"application/json",
        success: function (data) {
            alert("Review upload successful!");

            var NewAddUsername = data.username;
            var NewAddReview = data.review_description;
            var NewAddratings = data.ratings;
            var NewAddDate = data.date;

            GenerateReview(NewAddUsername,NewAddReview,NewAddratings,NewAddDate);
        },
        error: function (xhr, status, error) {
            alert("Wrong");
            alert(error.message);
        }
    });
}

