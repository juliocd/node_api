
function saveUser(){

    var user = {
        name: $("#name").val(),
        last_name: $("#last_name").val(),
        age: $("#age").val(),
        gender: $("#gender").val(),
        username: $("#username").val(),
        password: $("#password").val()
    };

    $.ajax({
        url: 'https://apinodeusers.herokuapp.com/user',
        data: JSON.stringify(user),
        error: function(error) {
            alert("Error saving user.")
        },
        headers: {
            'Accept':'application/json', 
            'Content-Type': 'application/json'
        },
        success: function(data) {
           alert("User saved successful.")
        },
        type: 'POST'
     });
}

$(document).ready(function(){
    $("#saveUserBtn").click(saveUser);
});
