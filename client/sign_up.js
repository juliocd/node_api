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
        //url: 'http://localhost:3000/user',
        url: 'https://apinodeusers.herokuapp.com/user',
        data: JSON.stringify(user),
        error: function(error) {
            $( "#errorAlert" ).show( "slow" );
        },
        headers: {
            'Accept':'application/json', 
            'Content-Type': 'application/json'
        },
        success: function(data) {
            $("#buttonsContainer").hide();
            $( "#successAlert" ).show( "slow" );
        },
        type: 'POST'
     });
}
    
$(document).ready(function(){
    Inicialization();
    $("#signUpForm").on('submit', function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        SignUp();
    });
});
