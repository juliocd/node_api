var usersTable = null;

function initialization(){
    usersTable = $('#usersTable').DataTable( {
        columns: [
            { data: "name", title: "Name" },
            { data: "last_name", title: "Lastname" },
            { data: "age", title: "Age" },
            { data: "gender", title: "Gender" },
            { data: "username", title: "Username" }
        ]
    } );

    loadData();
}
    
function loadData(){
    $.ajax({
        url: 'https://apinodeusers.herokuapp.com/users',
        error: function(error) {
            alert("Error getting users.")
        },
        headers: {
            'Accept':'application/json', 
            'Content-Type': 'application/json'
        },
        success: function(jsonResponse) {
            usersTable.data = jsonResponse;
            usersTable.reload();
        },
        type: 'GET'
     });
}

$(document).ready(function(){
    initialization();
});