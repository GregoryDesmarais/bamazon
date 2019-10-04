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
    showStock();
});

function showStock() {
    var itemIDs = [];
    var stock = "";
    connection.query("SELECT * from products WHERE stock_quantity > 0",
        function(err, res) {
            if (err) throw err;
            for (x in res) {
                itemIDs.push(res[x].item_id);
                stock += `Item ID: ${res[x].item_id} || Name: ${res[x].product_name} || Price: $${res[x].price.toFixed(2)}\n`;
            }
            console.log(stock);
            inquire.prompt([{
                message: "Please enter the ID of the item you would like to buy:",
                name: "selectedItem",
                validate: function(input) {
                    if (!itemIDs.includes(parseInt(input))) {
                        console.log("\n" + stock);
                        console.log("\nPlease enter a valid ID\n");
                        return false;
                    } else return true;
                }
            }, {
                message: "How many would you like to purchase?",
                name: "requestedQty"
            }]).then(function(ans) {
                connection.query(`SELECT * from products WHERE item_id="${ans.selectedItem}"`, function(err, res) {
                    if (err) throw err;
                    if (res[0].stock_quantity >= parseInt(ans.requestedQty)) {
                        var price = res[0].price;
                        connection.query(`UPDATE products SET stock_quantity = "${res[0].stock_quantity - parseInt(ans.requestedQty)}" WHERE item_id=${parseInt(ans.selectedItem)}`, function(err, res) {
                            if (err) throw err;
                            console.log(`
Order placed!
Your total cost is: $${price * parseInt(ans.requestedQty)}`);
                        })
                        connection.end();
                    } else {
                        console.log("Insufficient Quantity");
                        showStock();
                    }
                })
            })
        });
}