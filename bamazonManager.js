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
    showMenu();
});

function showMenu() {
    inquire.prompt([{
        type: "list",
        message: "Please select from the following",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ],
        name: "menuSelect"
    }]).then(function(ans) {
        switch (ans.menuSelect) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}

function viewProducts() {
    connection.query("SELECT * from products",
        function(err, res) {
            if (err) throw err;
            for (x in res) {
                console.log(`Item ${res[x].item_id}: || Name: ${res[x].product_name} || Department: ${res[x].department_name} || Price: $${res[x].price.toFixed(2)} || Quantity: ${res[x].stock_quantity}|`);
            }
            showMenu();
        });
}

function viewLowInventory() {
    connection.query("SELECT * from products WHERE stock_quantity < 5",
        function(err, res) {
            if (err) throw err;
            if (res.length < 2) {
                console.log("\n\nThere are currently no items that are low in inventory\n\n");
                showMenu();
            }
            for (x in res) {
                console.log(`Item ${res[x].item_id}: || Name: ${res[x].product_name} || Department: ${res[x].department_name} || Quantity: ${res[x].stock_quantity}|`);
            }
        });
    showMenu();
}