// data storage
let inventoryItems = new Map();
let currentShipment = new Map();
let prevShipments = new Map();
let selectedItemId = null;

// html form fields
let nameField = document.getElementById("item-name");
let qtyField = document.getElementById("item-qty");

// Create/Update Inventory Form Controls
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
	let tableRows = document.getElementById("inventory-list");
	tableRows.innerHTML = '';
	if (inventoryItems.size) {
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
			// create row with data
			const row = document.createElement('tr');
			row.appendChild(cellName);
			row.appendChild(cellQty);
			row.appendChild(cellActions);
			tableRows.appendChild(row);
		}
	} else {
		tableRows.appendChild(noItemsDisplayed());
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
	if (!selectedItemId && !currentShipment.size) {
		inventoryItems.delete(id);
		displayInventoryTable();
	} else {
		alert('Cannot delete item while editing or preparing shipment');
		return;
	}
}

function addToShipment(id){
	if (!currentShipment.get(id)) {
		const shipmentData = {};
		const item = inventoryItems.get(id);
		shipmentData['name'] = item.name;
		shipmentData['qty'] = 1;
		currentShipment.set(id, shipmentData);
	} else {
		alert('Item already added to shipment')
	}
	displayShipmentTable();
}

// Generate shipment table
function displayShipmentTable() {
	let tableRows = document.getElementById("shipment-list");
	tableRows.innerHTML = '';
	if (currentShipment.size) {
		// populate table
		for (const [key, data] of currentShipment) {
			// create item name column
			const cellName = document.createElement('td');
			const name = document.createTextNode(data.name);
			cellName.appendChild(name);
			// create item quantity column
			const cellQty = document.createElement('input')
			cellQty.setAttribute('type', 'number');
			cellQty.setAttribute('value', `${data.qty}`);
			cellQty.setAttribute('min', '1');
			cellQty.setAttribute('max', `${inventoryItems.get(key).qty}`);
			cellQty.addEventListener('change',(e) => handleChange(key, e));
			// create remove button
			const removeButton = document.createElement('input');
			removeButton.setAttribute('type', 'button');
			removeButton.setAttribute('value', 'Remove');
			removeButton.setAttribute('onclick', `removeFromShipment(${key})`);
			// create action buttons column
			const cellActions = document.createElement('td');
			cellActions.appendChild(removeButton);
			// create row with data
			const row = document.createElement('tr');
			row.appendChild(cellName);
			row.appendChild(cellQty);
			row.appendChild(cellActions);
			tableRows.appendChild(row);
		}
		// create 'submit shipment button'
		const submitShipmentButton = document.createElement('input');
		submitShipmentButton.setAttribute('type', 'button');
		submitShipmentButton.setAttribute('value', 'Submit Shipment');
		submitShipmentButton.setAttribute('onclick', `submitShipment()`);
		tableRows.appendChild(document.createElement('br'));
		tableRows.appendChild(submitShipmentButton);
	} else {
		tableRows.appendChild(noItemsDisplayed());
	}
}

// Shipment table actions
function removeFromShipment(id) {
	currentShipment.delete(id);
	displayShipmentTable();
}

function handleChange(key, e) {
	const currVal = Number(e.target.value);
	if (currVal < e.target.min) {
		e.target.value = 1;	
	}
	if (currVal > e.target.max) {
		e.target.value = e.target.max;	
	}
	currentShipment.get(key).qty = e.target.value;
}

function submitShipment() {
	if (selectedItemId) {
		alert('Cannot submit shipment while editing');
		return;
	}
	// store current shipment data
	const id = generateId();
	prevShipments.set(id, currentShipment);
	// update inventory (delete inventory if qty is zero)
	for (const [key, data] of currentShipment) {
		const item = inventoryItems.get(key);
		item.qty = item.qty - data.qty;
		if (item.qty == 0) {
			inventoryItems.delete(key);
		}
	}
	// clear shipment table
	currentShipment.clear();
	displayInventoryTable();
	displayShipmentTable();
}

function displayPrevShipments() {
	// map prevShipments into ListItems and display in HTML
}

// build initial tables
function noItemsDisplayed() {
	const noItemsMsg = document.createElement('td');
	const text = document.createTextNode('< empty >');
	noItemsMsg.appendChild(text);
	return noItemsMsg;
}
displayInventoryTable();
displayShipmentTable();
