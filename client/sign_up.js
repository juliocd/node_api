function Inicialization(){

}

function SignUp(){
    var user = {
        name: $("#inputName").val(),
        last_name: $("#inputLastname").val(),
        age: $("#inputAge").val(),
        gender: $("#selectGender").val(),
        username: $("#inputUsername").val(),
        password: $("#inputPassword").val()
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
    Inicialization();
    $("#signInForm").on('submit', function(e) {
        SignUp();
        return false;
    });
});
