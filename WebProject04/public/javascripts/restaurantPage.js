$(document).ready(function () {
    var restaurant_id = $("#rest_id").text();

    //使用了app.use中的middleware,中间是restaurants,后面是route.get的/restaurant
    var url = "http://localhost:3000/restaurants/restaurant"+"?restaurant_id="+restaurant_id;

    //get restaurant detail
    $.ajax({
        url:url,
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
        },
        error: function (xhr, status, error) {
            alert("wrong");
            alert(error.message);
        }

    })
})

function GenerateRestaurantDetail(name,type,address,descr,rating,photo,lat,lng,date) {
    $("#rest_name").text(name);

    var section = $("<section></section>");
    var container_div = $("<div class='container'></div>");
    var row_div = $("<div class='row align-items-center'></div>");
    var col_div = $("<div class='col-lg-12'></div>");
    var p5_div = $("<div class='p-5'></div>");

    var type_p = $("<p class='display-4'></p>");
    var address_p = $("<p class='display-4'></p>");
    var descr_p = $("<p class='display-4'></p>");
    var rating_p = $("<p class='display-4'></p>");
    var date_p = $("<p class='display-4'></p>");

    type_p.append("Cuisine Type: "+type);
    address_p.append("Address: "+address);
    descr_p.append("Description: "+descr);
    rating_p.append("Rating: "+rating);
    date_p.append("Adding Date: "+date);

    p5_div.append(type_p);
    p5_div.append(address_p);
    p5_div.append(descr_p);
    p5_div.append(rating_p);
    p5_div.append(date_p)
    col_div.append(p5_div);
    row_div.append(col_div);
    container_div.append(row_div);
    section.append(container_div);
    $("#ajaxData").append(section);
}
