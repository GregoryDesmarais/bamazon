# bamazon

## Description

This application implements a simple command line based storefront using the npm [inquirer](https://www.npmjs.com/package/inquirer) package and the MySQL database backend together with the npm [mysql](https://www.npmjs.com/package/mysql) package. The application presents two interfaces: **customer** and **manager**.

### Requirements

- node.js
- mysql server

## Installation

	git clone https://github.com/GregoryDesmarais/bamazon.git
	cd bamazon
	npm install

### Customer Interface

The customer interface allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located and price. The user is then able to purchase one of the existing items by entering the item ID and the desired quantity. If the selected quantity is currently in stock, the user's order is fulfilled, displaying the total purchase price and updating the store database. If the desired quantity is not available, the user is prompted to modify their order.

![img](/assets/img/customerInterface.png)

To use the Customer Interface, enter the following command

    node bamazonCustomer.js

### Manager Interace

The manager interface presents a list of four options, as below. 

![img](/assets/img/managerMenu.png)
The **View Products for Sale** option allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located, price, and the quantity available in stock. 

The **View Low Inventory** option shows the user the items which currently have fewer than 5 units available.

The **Add to Inventory** option allows the user to select a given item ID and add additional inventory to the target item.

The **Add New Product** option allows the user to enter details about a new product which will be entered into the database upon completion of the form.

To run the manager interface use the following command:

	node bamazonManager.js


## bamazon Demo

#### Manager
![img](/assets/img/managerDemo.gif)

### Customer
![img](/assets/img/customerDemo.gif)