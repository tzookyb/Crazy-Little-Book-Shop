'use strict'
const gBooksPerPage = 4;
var gBooks = [];
var gSortBy;
var gCurrPageIdx = 0;

function getBooks(bookId) {
    if (!bookId) {
        var pageStartIdx = gCurrPageIdx * gBooksPerPage;
        var pageEndIdx = pageStartIdx + gBooksPerPage;
        return gBooks.slice(pageStartIdx, pageEndIdx);
    }
    return gBooks[getBookIndex(bookId)];
}
function saveBooks() {
    saveToStorage('books', gBooks);
}
function loadBooks() {
    var books = loadFromStorage('books');
    if (!books || !books.length) {
        console.log('no books available, creating default...');
        _createBooks();
    }
    gBooks = books;
    console.log('books DB loaded');
}
function _createBooks() {
    _createBook('Lord of The Rings', 88.90, 'In a sleepy village in the Shire, young Frodo Baggins finds himself faced with an immense task, as his elderly cousin Bilbo entrusts the Ring to his care. Frodo must leave his home and make a perilous journey across Middle-earth to the Cracks of Doom, there to destroy the Ring and foil the Dark Lord in his evil purpose.');
    _createBook('Predictably Irrational', 38.65, 'Predictably Irrational is the bestselling book on irrational consumer behaviour by psychologist and MIT professor Dan Ariely.  The main thrust of the book is that consumers are systematically irrational in their behaviour – at best making sub-optimal choices, and at worst engaging in self-punishing behaviour.');
    _createBook('A Thousand Splendid Suns', 45.20, 'Propelled by the same superb instinct for storytelling that made The Kite Runner a beloved classic, A Thousand Splendid Suns is at once an incredible chronicle of thirty years of Afghan history and a deeply moving story of family, friendship, faith, and the salvation to be found in love.');
    _createBook('The Alchemist', 65.20, 'The Alchemist follows the journey of an Andalusian shepherd boy named Santiago. Believing a recurring dream to be prophetic, he asks a Gypsy fortune teller in the nearby town about its meaning. The woman interprets the dream as a prophecy telling the boy that he will discover a treasure at the Egyptian pyramids.');
    _createBook('Mr. Vertigo', 55.10, 'Vertigo tells the story of Walter Claireborne Rawley, in short Walt. He is a neglected orphan dwelling on the streets of St. Louis. Master Yehudi takes the boy to a lone house in the countryside to teach Walt how to fly.');
    console.log('default books created successfuly.');
}
function _createBook(title, price, info) {
    var book = {
        id: makeId(),
        title: title,
        price: price,
        info: info,
        rating: 0,
    }
    gBooks.push(book);
    console.log('created book:', book);
    console.log('current DB state:', gBooks);
    saveBooks();
}
function getBookIndex(bookId) {
    return gBooks.findIndex(function (book) {
        return (book.id === bookId);
    });
}
function removeBook(bookId) {
    console.log('book id to remove:', bookId);
    var idx = getBookIndex(bookId);
    gBooks.splice(idx, 1);
    console.log('book', bookId, 'removed.');
    saveBooks();
}
function addBook(name, price) {
    _createBook(name, price);
}
function updateBookPrice(bookId, updatedPrice) {
    var idx = getBookIndex(bookId);
    gBooks[idx].price = updatedPrice;
    console.log('price for book:', bookId, 'updated to:', updatedPrice);
    saveBooks();
}
function changeRating(bookId, direction) {
    var idx = getBookIndex(bookId);
    var book = gBooks[idx];
    if (direction === 'up') {
        if (book.rating === 10) return;
        book.rating++;
    }
    else if (direction === 'down') {
        if (book.rating === 0) return;
        book.rating--;
    }
    saveBooks();
}
function sortBooks(criteria = 'title') {
    var books = gBooks;
    gSortBy = criteria;
    books.sort(_compareBooks);
    gBooks = books;
}
function _compareBooks(book1, book2) {
    if (book1[gSortBy] < book2[gSortBy]) return -1;
    if (book1[gSortBy] > book2[gSortBy]) return 1;
    return 0;
}
function changePage(pageNum){
    gCurrPageIdx = pageNum;
}