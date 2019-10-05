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
            console.log("The following items have less than 5 remaining in stock")
            displayData(res);
            console.log("\n\n");
            showMenu();
        });
}

function addToInventory() {
    var itemIDs = [];
    connection.query("SELECT * from products",
        function(err, res) {
            if (err) throw err;
            displayData(res);
            for (x in res) {
                itemIDs.push(res[x].item_id);
            }
            inquire.prompt([{
                message: "Please enter the ID of the item you would like to add stock to:",
                name: "selectedItem",
                validate: function(input) {
                    if (!itemIDs.includes(parseInt(input))) {
                        console.clear();
                        displayData(res);
                        return "Please enter a valid ID"
                    } else return true;
                }
            }, {
                message: "How many would you like to add?",
                name: "requestedQty",
                validate: validateInteger
            }]).then(function(ans) {
                var selectedItem;
                for (x in res) {
                    if (res[x].item_id === parseInt(ans.selectedItem))
                        selectedItem = res[x];
                }
                var newQuantity = selectedItem.stock_quantity + parseInt(ans.requestedQty);
                connection.query(`UPDATE products SET ? WHERE ?`, [{
                            stock_quantity: newQuantity
                        },
                        {
                            item_id: selectedItem.item_id
                        }
                    ],
                    function(err, res) {
                        if (err) throw err;
                        console.clear();
                        console.log(`Stock for ${selectedItem.product_name} has been updated from ${selectedItem.stock_quantity} to ${newQuantity}!`);
                        return showMenu();
                    })
            })
        });
}

function addNewProduct() {
    inquire.prompt([{
            message: "Enter the product name:",
            name: "product_name",
            validate: checkText
        },
        {
            message: "Enter the department for the product:",
            name: "department_name",
            validate: checkText
        },
        {
            message: "Enter the price for the item:",
            name: "price",
            validate: validateNumeric
        },
        {
            message: "Enter the inital stock for this product:",
            name: "stock_quantity",
            validate: validateInteger
        }
    ]).then(function(ans) {
        connection.query("INSERT INTO products SET ?", {
            product_name: ans.product_name,
            department_name: ans.department_name,
            price: ans.price,
            stock_quantity: ans.stock_quantity
        }, function(err, res) {
            if (err) throw err;
            console.clear();
            console.log(`Added ${ans.product_name} to the database!`);
            showMenu();
        });
    })
}

function checkText(data) {
    if (data.length <= 0)
        return "This field cannot be left blank."
    else return true;
}

function validateInteger(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole non-zero number.';
    }
}

function validateNumeric(value) {
    // Value must be a positive number
    var number = (typeof parseFloat(value)) === 'number';
    var positive = parseFloat(value) > 0;

    if (number && positive) {
        return true;
    } else {
        return 'Please enter a positive number for the price.'
    }
}