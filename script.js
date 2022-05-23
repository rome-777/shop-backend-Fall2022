let inventoryItems = new Map();
let currentShipment = new Map();
let selectedItemId = null;
let nameField = document.getElementById("item-name");
let qtyField = document.getElementById("item-qty");

function validateItemForm() {
	console.log('validating', nameField.value, qtyField.value);
	return true;
}

function getItemFormData() {
	const itemData = {};
	itemData['name'] = document.getElementById("item-name").value;
	itemData['qty'] = document.getElementById("item-qty").value;
	return itemData;
}

function itemFormSubmit() {
	if (validateItemForm()) {
		const itemData = getItemFormData();
		if (selectedItemId == null) {
			createItem(itemData);
		} else {
			updateItem(itemData);
		}
		nameField.value = null;
		qtyField.value = null;
	}
}

function generateId() {
	return Math.floor(Math.random() * 1000)
}

function createItem(data) {
	const id = generateId();
	inventoryItems.set(id, data);
	displayInventoryTable();
}

function updateItem(data) {
	const updateItem = inventoryItems.get(selectedItemId);
	updateItem.name = data.name;
	updateItem.qty = data.qty;
	inventoryItems.set(selectedItemId, updateItem);
	selectedItemId = null;
	displayInventoryTable();
}

function handleEditButton(id) {
	selectedItemId = id;
	const currentData = inventoryItems.get(selectedItemId);
	nameField.value = currentData.name;
	qtyField.value = currentData.qty;
}

function deleteItem(id) {
	inventoryItems.delete(id);
	displayInventoryTable();
}

function displayInventoryTable() {
	let table = document.getElementById("inventory-list-item");
	table.innerHTML = '';
	if (inventoryItems) {
		for (const [key, data] of inventoryItems) {
			let row = document.createElement('tr');

			//data to display
			let cellName = document.createElement('td');
			let name = document.createTextNode(data.name);
			cellName.appendChild(name);
			let cellQty = document.createElement('td');
			let qty = document.createTextNode(data.qty);
			cellQty.appendChild(qty);
			row.appendChild(cellName);
			row.appendChild(cellQty);

			//delete button
			const deleteButton = document.createElement('input');
			deleteButton.setAttribute('type', 'button');
			deleteButton.setAttribute('value', 'Delete');
			deleteButton.setAttribute('onclick', 'deleteItem(' + key + ')');
			row.appendChild(deleteButton);

			//edit button 
			const updateButton = document.createElement('input');
			updateButton.setAttribute('type', 'button');
			updateButton.setAttribute('value', 'Edit');
			updateButton.setAttribute('onclick', 'handleEditButton(' + key + ')');
			row.appendChild(updateButton);

			//add to shipment
			const shipmentQty = document.createElement('input');
			shipmentQty.setAttribute('type', 'number');
			shipmentQty.setAttribute('max', data.qty);
			shipmentQty.setAttribute('min', 0);

			const shipmentButton = document.createElement('input');
			shipmentButton.setAttribute('type', 'button');
			shipmentButton.setAttribute('value', 'Add to Shipment');
			shipmentButton.setAttribute('onclick', `addToShipment(${key})`);
			row.appendChild(shipmentButton); table.appendChild(row);
		}
	}
}

function addToShipment(id){
	if (!currentShipment.get(id)) {
		const shipmentData = {};
		shipmentData['name'] = inventoryItems.get(id).name;
		shipmentData['qty'] = 1;
		currentShipment.set(id, shipmentData);
	}
	displayShipmentTable();
}

function deleteFromShipment(id) {
	currentShipment.delete(id);
	displayShipmentTable();
}

function decreaseShipment(id) {
	if (currentShipment.get(id).qty > 0) {
		currentShipment.get(id).qty--;
	}
	displayShipmentTable()
}

function increaseShipment(id) {
	if (currentShipment.get(id).qty < inventoryItems.get(id).qty) {
		currentShipment.get(id).qty++;
	}
	displayShipmentTable();
}

function displayShipmentTable() {
	let table = document.getElementById("shipment");
	table.innerHTML = '';
	if (currentShipment) {
		for (const [key, data] of currentShipment) {
			let row = document.createElement('tr');

			//data to display
			let cellName = document.createElement('td');
			let name = document.createTextNode(data.name);
			cellName.appendChild(name);
			let cellQty = document.createElement('td');
			let qty = document.createTextNode(data.qty);
			cellQty.appendChild(qty);
			row.appendChild(cellName);
			row.appendChild(cellQty);

			//delete button
			const deleteButton = document.createElement('input');
			deleteButton.setAttribute('type', 'button');
			deleteButton.setAttribute('value', 'Remove');
			deleteButton.setAttribute('onclick', 'deleteFromShipment(' + key + ')');
			row.appendChild(deleteButton);

			//increment button 
			const increaseButton = document.createElement('input');
			increaseButton.setAttribute('type', 'button');
			increaseButton.setAttribute('value', 'Increase Qty');
			increaseButton.setAttribute('onclick', 'increaseShipment(' + key + ')');
			row.appendChild(increaseButton);

			//decrement button 
			const decreaseButton = document.createElement('input');
			decreaseButton.setAttribute('type', 'button');
			decreaseButton.setAttribute('value', 'Decrease Qty');
			decreaseButton.setAttribute('onclick', 'decreaseShipment(' + key + ')');
			row.appendChild(decreaseButton);
			table.appendChild(row);
		}
	}
}
displayInventoryTable();

