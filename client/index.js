function SignIn(){
    window.location.href = "main.html";
}
    
$(document).ready(function(){
    $("#signInForm").on('submit', function(e) {
        SignIn();
        return false;
    });
});
