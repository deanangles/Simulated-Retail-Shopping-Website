var URL="http://172.17.14.56/cse383_final/final.php";
var numProducts=0;
var cart = [];
var products = [];

getItems();

$(document).ready(function () {
	$('#categoryForm').submit(function (event) {
		event.preventDefault();
		var category = $('#categoryInput').val();
		getItemsByCategory(category);
	});

	$('#subCategoryForm').submit(function (event) {
		event.preventDefault();
		var subCategory = $('#subCategoryInput').val();
		getItemsBySubCategory(subCategory);
	});

	$('#resetButton').click(function () {
		getItems();
		$('#minPriceInput').val('0');
		$('#maxPriceInput').val('100');
	});

	$('#priceForm').submit(function (event) {
		event.preventDefault(); 
		var minPrice = $('#minPriceInput').val();
		var maxPrice = $('#maxPriceInput').val();
		getItemsByPrice(minPrice, maxPrice);
	});

	$('#orderSubCategoryButton').click(function() {
		orderItems("subCategory");
	});

	$('#orderCategoryButton').click(function() {
		orderItems("category");
	});

	$('#orderLowPriceButton').click(function() {
		orderItems("lowPrice");
	});

	$('#orderHighPriceButton').click(function() {
		orderItems("highPrice");
	});

	$('#addToCartButton').click(function() {
		addToCart();
	});

	$('#cartButton').click(function() {
		displayCart();
	});
});

function getItems() {
	a=$.ajax({
		url: URL + '/getProduct?category=%&subcategory=%&id=0',
		method: "GET"
	}).done(function(data) {
		var results = data.result;
		var tableBody = $('#productsTable');
		numProducts=results.length;
		$("#numProducts").html(numProducts);

		tableBody.empty();

		for (var i = 0; i < results.length; i++) {
			var row = $('<tr>');
			row.append($('<td>').text(results[i].title));
			row.append($('<td>').text(results[i].price));
			row.append($('<td>').text(results[i].category));
			row.append($('<td>').text(results[i].subcategory));
			row.append($('<td>').text(results[i].product_id));
			row.append('<td><input type="checkbox" class="productCheckbox" value="' + results[i].product_id + '"></td>');
			products.push({product_id: results[i].product_id, name: results[i].title, price: results[i].price});

			tableBody.append(row);
		}
	}).fail(function(error) {
		constole.error("Error:", error);
	});
}

function getItemsByCategory(category) {
	$.ajax({
		url: URL + '/getProduct?category=' + category + '&subcategory=%&id=0',
		method: "GET"
	}).done(function (data) {
		var results = data.result;
		var tableBody = $('#productsTable');
		var numProducts = results.length;

		$("#numProducts").html(numProducts);

		tableBody.empty();

		for (var i = 0; i < results.length; i++) {
			var row = $('<tr>');
			row.append($('<td>').text(results[i].title));
			row.append($('<td>').text(results[i].price));
			row.append($('<td>').text(results[i].category));
			row.append($('<td>').text(results[i].subcategory));
			row.append($('<td>').text(results[i].product_id));

			tableBody.append(row);
		}
	}).fail(function (error) {
		console.error("Error:", error);
	});
}

function getItemsBySubCategory(subCategory) {
	$.ajax({
		url: URL + '/getProduct?category=%&subcategory='+subCategory+'&id=0',
		method: "GET"
	}).done(function (data) {
		var results = data.result;
		var tableBody = $('#productsTable');
		var numProducts = results.length;

		$("#numProducts").html(numProducts);

		tableBody.empty();

		for (var i = 0; i < results.length; i++) {
			var row = $('<tr>');
			row.append($('<td>').text(results[i].title));
			row.append($('<td>').text(results[i].price));
			row.append($('<td>').text(results[i].category));
			row.append($('<td>').text(results[i].subcategory));
			row.append($('<td>').text(results[i].product_id));

			tableBody.append(row);
		}
	}).fail(function (error) {
		console.error("Error:", error);
	});
}

function getItemsByPrice(min, max) {
	$.ajax({
		url: URL + '/getProductByPrice?min='+min+'&max='+max,
		method: "GET"
	}).done(function (data) {
		var results = data.result;
		var tableBody = $('#productsTable');
		var numProducts = results.length;

		$("#numProducts").html(numProducts);

		tableBody.empty();

		for (var i = 0; i < results.length; i++) {
			var row = $('<tr>');
			row.append($('<td>').text(results[i].title));
			row.append($('<td>').text(results[i].price));
			row.append($('<td>').text(results[i].category));
			row.append($('<td>').text(results[i].subcategory));
			row.append($('<td>').text(results[i].product_id));

			tableBody.append(row);


		}
	}).fail(function (error) {
		console.error("Error:", error);
	});
}

function orderItems(category) {
	a=$.ajax({
		url: URL + '/orderProducts?category='+category,
		method: "GET"
	}).done(function(data) {
		var results = data.result;
		var tableBody = $('#productsTable');
		numProducts=results.length;
		$("#numProducts").html(numProducts);

		tableBody.empty();

		for (var i = 0; i < results.length; i++) {
			var row = $('<tr>');
			row.append($('<td>').text(results[i].title));
			row.append($('<td>').text(results[i].price));
			row.append($('<td>').text(results[i].category));
			row.append($('<td>').text(results[i].subcategory));
			row.append($('<td>').text(results[i].product_id));

			tableBody.append(row);
		}
	}).fail(function(error) {
		constole.error("Error:", error);
	});
}

function addToCart() {
	$('.productCheckbox:checked').each(function() {
		var productId = $(this).val();
		if (cart.indexOf(productId) === -1) {
			cart.push(productId);
		}
		$(this).prop('checked', false);
	});
}

function displayCart() {
	document.getElementById('cart').style.display = 'block';
	var displayElement = document.getElementById('cart');
	displayElement.innerHTML = '';
	var totalPrice = 0;

	cart.forEach((productId, index) => {
		var cartItem = document.createElement('div');
		var selectedProduct = products.find(product => product.product_id === productId);

		cartItem.textContent = `Item ${index + 1}: ${selectedProduct.name} - $${selectedProduct.price}	`;

		var removeButton = document.createElement('button');
		removeButton.textContent = 'Remove from Cart';
		removeButton.addEventListener('click', function() {
			cart.splice(index, 1);
			displayCart();
		});
		cartItem.append(removeButton);

		displayElement.append(cartItem);

		var lineBreak = document.createElement('br');
		displayElement.append(lineBreak);

		totalPrice += parseFloat(selectedProduct.price);
	});

	var checkoutButton = document.createElement('button');
	checkoutButton.textContent = 'Checkout';
	checkoutButton.addEventListener('click', function() {
		checkout(totalPrice);
	});
	displayElement.append(checkoutButton);

	totalPrice=totalPrice.toFixed(2);
	var totalPriceDisplay = document.createElement('div');
	totalPriceDisplay.textContent = 'Total: '+totalPrice;
	displayElement.append(totalPriceDisplay);
}

function checkout(total) {
	var displayElement = document.getElementById('cart');
	displayElement.innerHTML = '';

	var totalPrice = document.createElement('h3');
	totalPrice.textContent = 'Total: '+total;
	displayElement.append(totalPrice);

	var paymentMethod = document.createElement('h4');
	paymentMethod.textContent = 'Choose Payment Method';
	displayElement.append(paymentMethod);

	var card = document.createElement('button');
	card.textContent = 'Card';
	card.addEventListener('click', function() {
                cardPayment(total);
        });
        displayElement.append(card);

	var cash = document.createElement('button');
        cash.textContent = 'Cash';
        cash.addEventListener('click', function() {
		cashPayment(total);
        });
        displayElement.append(cash);

}

function cardPayment(total){
	var displayElement = document.getElementById('cart');
	displayElement.innerHTML = '';

	var cardText = document.createElement('div');
	cardText.textContent = 'Enter Card Number: ';
	displayElement.append(cardText);

	var cardNumber = document.createElement('input');
	cardNumber.setAttribute('type', 'text');
	displayElement.append(cardNumber);

	var submitButton = document.createElement('button');
	submitButton.textContent = 'Submit';
	submitButton.addEventListener('click', function() {
		finalCheckout(total, 0);
	});
	displayElement.append(submitButton);
}

function cashPayment(total){
	var displayElement = document.getElementById('cart');
        displayElement.innerHTML = '';

        var cashText = document.createElement('div');
        cashText.textContent = 'Enter Cash Amount: ';
        displayElement.append(cashText);

        var cashAmount = document.createElement('input');
        cashAmount.setAttribute('type', 'text');
	cashAmount.setAttribute('id', 'cash');
        displayElement.append(cashAmount);

        var submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.addEventListener('click', function() {
		var cash = parseFloat(document.getElementById('cash').value);
		if(!isNaN(cash) && cash >= total){
                	finalCheckout(total, cash-total);
		}else{
			alert('Must enter an amount greater than or equal to $'+total);
		}
        });
        displayElement.append(submitButton);
}

function finalCheckout(total, change){
	var displayElement = document.getElementById('cart');
        displayElement.innerHTML = '';

	var thankYou = document.createElement('h3');
	thankYou.textContent = 'Thank You for Ordering '+cart.length+' products for $'+total+'!';
	displayElement.append(thankYou);

	var changeMessage = document.createElement('div');
	changeMessage.style.textAlign = 'center';
        changeMessage.textContent = 'You get $'+change.toFixed(2)+' in change';
        displayElement.append(changeMessage);
	
	addOrderToDB();
	ordered(total);
}

function ordered(total) {
	var newPageURL = 'orderedItems.html';
	var newWindow = window.open(newPageURL, '_blank');
	newWindow.onload = function() {
		var displayElement = newWindow.document.getElementById('orderedItems');

		var totalPriceDisplay = document.createElement('h2');
                totalPriceDisplay.textContent = 'Total Price: $'+total;
                displayElement.append(totalPriceDisplay);

		cart.forEach((productId, index) => {
			var cartItem = document.createElement('div');
			var selectedProduct = products.find(product => product.product_id === productId);

			cartItem.textContent = `Item ${index + 1}: ${selectedProduct.name} - $${selectedProduct.price}  `;
			displayElement.append(cartItem);

			var lineBreak = document.createElement('br');
			displayElement.append(lineBreak);

		});
	}

	newWindow.focus();
}

function addOrderToDB(){
	a=$.ajax({
                url: URL + '/getMostRecentOrderNum',
                method: "GET"
        }).done(function(data) {
                var orderNum = parseFloat(data.result[0].order_id)+1;

		cart.forEach((productId, index) =>{
			addProductToDB(orderNum,productId);
		});
        }).fail(function(error) {
                constole.error("Error:", error);
        });	
}

function addProductToDB(order_id,product_id){
	 a=$.ajax({
                url: URL + '/addOrder?order_id='+order_id+'&product_id='+product_id,
                method: "GET"
        }).done(function(data) {
		console.log("Added "+product_id+" to order "+order_id);
	}).fail(function(error) {
		console.error("Error:",error);
	});
}

