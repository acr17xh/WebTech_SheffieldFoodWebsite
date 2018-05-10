$(function () {
    $("#SubInfo").click(function () {
        UploadInfo();
    })
});

function UploadInfo() {
    // var restaurant_name = $("#restaurant_name").val();
    // var address = $("#address").val();
    // var type_of_cuisine = $("#type_of_cuisine").val();
    // var description = $("#description").val();
    // var official_photo= $("#official_photo").val();
    // var restaurant_rating = $("#restaurant_rating").val();
    //
    // var RestData = {
    //     "restaurant_name":restaurant_name,
    //     "address":address,
    //     "type_of_cuisine":type_of_cuisine,
    //     "description":description,
    //     "official_photo":official_photo,
    //     "restaurant_rating":restaurant_rating
    // };
    // var JSONRestData = JSON.stringify(RestData);
    // alert("JSON: "+JSONRestData);

    var form = $('#UploadRest')[0];
    var fd = new FormData(form);

    $.ajax({
        //url:'http://localhost:3000/upload/test3',//要在渲染route后面加非渲染的route
        url:'http://localhost:3000/restaurants/restaurants?method=post',
        contentType:false,
        processData: false,
        type:'POST',
        data: fd,
        success: function(data){
            alert("success");

        },
        error: function (xhr, status, error) {
            alert("fail");
            alert(error.message);
        }
    })
}