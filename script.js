const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const notyf = new Notyf();
const clearBtn = document.querySelector('#clear');
const filter = document.querySelector('.filter');
const swalModal = document.querySelector('.swal-modal');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach(item => {
        addItemToDom(item);
    });

    updateClearButtonVisibility();
}

function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value;

    if (newItem === '') {
        notyf.error('Please add an item', "", "error");
        return;
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove("edit-mode");
        itemToEdit.remove();
        addItemToDom(newItem);
        addItemToStorage(newItem);
        formBtn.style.backgroundColor = "#333";
        isEditMode = false;
        formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
        updateClearButtonVisibility();
        return;
    }

    addItemToDom(newItem);

    addItemToStorage(newItem);

    updateClearButtonVisibility();
}

function addItemToDom(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    itemList.appendChild(li);
    itemInput.value = '';
}

function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage = localStorage.getItem('items');

    if (itemsFromStorage === null) {
        itemsFromStorage = [];
    }
    else {
        itemsFromStorage = JSON.parse(itemsFromStorage);
    }

    return itemsFromStorage;
}

function createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
}

function removeItem(item) {
    item.remove();

    removeItemFromStorage(item.textContent);

    updateClearButtonVisibility();
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        setItemToEdit(e.target)
    }

    updateClearButtonVisibility();
}

function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => { i.classList.remove("edit-mode") });
    item.classList.add("edit-mode");
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = "#228b22"
    itemInput.value = item.innerText;
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);


    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
    swal({
        text: "Are you sure you want to remove all items?",
        buttons: { confirm: "Yes", cancel: "No" },
    }).then((willDelete) => {
        if (willDelete) {
            itemList.innerHTML = '';
            localStorage.clear();
            notyf.success('All items removed');
            updateClearButtonVisibility();
        }
    });
}

function countItems() {
    return itemList.querySelectorAll('li').length;
}

function updateClearButtonVisibility() {
    if (countItems() === 0) {
        clearBtn.style.display = 'none';
        filter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        filter.style.display = 'block';
    }
}

function filterItems(e) {
    const text = e.target.value.toLowerCase();
    items = itemList.querySelectorAll('li');
    items.forEach(item => {
        const itemName = item.innerText.toLowerCase();
        if (itemName.includes(text)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    })
}


function init() {
    itemForm.addEventListener('submit', onAddItemSubmit)
    itemList.addEventListener('click', onClickItem)
    clearBtn.addEventListener('click', clearItems)
    filter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)
    updateClearButtonVisibility();
}

init();