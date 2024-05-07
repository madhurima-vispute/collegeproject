async function getOrderDetails(client,id) {
    var query3 = "select * from orders where id = $1"
    var data1 = await client.query(query3,[id])
    return(data1.rows[0])
}

async function getAllOrderDetails(client,id) {
    var query3 = "select * from orders where user_id = $1"
    var data1 = await client.query(query3,[id])
    return(data1.rows)
}



export{getOrderDetails,getAllOrderDetails}