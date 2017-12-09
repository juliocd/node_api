function Inicialization(){

}

function SignUp(){
    $("#warningMessage").hide();
    $("#errorAlert").hide();

    var user = {
        name: $("#inputName").val(),
        last_name: $("#inputLastname").val(),
        age: $("#inputAge").val(),
        gender: $("#selectGender").val(),
        username: $("#inputUsername").val(),
        password: SHA256($("#inputPassword").val())
    };

    $.ajax({
        url: 'http://localhost:3000/user',
        //url: 'https://apinodeusers.herokuapp.com/user',
        data: JSON.stringify(user),
        error: function(error) {
            $( "#errorAlert" ).show( "slow" );
        },
        headers: {
            'Accept':'application/json', 
            'Content-Type': 'application/json'
        },
        success: function(data) {
            if(data.code == 200){
                $("#buttonsContainer").hide();
                $( "#successAlert" ).show( "slow" );
            }else{
                $( "#warningMessage" ).text(data.error);
                $( "#warningAlert" ).show( "slow" );
            }
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
