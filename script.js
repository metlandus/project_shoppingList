const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const notyf = new Notyf();
const clearBtn = document.querySelector('#clear');
const filter = document.querySelector('.filter');
const swalModal = document.querySelector('.swal-modal');


function addItem(e) {
    e.preventDefault();
    const newItem = itemInput.value;

    if (newItem === '') {
        notyf.error('Please add an item', "", "error");
        return;
    }
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(newItem));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    itemList.appendChild(li);

    itemInput.value = '';

    updateClearButtonVisibility();
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

function removeItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        e.target.parentElement.parentElement.remove();
    }
    updateClearButtonVisibility();
}


function clearItems() {
    swal({
        text: "Are you sure you want to remove all items?",
        buttons: {confirm: "Yes", cancel: "No"},
    }).then((willDelete) => {
        if (willDelete) {
            itemList.innerHTML = '';
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


itemForm.addEventListener('submit', addItem)
itemList.addEventListener('click', removeItem)
clearBtn.addEventListener('click', clearItems)
filter.addEventListener('input', filterItems)



