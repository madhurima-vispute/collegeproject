async function getUserDetails(client,id) {
    var query3 = "select * from users where id = $1"
    var data1 = await client.query(query3,[id])
    return(data1.rows[0])
}

async function getAllUserDetails(client) {
    var query3 = "select * from users where user_type = 1"
    var data1 = await client.query(query3)
    return(data1.rows)
}

export{getUserDetails,getAllUserDetails }