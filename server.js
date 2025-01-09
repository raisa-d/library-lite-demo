// server.js

/* ===========
IMPORTS
=========== */
import express from 'express'; // import express with ES Modules
import { MongoClient, ServerApiVersion } from 'mongodb'; // import MongoClient with ES Modules

/* ===========
VARIABLES
=========== */
const app = express(); // create instance of Express app
const PORT = process.env.PORT;
const uri = process.env.DB_STRING;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
};

/* ===========
CONNECTING TO DATABASE
=========== */
async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(uri, options);
    console.log('Connected to DB');
    const db = client.db('Library');
    const books = db.collection('bookData');
    return books;
  } catch(err) {
    console.error(err);
  };
};

/* ===========
SERVER AND API
=========== */
function createServer(books) {
  app.set('view engine', 'ejs');

  /* ===========
  MIDDLEWARE
  =========== */
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static('public'));

  /* ===========
  ROUTE HANDLERS 
  =========== */
  // handle GET request
  app.get('/', async (request, response) => {
    try {
      const bookList = await books.find().toArray();
      response.render('index.ejs', { bookList: bookList }) // render EJS, pass in bookList
    } catch(err) {
      console.error(`Error retrieving list of books ${err}`);
    };
  });

  // handle POST request - add new book
  app.post('/add', async (request, response) => {
    try {
      const result = await books.insertOne({
        title: request.body.title,
        author: request.body.author,
        read: false
      });
      response.redirect('/');
    } catch(err) {
      console.error(`Could not add book: ${err}`);
      response.status(500);
    };
  });

  // handle DELETE request - delete book
  app.delete('/delete', async (request, response) => {
    try {
      // delete book by title
      const result = await books.deleteOne({title: request.body.title});
      response.json('Book deleted');
    } catch(err) {
      console.error(`Failed to delete book: ${err}`);
    };
  });

  // handle UPDATE request - mark read
  app.put('/markRead', async (request, response) => await markBook(request, response, true, books));

  // handle UPDATE request - mark unread
  app.put('/markUnread', async (request, response) => await markBook(request, response, false, books));

  // have server listen on PORT
  app.listen(PORT, () => console.log('Server is running away!!!'));
};

// function to mark book as read or unread
async function markBook (request, response, read, books) {
  try {
    const result = await books.updateOne({
      title: request.body.title
    },{
      $set: {
        read: read
      }
    });
    response.json(`Marked ${read ? 'Read' : 'Unread'}`)
  } catch(err) {
    console.log(`Failed to mark book as ${read ? 'read' : 'unread'}: ${err}`);
  }
};

/* ===========
START APPLICATION
=========== */
async function main() {
  try {
    const books = await connectToDatabase();
    createServer(books);
  } catch(err) {
    console.error(`Failed to start application: ${err}`);
  };
};

// run app
main();