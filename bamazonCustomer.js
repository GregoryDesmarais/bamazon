var mysql = require("mysql");
var inquire = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Showing stock");
    showStock();
});

function showStock() {
    console.log("Retrieving stock")
    connection.query("SELECT * from products",
        function(err, res) {
            if (err) throw err;
            for (x in res) {
                console.log(`${res[x].product_name} || ${res[x].department_name} || ${res[x].price} || ${res[x].stock_quantity}`)
            }
        });
    connection.end();
}