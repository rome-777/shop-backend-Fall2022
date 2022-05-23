// data storage
let inventoryItems = new Map();
let currentShipment = new Map();
let selectedItemId = null;

// html actions
let nameField = document.getElementById("item-name");
let qtyField = document.getElementById("item-qty");

// New/Update Inventory Controls
function validateItemForm() {
	if (inventoryItems.size && !selectedItemId) {
		for (const item of inventoryItems.values()) {
			if (item.name === nameField.value) {
				alert('Item already created. Please use the edit button to update');
				return false;
			}
		}
	}
	return true;
}

function getItemFormData() {
	const itemData = {};
	itemData['name'] = nameField.value;
	itemData['qty'] = qtyField.value;
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

// Generate item inventory table
function displayInventoryTable() {
	let table = document.getElementById("inventory-list");
	table.innerHTML = '';
	if (inventoryItems) {
		for (const [key, data] of inventoryItems) {
			// create item name column
			const cellName = document.createElement('td');
			const name = document.createTextNode(data.name);
			cellName.appendChild(name);
			// create item quantity column
			const cellQty = document.createElement('td');
			const qty = document.createTextNode(data.qty);
			cellQty.appendChild(qty);
			// create delete button
			const deleteButton = document.createElement('input');
			deleteButton.setAttribute('type', 'button');
			deleteButton.setAttribute('value', 'Delete');
			deleteButton.setAttribute('onclick', `deleteItem(${key})`);
			// create edit button 
			const updateButton = document.createElement('input');
			updateButton.setAttribute('type', 'button');
			updateButton.setAttribute('value', 'Edit');
			updateButton.setAttribute('onclick', `handleEditButton(${key})`);
			// create 'add to shipment' button
			const shipmentButton = document.createElement('input');
			shipmentButton.setAttribute('type', 'button');
			shipmentButton.setAttribute('value', 'Add to Shipment');
			shipmentButton.setAttribute('onclick', `addToShipment(${key})`);
			// create action buttons column
			const cellActions = document.createElement('td');
			cellActions.appendChild(deleteButton);
			cellActions.appendChild(updateButton);
			cellActions.appendChild(shipmentButton); 
			// create row
			const row = document.createElement('tr');
			row.appendChild(cellName);
			row.appendChild(cellQty);
			row.appendChild(cellActions);
			table.appendChild(row);
		}
	}
}

// Inventory table actions
function handleEditButton(id) {
	selectedItemId = id;
	const currentData = inventoryItems.get(selectedItemId);
	nameField.value = currentData.name;
	qtyField.value = currentData.qty;
}

function deleteItem(id) {
	if (!selectedItemId) {
		inventoryItems.delete(id);
		displayInventoryTable();
	} else {
		alert('Cannot delete item while editing');
		return;
	}
}

function addToShipment(id){
	if (!currentShipment.get(id)) {
		const shipmentData = {};
		const item = inventoryItems.get(id);
		shipmentData['name'] = item.name;
		shipmentData['qty'] = item.qty;
		currentShipment.set(id, shipmentData);
	}
	displayShipmentTable();
}

// Generate shipment table
function displayShipmentTable() {
	let table = document.getElementById("shipment-list");
	table.innerHTML = '';
	if (currentShipment) {
		for (const [key, data] of currentShipment) {
			// create item name column *same*
			const cellName = document.createElement('td');
			const name = document.createTextNode(data.name);
			cellName.appendChild(name);
			// create item quantity column *same*
			const cellQty = document.createElement('input')
			cellQty.setAttribute('type', 'number');
			cellQty.setAttribute('value', `${data.qty}`);
			cellQty.setAttribute('min', '1');
			cellQty.setAttribute('max', `${data.qty}`);
			cellQty.addEventListener('change', checkBoundaries);
			// create remove button
			const removeButton = document.createElement('input');
			removeButton.setAttribute('type', 'button');
			removeButton.setAttribute('value', 'Remove');
			removeButton.setAttribute('onclick', `removeFromShipment(${key})`);
			// create action buttons column *same*
			const cellActions = document.createElement('td');
			cellActions.appendChild(removeButton);
			// create row *same*
			const row = document.createElement('tr');
			row.appendChild(cellName);
			row.appendChild(cellQty);
			row.appendChild(cellActions);
			table.appendChild(row);
		}
	}
}

// Shipment table actions
function removeFromShipment(id) {
	currentShipment.delete(id);
	displayShipmentTable();
}

function checkBoundaries(e) {
	const currVal = Number(e.target.value);
	if (currVal < e.target.min) {
		e.target.value = 1;	
	} else if (currVal > e.target.max) {
		e.target.value = e.target.max;	
	} else { 
		return;
	}
}