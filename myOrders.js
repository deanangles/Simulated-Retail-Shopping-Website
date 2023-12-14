var URL="http://172.17.14.56/cse383_final/final.php";
var numOrders = 0;

updateNumOrders();
getAllOrders();
$(document).ready(function () {

	 $(document).on('click', '.showOrderBtn', function () {
		var order_id = $(this).val();
		showOrder(order_id);
	});
});

function updateNumOrders(){
	a=$.ajax({
		url: URL + '/getMostRecentOrderNum',
		method: "GET"
	}).done(function(data) {
		var numOrders = parseFloat(data.result[0].order_id);
		$("#numOrders").html(numOrders);
	}).fail(function(error) {
		constole.error("Error:", error);
	});
}

function getAllOrders() {
	a=$.ajax({
		url: URL + '/getAllOrders',
		method: "GET"
	}).done(function(data) {
		var results = data.result;
		var tableBody = $('#ordersTable');

		tableBody.empty();

		for (var i = 0; i < results.length; i++) {
			var row = $('<tr>');
			row.append($('<td>').text(results[i].orderDate));
			row.append($('<td>').text(results[i].numItems));
			row.append($('<td>').text(results[i].totPrice));
			row.append('<td><button class="showOrderBtn" value="' + results[i].order_id + '">Show Order</button></td>');

			tableBody.append(row);
		}
	}).fail(function(error) {
		console.error("Error:", error);
	});
}

function showOrder(order_id){
	a=$.ajax({
                url: URL + '/getOrder?order_id='+order_id,
                method: "GET"
        }).done(function(data) {
		document.getElementById('shownOrderTable').style.display = 'block';
		$("#orderNum").html(order_id);
                var results = data.result;
                var tableBody = $('#shownOrder');

                tableBody.empty();

		var products=[];
		var total=0;

                for (var i = 0; i < results.length; i++) {
                        var row = $('<tr>');
                        row.append($('<td>').text(results[i].product_id));
                        row.append($('<td>').text(results[i].title));
                        row.append($('<td>').text(results[i].price));

			products.push({product_id: results[i].product_id, name: results[i].title, price: results[i].price});
			total += parseFloat(results[i].price);

                        tableBody.append(row);
                }

		var printButton = document.createElement('button');
		printButton.textContent = 'Print';
		printButton.addEventListener('click', function() {
			print(total,products);
		});
		tableBody.append(printButton);

	}).fail(function(error) {
		console.error("Error:", error);
	});
}

function print(total, products) {
    var newPageURL = 'orderedItems.html';
    var newWindow = window.open(newPageURL, '_blank');
    newWindow.onload = function() {
        var displayElement = newWindow.document.getElementById('orderedItems');

        var totalPriceDisplay = document.createElement('h2');
        totalPriceDisplay.textContent = 'Total Price: $' + total.toFixed(2); // Format total price with two decimal places
        displayElement.append(totalPriceDisplay);

        products.forEach((product, index) => {
            var cartItem = document.createElement('div');
            cartItem.textContent = `Item ${index + 1}: ${product.name} - $${product.price}`;
            displayElement.append(cartItem);

            var lineBreak = document.createElement('br');
            displayElement.append(lineBreak);
        });
    };

    newWindow.focus();
}
