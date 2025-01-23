// main.js
const deleteButtons = Array.from(document.querySelectorAll('.delete'));
const markReadButtons = Array.from(document.querySelectorAll('.mark-read'));
const markUnreadButtons = Array.from(document.querySelectorAll('.mark-unread'));

deleteButtons.forEach(button => {
    button.addEventListener('click', deleteBook);
});

markReadButtons.forEach(button => {
    button.addEventListener('click', markRead);
});

markUnreadButtons.forEach(button => {
    button.addEventListener('click', markUnread);
});

async function deleteBook() {
    try {
        // get book – The LI is the parent node of the delete button. Get text content of the LI
        let bookTitle = this.parentNode.textContent;
        // manipulate string to access the book title from textContent
        bookTitle = bookTitle.trim().split(' by ')[0];
        // make fetch request
        const result = await fetch('/deleteBook', {
            // specify the delete HTTP method
            method: 'delete',
            // specify we are sending JSON
            headers: {'Content-Type': 'application/json'},
            // send the title to the backend
            body: JSON.stringify({
                title: bookTitle
            })
        })
        // get response, which is "Book deleted"
        const data = await result.json();
        console.log(data);
        // refresh page
        location.reload();
    } catch(err) {
        console.error(`Error deleting book: ${err}`);
    };
};

async function mark(endpoint, bookTitle) {
    try {
        const result = await fetch(endpoint, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: bookTitle
            })
        });
        const data = await result.json();
        location.reload();
    } catch(err) {
        console.error(`Error marking book: ${err}`);
    };
};

async function markRead() {
    let bookTitle = this.parentNode.textContent;
    bookTitle = bookTitle.trim().split(' by ')[0];
    await mark('/markRead', bookTitle);
};

async function markUnread() {
    let bookTitle = this.parentNode.textContent;
    bookTitle = bookTitle.trim().split(' by ')[0];
    await mark('/markUnread', bookTitle);
};