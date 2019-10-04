var mysql = require("mysql");
var inquire = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: '',
    database: 'bamazon'
});
console.clear();
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
                console.clear();
                viewProducts();
                break;
            case "View Low Inventory":
                console.clear();
                viewLowInventory();
                break;
            case "Add to Inventory":
                console.clear();
                addToInventory();
                break;
            case "Add New Product":
                console.clear();
                addNewProduct();
                break;
            case "Exit":
                console.clear();
                connection.end();
                break;
        }
    })
}

function displayData(res) {
    for (x in res) {
        console.log(`Item ${res[x].item_id}: || Name: ${res[x].product_name} || Department: ${res[x].department_name} || Price: $${res[x].price.toFixed(2)} || Quantity: ${res[x].stock_quantity}`);
    }
}


function viewProducts() {
    connection.query("SELECT * from products",
        function(err, res) {
            if (err) throw err;
            displayData(res);
            showMenu();
        });
}

function viewLowInventory() {
    connection.query("SELECT * from products WHERE stock_quantity < 5",
        function(err, res) {
            if (err) throw err;
            if (res.length < 1) {
                console.clear();
                console.log("\n\nThere are currently no items that are low in inventory\n\n");
                return showMenu();
            }
            displayData(res);
            showMenu();
        });
}

function addToInventory() {
    var itemIDs = [];
    var stock = "";
    connection.query("SELECT * from products",
        function(err, res) {
            if (err) throw err;
            displayData(res);
            inquire.prompt([{
                message: "Please enter the ID of the item you would like to add stock to:",
                name: "selectedItem",
                validate: function(input) {
                    if (!itemIDs.includes(parseInt(input))) {
                        console.log("\n" + stock);
                        console.log("\nPlease enter a valid ID\n");
                        return false;
                    } else return true;
                }
            }, {
                message: "How many would you like to add?",
                name: "requestedQty"
            }]).then(function(ans) {
                var selectedItem = res[parseInt(ans.selectedItem) - 1];
                var newQuantity = selectedItem.stock_quantity + parseInt(ans.requestedQty);
                connection.query(`UPDATE products SET stock_quantity = "${newQuantity}" WHERE item_id=${parseInt(ans.selectedItem)}`, function(err, res) {
                    if (err) throw err;
                    console.clear();
                    console.log(`Stock for ${selectedItem.product_name} has been updated from ${selectedItem.stock_quantity} to ${newQuantity}!`);
                    return showMenu();
                })
            })
        });
}