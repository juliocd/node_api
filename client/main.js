var usersTable = null;

function initialization(){
    usersTable = $('#usersTable').DataTable( {
        columns: [
            { data: "name", title: "Name" },
            { data: "last_name", title: "LastName" },
            { data: "age", title: "Age" },
            { data: "gender", title: "Gender" },
            { data: "username", title: "Username" }
        ]
    } );

    loadData();
}
    
function loadData(){
    $.ajax({
        //url: 'http://localhost:3000/users',
        url: 'https://apinodeusers.herokuapp.com/users',
        error: function(error) {
            alert("Error getting users.")
        },
        headers: {
            'Accept':'application/json', 
            'Content-Type': 'application/json',
            'token': localStorage.getItem('auth')
        },
        success: function(jsonResponse) {
            if(jsonResponse.code == 200){
                usersTable.rows.add(jsonResponse.data).draw();
            }
        },
        type: 'GET'
     });
}

$(document).ready(function(){
    initialization();
});