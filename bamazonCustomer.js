//Loading npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	//Your username
	user: "root",

	//Your password
	password: "365663",
	database: "Bamazon"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
});

//Welcoming user to our bamazon application
console.log("Welcome to Bamazon!!");

//Creating the table header row
var table = new Table({
    head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'QTY in Stock']
});


connection.query("SELECT * FROM products", function(err,res){
	if (err) throw err;
	//Running the update table to see what items are for sale
	updateTable(res);

	//Creating a prompt with a series of questions for the user
	inquirer.prompt([
		//Asking the user basic questions about their order
		{
			type: "input",
			message: "Enter the ID of the product you would like to buy:",
			name: "productID"
		},
		{
			type: "input",
			message: "How many units would you like to buy?",
			name: "buyUnits"
		},
	//after asking all the questions the "then" we do stuff witht he answers
	]).then(function(user){
		console.log("User Buy Input: " + user.buyUnits);
		console.log("User product ID Input: " + user.productID);

		
		//Assign correct array index
		var productID = parseInt(user.productID);
		productID = productID - 1;
		//Printing the price of the item selected
		var price = res[productID].price;
		console.log("Item Price:" + price);
		
		
		//qty avalible
		var qtyAvalible = res[productID].stock_quantity;
		console.log("DB Stock QTY: " + qtyAvalible);

		//Checking to make sure there is enough quantity to place the order
		if(user.buyUnits>qtyAvalible){
			console.log("Insufficient quantity!");
		}else{
			console.log("Qty is avalible, your order has been placed.");
			//Query to update the sql db with the new number of products after being sold
			connection.query("UPDATE products SET ? WHERE ?", [{
			  stock_quantity: qtyAvalible - user.buyUnits
			}, {
			  item_id: user.productID
			}], function(err, res) {});
			//this will exit the user from the application
			//Here we are calculating the final price as well as setting the value to two decimal
			var finalPrice = user.buyUnits * price;
			console.log("The total cost will be $" + finalPrice.toFixed(2));
		}
		process.exit();
	});
});

//This function will update the table display
function updateTable(data){
	//For loop to display all items in a table format
	for (var i = 0; i < data.length; i++){
		// table is an Array, and we are pushing each row on to the table
		table.push(
		    [data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity]
		);
	}
	//Printing the table to the console	
	console.log(table.toString());
}









