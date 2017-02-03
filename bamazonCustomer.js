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
console.log("Welcome to Bamazon!!")

//Creating the table header row
var table = new Table({
    head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'QTY in Stock']
});


connection.query("SELECT * FROM products", function(err,res){
	if (err) throw err;
	//For loop to display all items in a table format
	for (var i = 0; i < res.length; i++){
		// table is an Array, and we are pushing each row on to the table
		table.push(
		    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
		);
	}
	//Displaying Table in console
	console.log(table.toString());

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
		
		//console.log("User product ID plus 1: " + productID);
		
		//qty avalible
		var qtyAvalible = res[productID].stock_quantity;
		console.log("DB Stock QTY: " + qtyAvalible);

		

		//console.log("typeof "+ typeof productID);
		//console.log("prodcutID "+  productID);

		//Checking to make sure there is enough quantity to place the order
		if(user.buyUnits>qtyAvalible){
			console.log("Insufficient quantity!")
		}else{
			console.log("Qty is avalible")
		}

		// connection.query("SELECT stock_quantity FROM products WHERE ?", {
		// 		item_id: user.productID
		// 	}, function(err, res) {
		// 	  if (err) throw err;
		// 	  console.log("checkQty" + res);
		// 	});

	});
});

//Function to check if there is enough QTY avalible
var checkQty = function(){
	connection.query("SELECT stock_quantity FROM products WHERE ?", {
		item_id: user.productID
	}, function(err, res) {
	  if (err) throw err;
	  console.log("checkQty" + res);
	});
};








