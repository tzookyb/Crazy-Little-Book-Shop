'use strict'
const LOCALE = {
    'en': { code: 'en-US', currency: 'USD' },
    'he': { code: 'he-IL', currency: 'ILS' }
}

$(document).ready(function () {
    loadBooks();
    sortBooks();
    loadCurrentLanguage();
    onChangeLang();
    renderBooks();
});

function onPreventClose(ev) {
    ev.stopPropagation();
}
function renderBooks() {
    var books = getBooks();
    var strHTML = '';
    books.forEach(function (book) {
        strHTML += `
            <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${formatNumber(book.price)}</td>
            <td class="actions">
            <button class="info-btn" onclick="onReadInfo('${book.id}')" data-trans="info-btn">Info</button>
            <button class="update-btn" onclick="onShowUpdateModal('${book.id}')" data-trans="update-btn">Update</button>
            <button class="delete-btn" onclick="onRemoveBook('${book.id}')" data-trans="remove-btn">Remove</button>
            </td>
            </tr>
            `
    });
    $('tbody').html(strHTML);
    $('.book-total').html(`<span data-trans="book-total">Total number of books:</span> ${gBooks.length}`);
    renderPageSelector();
    doTranslate();
}
function renderPageSelector() {
    var strHTML = '';
    var numOfPages = gBooks.length / gBooksPerPage;
    if (gCurrPageIdx > 0) strHTML += `<button class="page-num" onclick="onChangePage(${gCurrPageIdx - 1})"> < </button>`
    for (var i = 0; i < numOfPages; i++) {
        if (i === gCurrPageIdx) {
            strHTML += `<button class="page-num curr-page" onclick="onChangePage(${i})">${i + 1}</button>`;
        }
        else {
            strHTML += `<button class="page-num" onclick="onChangePage(${i})">${i + 1}</button>`;
        }
    }
    if (gCurrPageIdx < numOfPages-1) strHTML += `<button class="page-num" onclick="onChangePage(${gCurrPageIdx + 1})"> > </button>`
    $('.page-selector').html(strHTML);
}
function onRemoveBook(bookId) {
    removeBook(bookId);
    renderBooks();
}
function onShowAddModal() {
    var strHTML = '';
    strHTML += `
            <h2>${gTrans['add-book-title'][gCurrLang]}</h2>
            <input type="text" class="book-name" placeholder="${gTrans['add-book-placeholder'][gCurrLang]}" /></input>
                ${gTrans['add-book-price'][gCurrLang]}<input type="number" class="book-price" placeholder=""/></input>
                    <button onclick="onAddBook()">${gTrans['add-btn'][gCurrLang]}</button>
    `
    $('.modal-content').html(strHTML);
    $('.modal').show(400);
}
function onAddBook() {
    var name = $('.book-name').val();
    var price = $('.book-price').val();
    $('.modal').hide(400);
    $('.modal-content').html('');
    addBook(name, price);
    renderBooks();
}
function onShowUpdateModal(bookId) {
    var book = getBooks(bookId);
    var strHTML = '';
    strHTML += `
            <h2>${book.title}</h2>
            <img src="img/${book.title}.jpg" height=400px />
                <p>${gTrans['book-price'][gCurrLang]} ${formatNumber(book.price)}</p>
                <input type="number" onclick="" class="update-price book-price" placeholder="${gTrans['update-price-placeholder'][gCurrLang]}" /></input >
                    <button onclick="onUpdateBookPrice('${bookId}')">${gTrans['update-btn'][gCurrLang]}</button>
    `
    $('.modal-content').html(strHTML);
    $('.modal').show(400);
}
function onUpdateBookPrice(bookId) {
    var updatedPrice = $('.update-price').val();
    $('.modal').hide(400);
    $('.modal-content').html('');
    updateBookPrice(bookId, updatedPrice);
    renderBooks();
}
function onReadInfo(bookId) {
    var strHTML = '';
    var book = getBooks(bookId);
    strHTML = `
        <h2>${book.title}</h2>
        <img src="img/${book.title}.jpg" alt="Book Cover Image" height=400px />
        <p>${book.info}</p>
        <p class="price">${gTrans['book-price'][gCurrLang]} ${formatNumber(book.price)}</p>
        <span class="rating">${gTrans['rating'][gCurrLang]}
        <button onclick="onChangeRating('${book.id}','down')">-</button>
        <span>${book.rating}</span>
        <button onclick="onChangeRating('${book.id}', 'up')">+</button>
        </span>
    `
    $('.modal-content').html(strHTML);
    $('.modal').show(400);
}
function onChangeRating(bookId, direction) {
    changeRating(bookId, direction);
    onReadInfo(bookId);
}
function onCloseModal() {
    $('.modal').hide(400);
    $('.modal-content').html('');
}
function onSortBy(criteria) {
    sortBooks(criteria)
    renderBooks();
}
function onChangePage(pageNum) {
    changePage(pageNum);
    renderBooks();
}
function onChangeLang() {
    $('body').removeClass(gCurrLang);
    var lang = $('.lang-select').val();
    $('body').addClass(lang);
    changeLang(lang);
    renderBooks();
}
function doTranslate() {
    var els = document.querySelectorAll('[data-trans');
    els.forEach(element => {
        $(element).text(gTrans[element.dataset.trans][gCurrLang]);

    });
}
function setLanguage(lang) {
    $('.lang-select').val(lang);
}
function formatNumber(num) {
    return new Intl.NumberFormat(LOCALE[gCurrLang].code,
        { style: 'currency', currency: LOCALE[gCurrLang].currency }).format(num);
}