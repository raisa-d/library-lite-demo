// main.js
const deleteButtons = document.querySelectorAll('.delete');

Array.from(deleteButtons).forEach(button => {
    button.addEventListener('click', deleteBook);
});

async function deleteBook() {
    try {
        // get book – The LI is the parent node of the delete button. Get text content of the LI
        let bookTitle = this.parentNode.textContent;
        // manipulate string to access the book title from textContent
        bookTitle = bookTitle.trim().split(' by ')[0];
        // make fetch request
        const result = await fetch('/delete', {
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
        console.log(data)
        // refresh page
        location.reload();
    } catch(err) {
        console.error(`Error deleting book: ${err}`);
    };
};