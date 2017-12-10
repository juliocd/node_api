function Inicialization(){

}

function SignIn(){

    $( "#warningAlert" ).hide();
    $( "#errorAlert" ).hide();
    $.ajax({
        //url: 'http://localhost:3000/signin',
        url: 'https://apinodeusers.herokuapp.com/user',
        data: JSON.stringify({username: $("#username").val(), password: SHA256($("#password").val())}),
        error: function(error) {
            $( "#errorAlert" ).show( "slow" );
        },
        headers: {
            'Accept':'application/json', 
            'Content-Type': 'application/json'
        },
        success: function(data) {
            if(data.code == 200){
                localStorage.setItem('auth', data.data.token);
                window.location.href = "main.html";
            }else{
                $( "#warningAlert" ).show( "slow" );
            }
        },
        type: 'POST'
     });
}
    
$(document).ready(function(){
    Inicialization();
    $("#signInForm").on('submit', function(e) {
        e.preventDefault();
        SignIn();
    });
});
