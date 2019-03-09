var inquirer = require("inquirer");
var mysql = require("mysql");




var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tinker1224',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err;

    inventory();
});


function inventory() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw error;

        console.log('');
        console.log('~~~~~~~~~~~~Taylor\'s Bamazon.com Inventory~~~~~~~~~~~~~~');
        console.log('');

        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            console.log('Item ID: ' + res[i].item_id);
            console.log('Product: ' + res[i].product_name);
            console.log('Department: ' + res[i].department_name);
            console.log('Price: $' + res[i].price);
            console.log('Quanity Left: ' + res[i].stock_quantity);
            console.log(' ');
            console.log(' ');
        }

        productQuestions();
        // connection.end();
    });
}

function productQuestions() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw console.log("connection error:" + err);
        // Create a "Prompt" with a series of questions.
        inquirer
            .prompt([
                //Questions Prompt
                {
                    type: "input",
                    message: "Welcome to Bamazon. What is the product id you'd like to purchase?",
                    name: "chosenId"
            },

                {
                    type: "input",
                    message: "how many units of the product would you like to buy?",
                    name: "quantityBought"
                }

            ]).then(function (answers) {
                var query = "SELECT * FROM products WHERE ?";
                connection.query(query, {
                    item_id: answers.chosenId
                }, function (err, res) {


                    
                    // console.log(res[0]);
                    var amtinStock = res[0].stock_quantity;
                    var amtBought = answers.quantityBought;

                    if (amtinStock >= amtBought) {
                        var leftInStock = amtinStock - amtBought;

                        var totalPrice = res[0].price * amtBought;
                        var itemPurchased = res[0].product_name;

                        console.log(totalPrice + "  total price of items bought");

                        connection.query(
                            "UPDATE products SET ? WHERE ?", [
                                {
                                    stock_quantity: leftInStock

                                },
                                {
                                    item_id: answers.chosenId
                                }

                            ],
                            function (error) {

                                if (error) throw err;
                                console.log("==============================================");
                                console.log("\n\r");
                                console.log("Order details:");
                                console.log("Item bought " + itemPurchased);
                                console.log("Quanity bought " + amtBought + " for $" + res[0].price);
                                console.log("Total Cost: $" + totalPrice);
                                console.log("\n\r");
                                console.log("Thank you for shopping with us.");
                                console.log("==============================================");
                                inventory();

                            }
                        );
                    } else {
                        console.log("==============================================");
                        console.log("\n\r");
                        console.log("Not enough of that product");
                        console.log("\n\r");
                        console.log("==============================================");
                        inventory();

                    }

                });

            });
    }



    // (function (inquirerResponse) {
    //     // If the inquirerResponse confirms, we display the inquirerResponse's ID and Quantity
    //     console.log(inquirerResponse);
    //     console.log(inquirerResponse.id);
    //     console.log(inquirerResponse.quantity);

    // console.log("==============================================");
    // console.log("\n\r");
    // console.log("Not enough of that product");
    // console.log("\n\r");
    // console.log("==============================================");
    // });
)}
