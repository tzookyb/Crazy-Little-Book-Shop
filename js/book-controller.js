'use strict'
var gElTable = document.querySelector('.table');
var gElModal = document.querySelector('.modal');
var gElPageSelector = document.querySelector('.page-selector');

$(document).ready(function () {
    loadBooks();
    renderBooks();
});

function renderBooks() {
    var books = getBooks();
    var strHTML = '';
    strHTML += `
    <table border=1 cellpadding=20>
    <thead>
    <tr>
    <td width=10% onclick="onSortBy('id')">Id</td>
    <td onclick="onSortBy('title')">Title</td>
    <td width=10% onclick="onSortBy('price')">Price</td>
    <td width=20%>Actions</td>
    </tr>
    </thead>
    `
    books.forEach(function (book) {
        strHTML += `
            <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td class="actions">
            <button class="info-btn" onclick="onReadInfo('${book.id}')">Info</button>
            <button class="update-btn" onclick="onShowUpdateModal('${book.id}')">Update</button>
            <button class="delete-btn" onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
            </tr>
            `
    });
    strHTML += '</table>';
    gElTable.innerHTML = strHTML;
    var elBookTotal = document.querySelector('.book-total')
    elBookTotal.innerText = `Total number of books: ${gBooks.length}`;
    renderPageSelector();
    console.log('Render completed.');
}
function renderPageSelector() {
    var strHTML = '';
    var numOfPages = gBooks.length / gBooksPerPage;
    for (var i = 0; i < numOfPages; i++) {
        if (i === gCurrPageIdx) {
            strHTML += `<button class="page-num curr-page" onclick="onChangePage(${i})">${i + 1}</button>`;
        }
        else {
            strHTML += `<button class="page-num" onclick="onChangePage(${i})">${i + 1}</button>`;
        }
    }
    gElPageSelector.innerHTML = strHTML;
}
function onRemoveBook(bookId) {
    removeBook(bookId);
    renderBooks();
}
function onShowAddModal() {
    var strHTML = '';
    strHTML += `
        <button onclick="onCloseModal()">X</button>
            <h2>Add a book to database</h2>
            <input type="text" class="book-name" placeholder="Enter book title" /></input>
                Enter book price:<input type="number" class="book-price" placeholder=""/></input>
                    <button onclick="onAddBook()">Add</button>
    `
    gElModal.innerHTML = strHTML;
    gElModal.style.visibility = 'visible';
}
function onAddBook() {
    var name = document.querySelector('.book-name').value;
    var price = document.querySelector('.book-price').value;
    gElModal.style.visibility = 'hidden';
    gElModal.innerHTML = '';
    addBook(name, price);
    renderBooks();
}
function onShowUpdateModal(bookId) {
    var book = getBooks(bookId);
    var strHTML = '';
    strHTML += `
        < button onclick = "onCloseModal()" > X</button >
            <h2>${book.title}</h2>
            <img src="img/${book.img}" height=400px />
                <p>Book Price: ${book.price}</p>
                <input type="number" class="update-price" placeholder="Enter updated price" /></input >
                    <button onclick="onUpdateBookPrice('${bookId}')">Update</button>
    `
    gElModal.innerHTML = strHTML;
    gElModal.style.visibility = 'visible';
}
function onUpdateBookPrice(bookId) {
    var updatedPrice = document.querySelector('.update-price').value;
    gElModal.style.visibility = 'hidden';
    gElModal.innerHTML = '';
    updateBookPrice(bookId, updatedPrice);
    renderBooks();
}
function onReadInfo(bookId) {
    var strHTML = '';
    var book = getBooks(bookId);
    strHTML = `
        <button onclick="onCloseModal()">X</button>
        <h2>${book.title}</h2>
        <img src="img/${book.title}.jpg" alt="Book Cover Image" height=400px />
        <p>${book.info}</p>
        <p class="price">Book Price: ${book.price}</p>
        <span class="rating">Rating:
        <button onclick="onChangeRating('${book.id}','down')">-</button>
        <span>${book.rating}</span>
        <button onclick="onChangeRating('${book.id}', 'up')">+</button>
        </span>
    `
    gElModal.innerHTML = strHTML;
    gElModal.style.visibility = 'visible';
}
function onChangeRating(bookId, direction) {
    changeRating(bookId, direction);
    onReadInfo(bookId);
}
function onCloseModal() {
    gElModal.style.visibility = 'hidden';
    gElModal.innerHTML = '';
}
function onSortBy(criteria) {
    sortBooks(criteria)
    renderBooks();
}
function onChangePage(pageNum) {
    changePage(pageNum);
    renderBooks();
}